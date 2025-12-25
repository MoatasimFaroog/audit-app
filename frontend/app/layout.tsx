import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Web3 Accounting & Audit System',
  description: 'Decentralized blockchain-based accounting and audit system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
