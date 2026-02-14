'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActionState } from 'react';
import { authenticate } from '@/lib/action'; // ServerAction

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>ログイン</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className='space-y-4'>
          {errorMessage && <div className='text-red-600'>{errorMessage}</div>}
          <div className='space-y-2'>
            <Label htmlFor='email'>メールアドレス</Label>
            <Input id='email' type='email' name='email' required />
          </div>
          <div>
            <Label htmlFor='password'>パスワード</Label>
            <Input id='password' type='password' name='password' required />
          </div>
          <Button type='submit' className='w-full'>
            ログイン
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
