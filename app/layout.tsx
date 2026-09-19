import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AquaSense MVP',
  description: 'Swimming pool operations management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
