import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

const mockChangeLanguage = vi.fn().mockResolvedValue(undefined);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'settings.title': 'Settings',
        'settings.languageLabel': 'Language',
        'settings.languageDescription': 'Choose your preferred language',
        'settings.languageEnglish': 'English',
        'settings.languageSpanish': 'Español',
      };
      return translations[key] ?? key;
    },
    i18n: {
      language: 'en',
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

import Settings from '../pages/Settings';

describe('Settings', () => {
  test('renders settings title', () => {
    render(<Settings />);

    expect(screen.getByRole('heading', { name: 'Settings', level: 1 })).toBeTruthy();
  });

  test('renders language section heading', () => {
    render(<Settings />);

    expect(screen.getByRole('heading', { name: 'Language', level: 2 })).toBeTruthy();
  });

  test('renders language options as buttons', () => {
    render(<Settings />);

    expect(screen.getAllByText('English').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Español').length).toBeGreaterThan(0);
  });

  test('changes language when a language button is clicked', () => {
    render(<Settings />);

    const spanishButton = screen.getByRole('button', { name: /Select Español/i });
    fireEvent.click(spanishButton);

    expect(mockChangeLanguage).toHaveBeenCalledWith('es');
  });

  test('shows current language indicator', () => {
    render(<Settings />);

    // English is the current language
    expect(screen.getByText(/Current Language/)).toBeTruthy();
  });

  test('renders language description text', () => {
    render(<Settings />);

    expect(screen.getByText('Choose your preferred language')).toBeTruthy();
  });

  test('renders more settings placeholder', () => {
    render(<Settings />);

    expect(screen.getByText('More settings coming soon')).toBeTruthy();
  });

  test('language buttons are interactive', () => {
    render(<Settings />);

    const englishButton = screen.getByRole('button', { name: /Select English/i });
    fireEvent.click(englishButton);

    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });
});
