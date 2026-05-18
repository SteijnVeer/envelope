import en from '@/assets/languages/en.json';
import nl from '@/assets/languages/nl.json';
import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

// --- Types ---

export type Language = 'en' | 'nl' | 'default';

export type TranslationKey = keyof typeof en;

type Translation = typeof en;

// --- Internal ---

const DEFAULT_LANG: Language = 'en';

const DEFAULT_TRANSLATION: Translation = en;

const TRANSLATIONS: Record<Language, Translation> = {
  default: DEFAULT_TRANSLATION,
  en,
  nl: nl as Translation, // nl is incomplete; missing keys fall back to the key string at runtime
} as const;

function translate<K extends TranslationKey | string>(lang: Language, key: K): K extends TranslationKey ? Translation[K] : K {
  const dict = TRANSLATIONS[lang] ?? DEFAULT_TRANSLATION;
  if (key in dict)
    return (dict as any)[key] ?? (key as any);
  return key as any;
}

type TranslatorContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: <K extends TranslationKey | string>(key: K) => K extends TranslationKey ? Translation[K] : K;
};

const TranslatorContext = createContext<TranslatorContextValue>({
  lang: 'none' as Language,
  setLang: () => {},
  t: (key) => key as any,
});

// --- Provider ---

export type TranslatorProviderProps = {
  children?: ReactNode;
  lang?: Language;
};

export function TranslatorProvider({ children, lang: initialLang }: TranslatorProviderProps) {
  const [lang, setLang] = useState<Language>(initialLang ?? DEFAULT_LANG);

  const value = useMemo<TranslatorContextValue>(
    () => ({
      lang,
      setLang,
      t: (key) => translate(lang, key),
    }),
    [lang],
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

export function useTranslations() {
  return useContext(TranslatorContext).t;
}

export function useTranslation<K extends TranslationKey | string>(key: K): K extends TranslationKey ? Translation[K] : K {
  return useTranslations()(key);
}

export function useLanguage(): [Language, (lang: Language) => void] {
  const { lang, setLang } = useContext(TranslatorContext);
  return [lang, setLang];
}
