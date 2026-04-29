/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInButton } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Icons } from '@/components/shared/icons';

const userAuthSchema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof userAuthSchema>;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'register' | 'login';
}

export function UserAuthForm({
  className,
  type = 'login',
  ...props
}: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const searchParams = useSearchParams();

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      // Clerk email sign-in (magic link)
      const emailUrl = `/sign-in?email=${encodeURIComponent(data.email.toLowerCase())}&redirectUrl=${searchParams?.get('from') || '/me'}`;
      window.location.href = emailUrl;
      toast.success('Check your email for the login link!');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {/* Google Sign-In */}
      <SignInButton
        mode="modal"
        signUpFallbackRedirectUrl={searchParams?.get('from') || '/me'}
        fallbackRedirectUrl={searchParams?.get('from') || '/me'}
      >
        <Button
          variant="default"
          className="rounded-full h-12 text-lg flex items-center justify-center"
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 size-4" />
          )}
          Google
        </Button>
      </SignInButton>
    </div>
  );
}
