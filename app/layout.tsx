import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../src/index.css';
import { Toaster } from '@/src/components/ui/toaster';
import { Toaster as Sonner } from '@/src/components/ui/sonner';
import { TooltipProvider } from '@/src/components/ui/tooltip';
import { AuthProvider } from '@/src/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'House Points Hub',
  description: 'Manage inter-house sports competition',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {children}
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
