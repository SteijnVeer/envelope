import { Glass, GlassButton, Page, T } from '@steijnveer/expo-commons/components';
import { Rounded } from '@steijnveer/expo-commons/constants';
import { useColors, useLanguage, useTheme } from '@steijnveer/expo-commons/hooks';

export default function Home() {
  const { setLanguage, language, languages, languageOption } = useLanguage();
  const languagesArray = Array.from(languages);
  const { setTheme, theme, themes, themeOption } = useTheme();
  const themesArray = Array.from(themes);
  const colors = useColors();

  return (
    <Page>
      <T type='largeTitle' text='Settings' centered />
      <T type='title1' text='General' />
      <Glass
        style={Rounded.pill}
        glassEffectStyle='clear'
      >
        <T text='This is a placeholder for the settings page. You can add your settings options here.' />
      </Glass>
      <T type='title2' text='DEV OPTIONS THEME' color='blue' />
      <T type='title3' text={`Current: ${theme} (${themeOption})`} color='lightblue' />
      {themesArray.map((theme) => (
        <GlassButton
          key={theme}
          tintColor={colors.blue}
          disabledOpacity={0}
          disabled={theme === themeOption}
          style={Rounded.pill}
          glassEffectStyle='clear'
          onPress={() => {
            setTheme(theme);
          }}
          text={`Set theme to ${theme}`}
        />
      ))}
      <GlassButton
        tintColor={colors.orange}
        disabledOpacity={0}
        disabled={'system' === themeOption}
        style={Rounded.pill}
        glassEffectStyle='clear'
        onPress={() => {
          setTheme('system');
        }}
        text='Set theme to system'
      />
      <GlassButton
        tintColor={colors.red}
        disabledOpacity={0}
        disabled={'fallback' === themeOption}
        style={Rounded.pill}
        glassEffectStyle='clear'
        onPress={() => {
          setTheme('fallback');
        }}
        text='Set theme to fallback'
      />
      <T type='title2' text='DEV OPTIONS LANGUAGE' color='green' />
      <T type='title3' text={`Current: ${language} (${languageOption})`} color='mint' />
      {languagesArray.map((lang) => (
        <GlassButton
          key={lang}
          tintColor={colors.green}
          disabledOpacity={0}
          disabled={lang === languageOption}
          style={Rounded.pill}
          glassEffectStyle='clear'
          onPress={() => {
            setLanguage(lang);
          }}
          text={`Set language to ${lang}`}
        />
      ))}
      <GlassButton
        tintColor={colors.orange}
        disabledOpacity={0}
        disabled={'system' === languageOption}
        style={Rounded.pill}
        glassEffectStyle='clear'
        onPress={() => {
          setLanguage('system');
        }}
        text='Set language to system'
      />
      <GlassButton
        tintColor={colors.red}
        disabledOpacity={0}
        disabled={'fallback' === languageOption}
        style={Rounded.pill}
        glassEffectStyle='clear'
        onPress={() => {
          setLanguage('fallback');
        }}
        text='Set language to fallback'
      />
    </Page>
  );
}
