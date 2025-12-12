# i18n (Internationalization) Setup Guide

## ✅ Implementation Complete

The project now has full i18n support using **i18next** and **react-i18next** with English (en) as the fallback language and French (fr) as the secondary language.

## 📁 File Structure

```
src/
├── i18n.ts                          # i18n configuration
├── locales/
│   ├── en/
│   │   └── translation.json        # English translations
│   └── fr/
│       └── translation.json        # French translations
└── components/
    └── I18nExample.tsx             # Example component showing usage
```

## 🚀 Quick Start

### 1. Using Translations in Components

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome_message')}</h1>
      <p>{t('common.login')}</p>
      <button onClick={() => i18n.changeLanguage('fr')}>
        Switch to French
      </button>
    </div>
  );
}
```

### 2. Changing Language

```typescript
// In any component
const { i18n } = useTranslation();

// Change to French
i18n.changeLanguage('fr');

// Change to English
i18n.changeLanguage('en');
```

### 3. Translation Keys

**Root level keys:**
- `t('welcome_message')` → "Welcome to the Transport Hub."

**Nested keys:**
- `t('common.login')` → "Login"
- `t('navigation.dashboard')` → "Dashboard"
- `t('auth.email')` → "Email Address"
- `t('booking.title')` → "New Booking Request"

## 📝 Adding New Translations

### Step 1: Add to English (`src/locales/en/translation.json`)

```json
{
  "myNewKey": "My English Text",
  "section": {
    "nestedKey": "Nested English Text"
  }
}
```

### Step 2: Add to French (`src/locales/fr/translation.json`)

```json
{
  "myNewKey": "Mon texte français",
  "section": {
    "nestedKey": "Texte français imbriqué"
  }
}
```

### Step 3: Use in Component

```typescript
const { t } = useTranslation();
<p>{t('myNewKey')}</p>
<p>{t('section.nestedKey')}</p>
```

## 🔧 Configuration

The i18n configuration (`src/i18n.ts`) includes:

- **Language Detection**: Automatically detects user's browser language
- **LocalStorage**: Saves language preference
- **Fallback**: Defaults to English if translation missing
- **Supported Languages**: `en` and `fr`

## 📋 Current Translation Keys

### Root Level
- `welcome_message`

### Common (`common.*`)
- `login`, `logout`, `signup`, `submit`, `cancel`, `save`, `delete`, `edit`, `close`, `back`, `next`, `previous`, `search`, `filter`, `loading`, `error`, `success`, `confirm`

### Navigation (`navigation.*`)
- `dashboard`, `newBooking`, `myBookings`, `driverView`

### Auth (`auth.*`)
- `email`, `password`, `name`, `phone`, `department`, `forgotPassword`, `rememberMe`, `alreadyHaveAccount`, `dontHaveAccount`

### Booking (`booking.*`)
- `title`, `date`, `time`, `destination`, `passengers`, `vehicleType`, `purpose`, `submit`, `success`, `minAdvanceBooking`

## 🎯 Integration with Existing Code

The i18n system is integrated with the existing language switching in `App.tsx`. The language state is synchronized with i18n, so both systems work together.

## 📚 Example Component

See `src/components/I18nExample.tsx` for a complete example showing:
- How to use `useTranslation` hook
- How to change languages
- How to access nested translation keys

## 🔄 Migration Path

To migrate existing components from the manual translation system:

1. Replace `const t = translations[language]` with `const { t } = useTranslation()`
2. Move translation objects from component files to JSON files
3. Update translation key references to match JSON structure

## ✨ Features

- ✅ Automatic language detection
- ✅ Language preference saved in localStorage
- ✅ Fallback to English
- ✅ Nested translation keys
- ✅ Type-safe (TypeScript support)
- ✅ Easy to extend with more languages


