import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Dashboard from '../components/main/Dashboard';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to "/login" if no session or no tokens in localStorage
  useEffect(() => {
    if (status === 'loading') return;  // Exit if loading (can add a loader in the future)

    const accessToken = localStorage.getItem("access_token");
    if (!session && !accessToken) {
      router.push('/login'); // Redirect to "/login" if no session and no token
    }
  }, [session, status, router]);

  return <Dashboard />;
}
