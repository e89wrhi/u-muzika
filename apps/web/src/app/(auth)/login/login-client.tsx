'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { UserAuthForm } from '@/components/forms/user-auth-form';
import { Icons } from '@/components/shared/icons';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Spinner } from '@/components/ui/spinner';

export default function LoginClient() {
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
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'absolute left-4 top-4 md:left-8 md:top-8'
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 size-4" />
          {t('back')}
        </>
      </Link>
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
            {t('Wellcome')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('Wellcome to U Muzika')}
          </p>
        </div>
        <Suspense>
          <UserAuthForm />
        </Suspense>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            {t('Join')}
          </Link>
        </p>
      </div>
    </div>
  );
}
