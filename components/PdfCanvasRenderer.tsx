'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker options for pdfjs
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

interface PdfCanvasRendererProps {
  url: string;
  className?: string;
  onRenderSuccess?: () => void;
}

export default function PdfCanvasRenderer({ url, className, onRenderSuccess }: PdfCanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasRendered, setHasRendered] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadAndRenderPDF() {
      if (!url || !canvasRef.current) return;
      setLoading(true);

      try {
        let pdfDoc = null;

        // Attempt 1: Fetch as ArrayBuffer to bypass blob/CORS issues
        if (url.startsWith('blob:') || url.startsWith('http')) {
          try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            if (isCancelled) return;
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            pdfDoc = await loadingTask.promise;
          } catch (fetchErr) {
            console.warn('Fetch ArrayBuffer fallback, trying URL directly:', fetchErr);
            const loadingTask = pdfjsLib.getDocument({ url });
            pdfDoc = await loadingTask.promise;
          }
        } else {
          const loadingTask = pdfjsLib.getDocument({ url });
          pdfDoc = await loadingTask.promise;
        }

        if (isCancelled || !pdfDoc) return;

        const page = await pdfDoc.getPage(1);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale: 2.0 }); // High resolution 200% scale
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport
          } as any;

          await page.render(renderContext).promise;

          if (!isCancelled) {
            setLoading(false);
            setHasRendered(true);
            if (onRenderSuccess) onRenderSuccess();
          }
        }
      } catch (err: any) {
        console.error('PDF Canvas Renderer error:', err);
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadAndRenderPDF();

    return () => {
      isCancelled = true;
    };
  }, [url]);

  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-[550px] bg-slate-100 rounded-xl overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-20">
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold animate-pulse">
            <span>Cargando y procesando lienzo del plano en alta resolución...</span>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className={`block w-full h-auto object-contain ${className || ''}`} />

      {/* Fallback image display if PDF rendering is not ready */}
      {!loading && !hasRendered && (
        <div className="w-full h-full min-h-[550px] flex items-center justify-center bg-slate-900 text-white p-6 rounded-xl">
          <img
            src="/assets/aistudio/plano_aprobado_municipal_page1.png"
            alt="Vista Previa de Plano"
            className="w-full h-auto object-contain max-h-[700px]"
          />
        </div>
      )}
    </div>
  );
}
