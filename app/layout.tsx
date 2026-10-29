import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
  title: 'SPEED Unlimited | Experiencia interactiva — Creative Lab',
  description: 'Proyecto conceptual independiente: una experiencia interactiva de SPEED Unlimited con scroll cinematográfico, animación de producto y diseño responsive.',
  applicationName: 'SPEED Unlimited — Creative Lab',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    title: 'SPEED Unlimited — Interactive Concept',
    description: 'Experiencia digital conceptual creada con Next.js, GSAP, Framer Motion y Three.js. Proyecto independiente, no oficial.',
    images: [{ url: '/og-speed.png', width: 1200, height: 630, alt: 'SPEED Unlimited — Interactive Concept' }],
  },
  twitter: { card: 'summary_large_image', title: 'SPEED Unlimited — Interactive Concept', images: ['/og-speed.png'] },
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="es-AR"><body>{children}</body></html>;
}
