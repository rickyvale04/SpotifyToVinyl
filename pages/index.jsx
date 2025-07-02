import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Dashboard from '../components/main/Dashboard';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to "/login" if no session or no tokens in localStorage
  useEffect(() => {
    if (status === 'loading' || !isClient) return;  // Exit if loading or not client-side

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!session && !accessToken) {
        router.push('/login'); // Redirect to "/login" if no session and no token
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      if (!session) {
        router.push('/login');
      }
    }
  }, [session, status, router, isClient]);

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <Dashboard />;
}
