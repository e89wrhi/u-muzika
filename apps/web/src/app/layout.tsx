import '@/styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { cn, constructMetadata } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@/components/analytics';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { TooltipProvider } from '@/components/ui/tooltip';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = constructMetadata();

export default async function RootLayout({ children }: RootLayoutProps) {
  const messages = await getMessages();
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>{children}</TooltipProvider>
            <Analytics />

            <Toaster
              position="top-center"
              toastOptions={{
                classNames: {
                  toast: 'bg-background text-foreground border border-border',
                  description: 'text-muted-foreground',
                },
                duration: 2000,
              }}
            />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
