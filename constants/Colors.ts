const primary = '#2E7D32';
const accent = '#FFA000';

const tintColorLight = primary;
const tintColorDark = accent;

export default {
  primary,
  accent,
  light: {
    text: '#1a1a1a',
    background: '#f5f5f5',
    tint: tintColorLight,
    tabIconDefault: '#9e9e9e',
    tabIconSelected: tintColorLight,
    card: '#ffffff',
  },
  dark: {
    text: '#f5f5f5',
    background: '#121212',
    tint: tintColorDark,
    tabIconDefault: '#757575',
    tabIconSelected: accent,
    card: '#1e1e1e',
  },
};
