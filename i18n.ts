import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
const locales = ['da', 'en'];

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that the incoming locale is valid
  if (!locale || !locales.includes(locale)) {
    locale = 'da'; // Default to Danish
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
