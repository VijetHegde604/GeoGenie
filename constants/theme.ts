// constants/theme.ts
import { MD3DarkTheme } from 'react-native-paper';

export const theme = {
  ...MD3DarkTheme,
  roundness: 16,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#8AB4F8',
    primaryContainer: '#1A4378',
    surface: '#121212',
    surfaceVariant: '#1E1E1E',
    background: '#0A0A0A',
    onSurface: '#E6E6E6',
  },
};

// Compatibility export used by Expo starter themed components.
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};
