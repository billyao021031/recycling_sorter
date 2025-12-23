import { MD3LightTheme, MD3Theme } from 'react-native-paper';

export const appTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0F6B6E',
    secondary: '#58A6A8',
    tertiary: '#E7B052',
    background: '#F6F7F4',
    surface: '#FFFFFF',
    surfaceVariant: '#ECF1EE',
    outline: '#C7D1CC',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    displayLarge: { ...MD3LightTheme.fonts.displayLarge, fontFamily: 'Manrope_700Bold' },
    displayMedium: { ...MD3LightTheme.fonts.displayMedium, fontFamily: 'Manrope_700Bold' },
    displaySmall: { ...MD3LightTheme.fonts.displaySmall, fontFamily: 'Manrope_600SemiBold' },
    headlineLarge: { ...MD3LightTheme.fonts.headlineLarge, fontFamily: 'Manrope_700Bold' },
    headlineMedium: { ...MD3LightTheme.fonts.headlineMedium, fontFamily: 'Manrope_600SemiBold' },
    headlineSmall: { ...MD3LightTheme.fonts.headlineSmall, fontFamily: 'Manrope_600SemiBold' },
    titleLarge: { ...MD3LightTheme.fonts.titleLarge, fontFamily: 'Manrope_600SemiBold' },
    titleMedium: { ...MD3LightTheme.fonts.titleMedium, fontFamily: 'Manrope_600SemiBold' },
    titleSmall: { ...MD3LightTheme.fonts.titleSmall, fontFamily: 'Manrope_600SemiBold' },
    bodyLarge: { ...MD3LightTheme.fonts.bodyLarge, fontFamily: 'Manrope_400Regular' },
    bodyMedium: { ...MD3LightTheme.fonts.bodyMedium, fontFamily: 'Manrope_400Regular' },
    bodySmall: { ...MD3LightTheme.fonts.bodySmall, fontFamily: 'Manrope_400Regular' },
    labelLarge: { ...MD3LightTheme.fonts.labelLarge, fontFamily: 'Manrope_600SemiBold' },
    labelMedium: { ...MD3LightTheme.fonts.labelMedium, fontFamily: 'Manrope_600SemiBold' },
    labelSmall: { ...MD3LightTheme.fonts.labelSmall, fontFamily: 'Manrope_600SemiBold' },
  },
};
