import { useAuthStore } from '@/stores/useAuthStore';
import { router } from 'expo-router';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/(auth)/sign-in');
    }
  }, [session, loading]);

  if (loading) return null;

  return <>{children}</>;
}