import { useTranslation } from 'react-i18next';

/**
 * Example component demonstrating how to use i18n in the application
 * 
 * Usage:
 * 1. Import useTranslation hook: import { useTranslation } from 'react-i18next';
 * 2. Get t function and i18n object: const { t, i18n } = useTranslation();
 * 3. Use t() to translate: t('welcome_message')
 * 4. Change language: i18n.changeLanguage('fr')
 * 
 * Translation keys can be nested:
 * - t('common.login') for nested keys
 * - t('welcome_message') for root level keys
 */
export function I18nExample() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-6 bg-white/5 rounded-lg border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-4">i18n Example</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-gray-400 mb-2">Current Language: {i18n.language}</p>
          <div className="flex gap-2">
            <button
              onClick={() => changeLanguage('en')}
              className="px-4 py-2 bg-[#FFD700] text-black rounded hover:bg-[#FFD700]/90"
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('fr')}
              className="px-4 py-2 bg-[#FFD700] text-black rounded hover:bg-[#FFD700]/90"
            >
              Français
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <p className="text-white">
            <strong>Root level key:</strong> {t('welcome_message')}
          </p>
          <p className="text-white">
            <strong>Nested key:</strong> {t('common.login')}
          </p>
          <p className="text-white">
            <strong>Navigation:</strong> {t('navigation.dashboard')}
          </p>
          <p className="text-white">
            <strong>Auth:</strong> {t('auth.email')}
          </p>
          <p className="text-white">
            <strong>Booking:</strong> {t('booking.title')}
          </p>
        </div>
      </div>
    </div>
  );
}

