import { Icon } from '@stellar/design-system';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg glass border-hi hover:bg-white/5 active:scale-95 transition-all outline-none focus:outline-none focus:ring-2 focus:ring-accent/50 flex items-center justify-center text-text min-w-[44px] min-h-[44px]"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={theme === 'dark'}
    >
      {theme === 'light' ? <Icon.Moon01 size="md" /> : <Icon.Sun size="md" />}
      <span className="sr-only">Current theme: {theme === 'light' ? 'Light' : 'Dark'}</span>
    </button>
  );
};
