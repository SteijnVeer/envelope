import { useStoreValue } from '@/contexts/store';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useRef } from 'react';

declare global {
  interface TranslatorLanguageMap {}
  interface TranslatorParamMap {}
}

// --- Types ---

type HasParsedParamMap = keyof TranslatorParamMap extends never ? false : true;

export type Language = keyof TranslatorLanguageMap extends never
  ? string
  : keyof TranslatorLanguageMap | 'default';

type ParamsMap = HasParsedParamMap extends true
  ? TranslatorParamMap
  : Record<string, string>;

export type TranslationKey = keyof ParamsMap;

export type ParamsOf<K extends TranslationKey> = ParamsMap[K];

export type IfHasParams<K extends TranslationKey | string, Yes, No> = HasParsedParamMap extends true
  ? K extends TranslationKey
    ? [ParamsOf<K & TranslationKey>] extends [never]
      ? No
      : Yes
    : No
  : Yes;

export type ParamsRecord<P extends string = string> = Record<P, string | number>;

export type ParamsForKey = HasParsedParamMap extends true
  ? {
      [K in TranslationKey as ParamsOf<K> extends never ? never : K]: ParamsRecord<ParamsOf<K>>
    }
  : Record<string, ParamsRecord | undefined>;

type ParamsTuple<K extends TranslationKey> = HasParsedParamMap extends true
  ? IfHasParams<K, [params: ParamsRecord<ParamsOf<K>>], []>
  : [params?: ParamsRecord];

export type ParamProp<K extends TranslationKey | string> = HasParsedParamMap extends true
  ? K extends keyof ParamsForKey
    ? { params: ParamsForKey[K] }
    : { params?: undefined }
  : { params?: ParamsRecord };

export type TranslateFn = HasParsedParamMap extends true
  ? {
      <K extends TranslationKey>(key: K, ...args: ParamsTuple<K>): string;
      (key: string, params?: ParamsRecord): string;
    }
  : {
      (key: string, params?: ParamsRecord): string
    };

type LanguageOption = Exclude<Language, 'default'>;

type Translation = Record<TranslationKey, string>;

// --- Helpers ---

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
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslateFn;
};

const TranslatorContext = createContext<TranslatorContextValue>({
  lang: 'default',
  setLang: () => {},
  t: ((key: string) => key) as TranslateFn,
});

// --- Provider ---

export type TranslatorProviderProps = {
  children?: ReactNode;
  defaultLang: LanguageOption;
  initialLang?: Language;
  translations: Record<LanguageOption, Translation>;
};

export function TranslatorProvider({ children, defaultLang, initialLang, translations }: TranslatorProviderProps) {
  const [storedLang, setStoredLang] = useStoreValue('language');

  const lang: Language = (storedLang as Language | null) ?? initialLang ?? defaultLang;

  const translationsRef = useRef(translations);
  translationsRef.current = translations;
  const defaultLangRef = useRef(defaultLang);
  defaultLangRef.current = defaultLang;

  const setLang = useCallback((next: Language) => setStoredLang(next), [setStoredLang]);

  const value = useMemo<TranslatorContextValue>(
    () => ({
      lang,
      setLang,
      t: ((key: string, params?: ParamsRecord) => {
        const resolved = lang === 'default' ? defaultLangRef.current : lang as LanguageOption;
        const dict = translationsRef.current[resolved] as Record<string, string> | undefined;
        const raw = dict?.[key] ?? key;
        if (!params)
          return raw;
        return applyParams(raw, key, params);
      }) as TranslateFn,
    }),
    [lang, setLang],
  );

  return (
    <TranslatorContext.Provider
      value={value}
    >
      {children}
    </TranslatorContext.Provider>
  );
}

// --- Hooks ---

export function useTranslations(): TranslateFn {
  return useContext(TranslatorContext).t;
}

export function useTranslation<K extends TranslationKey>(
  key: K,
  ...args: ParamsTuple<K>
): string;
export function useTranslation(key: string, params?: ParamsRecord): string;
export function useTranslation(key: string, params?: ParamsRecord): string {
  return useTranslations()(key, params);
}

export function useLanguage(): [Language, (lang: Language) => void] {
  const { lang, setLang } = useContext(TranslatorContext);
  return [lang, setLang];
}
