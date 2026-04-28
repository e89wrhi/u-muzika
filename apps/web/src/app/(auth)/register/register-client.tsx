'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { UserAuthForm } from '@/components/forms/user-auth-form';
import { Suspense, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { Spinner } from '@/components/ui/spinner';

export default function RegisterClient() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    // Check if Clerk has loaded and the user is signed in
    if (isLoaded && isSignedIn) {
      // Redirect the user to the main page
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, router, '/']);

  // Optionally show a loading state while checking status
  if (!isLoaded || isSignedIn) {
    return <Spinner />;
  }

  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        {t('register.login')}
      </Link>
      <div className="flex items-center justify-center">
        <Image
          src="/_illustration/illu_phone_dark.png"
          alt="illustratin"
          width={400}
          height={400}
          className="h-140 w-70"
        />
      </div>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Image
              src="/logo.png"
              alt="logo"
              height={100}
              width={100}
              className="h-22 w-22"
            />
            <h1 className="text-2xl font-semibold tracking-tight">
              {t('register.create')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('register.createSub')}
            </p>
          </div>
          <Suspense>
            <UserAuthForm type="register" />
          </Suspense>
          <p className="px-8 text-center text-sm text-muted-foreground">
            {t('register.footer')}
          </p>
        </div>
      </div>
    </div>
  );
}
