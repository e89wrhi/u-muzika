import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import enMessages from '../../locales/en.json';
import amMessages from '../../locales/am.json';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  return {
    locale,
    messages: locale === 'am' ? amMessages : enMessages,
  };
});
