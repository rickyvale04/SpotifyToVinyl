import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Sidebar from "./main/Sidebar";

export default function Layout({ children }) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-0 bg-[var(--background)] min-h-screen">
      {/* Fixed Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b border-[var(--border)] px-4 py-2 md:hidden">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-[var(--primary-text)] text-lg font-bold">
            Crate Digger
          </Link>
          <button onClick={toggleMenu} className="text-[var(--primary-text)] focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <nav className="mt-2 bg-[var(--background)] border-t border-[var(--border)]">
            <ul className="flex flex-col space-y-2 py-2">
              <li>
                <Link href="/" className="block px-2 py-1 text-[var(--primary-text)] hover:text-[var(--accent)] uppercase text-sm font-bold" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b border-[var(--border)] px-6 py-3 hidden md:flex">
        <nav className="flex items-center justify-between w-full max-w-6xl mx-auto">
          <Link href="/" className="text-[var(--primary-text)] text-xl font-bold">
            Crate Digger
          </Link>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-[var(--primary-text)] hover:text-[var(--accent)] uppercase text-sm font-bold">
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Sidebar for desktop */}
      {router.pathname !== '/login' && (
        <aside className="hidden md:block w-64 bg-[var(--background)] border-r border-[var(--border)] pt-16 pb-4 overflow-y-auto">
          <Sidebar />
        </aside>
      )}

      {/* Main Content */}
      <main className="md:pl-64 pt-16 pb-4 px-6 flex justify-center">
        {router.pathname === '/login' ? (
          <>{children}</>
        ) : (
          <div className="max-w-6xl w-full">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
