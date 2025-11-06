'use client';

import { useAuth } from './providers';
import AuthPage from '@/components/AuthPage';
import MemoApp from '@/components/MemoApp';

export default function Home() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <AuthPage />;
  }

  return <MemoApp />;
}

