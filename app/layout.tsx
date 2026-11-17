import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Visor y Analizador de Planos Municipales',
  description: 'Aplicación interactiva para análisis técnico, cálculo de superficies y exploración detallada de planos de arquitectura y estructura aprobados.',
  openGraph: {
    title: 'Visor y Analizador de Planos Municipales',
    description: 'Análisis minucioso del plano aprobado municipal: Planta Baja, Planta Alta, Estructura, Fundaciones, Cortes y Balance de Superficies.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visor y Analizador de Planos Municipales',
    description: 'Análisis minucioso del plano aprobado municipal: Planta Baja, Planta Alta, Estructura, Fundaciones, Cortes y Balance de Superficies.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body suppressHydrationWarning className="bg-slate-950 text-slate-100 antialiased min-h-screen selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
