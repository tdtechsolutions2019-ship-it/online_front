"use client";
import "react-toastify/dist/ReactToastify.css";
import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Providers } from "./provider";
import { AuthProvider } from "@/app/auth/authcontext";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react"; // ✅ Import Suspense
// app/layout.tsx
import 'katex/dist/katex.min.css';  // ✅ add this

const outfit = Outfit({
  subsets: ["latin"],
});

// ✅ Global Loading Spinner
function GlobalLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-500" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <Providers>
          <AuthProvider>
            <ThemeProvider>
              <SidebarProvider>
                {/* ✅ Suspense wraps children — shows GlobalLoader on page transitions */}
                <Suspense fallback={<GlobalLoader />}>
                  {children}
                </Suspense>
              </SidebarProvider>
              <ToastContainer position="top-right" autoClose={3000} theme="colored" />
            </ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}