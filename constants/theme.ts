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