import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Studio Java · Personal Learning Lab',
  description: 'Lezioni teoriche e laboratori pratici per imparare Java scrivendo codice.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it"><body>{children}</body></html>;
}
