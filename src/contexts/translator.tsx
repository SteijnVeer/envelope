import { useStoreValue } from '@/contexts/store';
import { getLocales } from 'expo-localization';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';

// --- Types ---

declare global {
  interface TranslatorLanguageSet {}
  interface TranslatorParamMap {}
}

export type LanguageMode = keyof TranslatorLanguageSet extends never ? string : keyof TranslatorLanguageSet;
export type LanguageSetting = LanguageMode | 'default' | 'auto';

namespace StrictParamTypes {
  export type TranslationKey = keyof TranslatorParamMap;
  export type ParamsTuple<K extends TranslationKey> =
    [TranslatorParamMap[K]] extends [never]
      ? []
      : [params: ParamsRecord<TranslatorParamMap[K]>];
  export type ParamProp<K extends string> =
    ParamsTuple<K & TranslationKey> extends [infer P extends ParamsRecord]
      ? { params: P }
      : { params?: undefined };
  export type TranslateFn = {
    <K extends TranslationKey>(key: K, ...args: ParamsTuple<K>): string;
    (key: string, params?: ParamsRecord): string;
  };
}

namespace FallbackParamsTypes {
  export type TranslationKey = string;
  export type ParamsTuple = [params?: ParamsRecord];
  export type ParamProp = { params?: ParamsRecord };
  export type TranslateFn = (key: string, params?: ParamsRecord) => string;
}

type IsStrict = keyof TranslatorParamMap extends never ? false : true;

export type TranslationKey = IsStrict extends true ? StrictParamTypes.TranslationKey : FallbackParamsTypes.TranslationKey;
export type ParamProp<K extends string> = IsStrict extends true ? StrictParamTypes.ParamProp<K> : FallbackParamsTypes.ParamProp;

type TranslateFn = IsStrict extends true ? StrictParamTypes.TranslateFn : FallbackParamsTypes.TranslateFn;
type ParamsTuple<K extends TranslationKey> = IsStrict extends true
  ? StrictParamTypes.ParamsTuple<K & StrictParamTypes.TranslationKey>
  : FallbackParamsTypes.ParamsTuple;

type ParamsRecord<P extends string = string> = Record<P, string | number>;
type Translation = Record<TranslationKey, string>;

// --- Helpers ---

function resolveAutoLang(availableKeys: string[], defaultLang: LanguageMode): LanguageMode {
  for (const { languageTag, languageCode } of getLocales()) {
    const code = languageCode ?? languageTag.split('-')[0];
    if (availableKeys.includes(code))
      return code as LanguageMode;
  }
  return defaultLang;
}

function applyParams(raw: string, key: string, params: ParamsRecord): string {
  return raw.replace(/\{\{(\w+)\}\}|\{(\w+)\}/g, (match, escaped, param) => {
    if (escaped !== undefined)
      return `{${escaped}}`;
    const value = params[param];
    if (value === undefined) {
      console.warn(`[i18n] Missing param "${param}" for key "${key}"`);
      return match;
    }
    return String(value);
  });
}

// --- Context ---

type TranslatorContextValue = {
  lang: LanguageMode;
  langs: LanguageMode[];
  langSetting: LanguageSetting;
  setLang: (lang: LanguageSetting) => void;
  t: TranslateFn;
};

const TranslatorContext = createContext<TranslatorContextValue>({
  lang: 'undefined' as LanguageMode,
  langs: [],
  langSetting: 'undefined' as LanguageSetting,
  setLang: () => {},
  t: ((key: string) => key) as TranslateFn,
});

// --- Provider ---

export type TranslatorProviderProps = {
  children?: ReactNode;
  defaultLang: LanguageMode;
  initialLang?: LanguageSetting;
  translations: Record<LanguageMode, Translation>;
};

export function TranslatorProvider({ children, defaultLang, initialLang, translations }: TranslatorProviderProps) {
  const [storedLang, setLang] = useStoreValue('language');
  const langs = Object.keys(translations) as LanguageMode[];

  const langSetting = useMemo<LanguageSetting>(() =>
    storedLang as LanguageSetting | null
    ?? initialLang
    ?? defaultLang
  , [storedLang, initialLang, defaultLang]);

  const lang = useMemo<LanguageMode>(() => 
    langSetting === 'default'
      ? defaultLang
      : langSetting === 'auto'
        ? resolveAutoLang(langs, defaultLang)
        : langSetting
  , [langSetting, defaultLang, langs]);

  const t = useCallback<TranslateFn>(
    ((key: string, params?: ParamsRecord) => {
      const dict = (translations[lang]/* ?? translations[defaultLang] <- enable in prod to have fallback instead of raw! */) as Record<string, string> | undefined;
      return dict === undefined || dict[key] === undefined
        ? key
        : !params
          ? dict[key]
          : applyParams(dict[key], key, params);
    }),
    [lang, translations],
  );

  return (
    <TranslatorContext.Provider
      value={{
        lang,
        langs,
        langSetting,
        setLang,
        t,
      }}
    >
      {children}
    </TranslatorContext.Provider>
  );
}

// --- Hooks ---

export function useTranslations(): TranslateFn {
  return useContext(TranslatorContext).t;
}

export function useTranslation<K extends TranslationKey>(key: K, ...args: ParamsTuple<K>): string;
export function useTranslation(key: string, params?: ParamsRecord): string;
export function useTranslation(key: string, params?: ParamsRecord): string {
  return useTranslations()(key, params);
}

export function useLanguage(): Omit<TranslatorContextValue, 't'> {
  const { lang, langs, langSetting, setLang } = useContext(TranslatorContext);
  return { lang, langs, langSetting, setLang };
}
