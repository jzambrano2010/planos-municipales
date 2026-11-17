'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Ruler,
  Sparkles,
  SlidersHorizontal,
  Check,
  MousePointerClick,
  ExternalLink,
  Sliders,
  Bot,
  RefreshCw,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { ProjectData } from './NewProjectModal';
import PdfCanvasRenderer from './PdfCanvasRenderer';

interface Point {
  x: number;
  y: number;
}

interface BlueprintViewerProps {
  activeProject?: ProjectData | null;
  allProjects?: ProjectData[];
  customApiKey?: string;
}

export default function BlueprintViewer({ activeProject, allProjects = [], customApiKey = '' }: BlueprintViewerProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [scaleMode, setScaleMode] = useState<'fit' | '1:1' | 'wide'>('wide');

  // Interactive Ruler & Pixel-to-Meter Scale Calibration States
  const [isRulerActive, setIsRulerActive] = useState<boolean>(false);
  const [pointA, setPointA] = useState<Point | null>(null);
  const [pointB, setPointB] = useState<Point | null>(null);
  const [knownDistanceMeters, setKnownDistanceMeters] = useState<string>('15.00'); // Default property width
  const [pxPerMeter, setPxPerMeter] = useState<number | null>(null);
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);

  // Measurement tool states
  const [measurePointA, setMeasurePointA] = useState<Point | null>(null);
  const [measurePointB, setMeasurePointB] = useState<Point | null>(null);
  const [measuredMeters, setMeasuredMeters] = useState<number | null>(null);

  // In-place AI Analysis & Progress Bar States
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPointA(null);
    setPointB(null);
    setMeasurePointA(null);
    setMeasurePointB(null);
  };

  // Reset scale state when active project changes
  const [prevProjectId, setPrevProjectId] = useState(activeProject?.id);
  if (activeProject?.id !== prevProjectId) {
    setPrevProjectId(activeProject?.id);
    setPointA(null);
    setPointB(null);
    setMeasurePointA(null);
    setMeasurePointB(null);
    setIsCalibrated(false);
    setPxPerMeter(null);
    setAiAnalysisResult(null);
  }

  const fileUrl = activeProject?.fileUrl || '/assets/aistudio/plano_aprobado_municipal_87bd728a.pdf';
  const isDefaultProject = !activeProject || activeProject.id === 'default';

  const isPdfFile = activeProject
    ? activeProject.fileType === 'pdf' || activeProject.fileName.toLowerCase().endsWith('.pdf') || fileUrl.includes('.pdf')
    : false;

  // Handle Canvas Click for Ruler Calibration or Measurement
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isRulerActive || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (!isCalibrated) {
      if (!pointA) {
        setPointA({ x, y });
      } else if (!pointB) {
        setPointB({ x, y });
      } else {
        setPointA({ x, y });
        setPointB(null);
      }
    } else {
      if (!measurePointA) {
        setMeasurePointA({ x, y });
        setMeasurePointB(null);
        setMeasuredMeters(null);
      } else if (!measurePointB) {
        setMeasurePointB({ x, y });
        const pxDist = Math.sqrt(Math.pow(x - measurePointA.x, 2) + Math.pow(y - measurePointA.y, 2));
        if (pxPerMeter && pxPerMeter > 0) {
          setMeasuredMeters(parseFloat((pxDist / pxPerMeter).toFixed(2)));
        }
      } else {
        setMeasurePointA({ x, y });
        setMeasurePointB(null);
        setMeasuredMeters(null);
      }
    }
  };

  const handleCalibrate = () => {
    if (!pointA || !pointB) return;

    const pxDist = Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2));
    const realMeters = parseFloat(knownDistanceMeters) || 15.00;

    if (pxDist > 0 && realMeters > 0) {
      const calculatedPpm = pxDist / realMeters;
      setPxPerMeter(calculatedPpm);
      setIsCalibrated(true);
    }
  };

  const handleResetRuler = () => {
    setPointA(null);
    setPointB(null);
    setMeasurePointA(null);
    setMeasurePointB(null);
    setIsCalibrated(false);
    setPxPerMeter(null);
    setMeasuredMeters(null);
  };

  // IN-PLACE AI ANALYSIS WITH CUMULATIVE PROGRESS BAR (0% TO 100%)
  const handleRunInPlaceAIAnalysis = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setProgressPercent(10);
    setProgressStatus('Inicializando visor gráfico y escala calibrada...');
    setAiAnalysisResult(null);

    const cumulativeProjectsSummary = allProjects.map((p, idx) =>
      `[Plano ${idx + 1}]: ${p.title} (${p.fileType}) - Catastro: ${p.catastro} - Superficie: ${p.superficie}`
    ).join('\n');

    let scaleContext = '';
    if (isCalibrated && pxPerMeter) {
      scaleContext = `ESCALA CALIBRADA EN VISOR: 1 metro real = ${pxPerMeter.toFixed(2)} píxeles. `;
    } else {
      scaleContext = `ESCALA NO CALIBRADA (se asumirá escala por defecto 1:100). `;
    }

    if (measuredMeters) {
      scaleContext += `Medición realizada sobre el plano: ${measuredMeters} metros reales.`;
    }

    const promptText = `
Realiza un análisis acumulativo e integral del plano activo "${activeProject?.title || 'Plano Municipal'}" incorporando la totalidad de planos cargados en la obra.

${scaleContext}

Planos Acumulados Cargados en la Obra:
${cumulativeProjectsSummary}

Instrucciones de Análisis Acumulativo:
1. Analizar e integrar las capas de estructura (fundaciones Z1/Z2, bases B1, columnas C1, vigas V1-V5, losas L1-L8).
2. Analizar e integrar las instalaciones especiales si aplican (cañerías pluviales/cloacales PVC ø110/ø63mm, piletas de patio, cámaras 60x60, ventilaciones).
3. Evaluar el cumplimiento de la Ley Antisísmica 10575/2018.
4. Generar una lista técnica consolidada de ítems y observaciones para la obra.
`;

    // Progress Bar Animation
    setTimeout(() => {
      setProgressPercent(35);
      setProgressStatus('Escaneando vectores de cotas, muros e instalaciones...');
    }, 600);

    setTimeout(() => {
      setProgressPercent(65);
      setProgressStatus('Procesando datos acumulativos con Gemini AI...');
    }, 1200);

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          queryType: 'Análisis Acumulativo de Plano e Instalaciones',
          customApiKey: customApiKey || undefined,
          projectInfo: activeProject
            ? {
                title: activeProject.title,
                propietario: activeProject.propietario,
                profesional: activeProject.profesional,
                catastro: activeProject.catastro,
                superficie: activeProject.superficie,
                estructura: activeProject.estructura
              }
            : undefined,
          calibratedScale: pxPerMeter ? { pxPerMeter } : undefined
        })
      });

      const data = await res.json();
      setProgressPercent(100);
      setProgressStatus('¡Análisis acumulativo con IA completado exitosamente!');

      setTimeout(() => {
        if (data.text) {
          setAiAnalysisResult(data.text);
        } else {
          setAiAnalysisResult(`⚠️ Error: ${data.error || 'No se recibió respuesta del modelo.'}`);
        }
        setIsAnalyzing(false);
      }, 400);
    } catch (err: any) {
      setProgressPercent(100);
      setProgressStatus('Error al conectar con la API de Gemini');
      setAiAnalysisResult(`⚠️ Error de comunicación: ${err.message}`);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border-2 border-blue-600 rounded-2xl overflow-hidden shadow-xl flex flex-col relative text-slate-900">
        {/* Top Header Toolbar */}
        <div className="bg-slate-100 p-4 border-b-2 border-blue-600 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                  <span>{activeProject ? activeProject.title : 'Plano Aprobado Municipal'}</span>
                  {isCalibrated && (
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-700" />
                      <span>Calibrado (1m = {pxPerMeter?.toFixed(1)}px)</span>
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-600">
                  {activeProject?.propietario || 'Calle Davos N° 753 — Jesús María, Colón, Córdoba'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Step 1: Calibration / Ruler Tool Button */}
              <button
                onClick={() => {
                  setIsRulerActive(!isRulerActive);
                  if (isRulerActive) handleResetRuler();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shadow-sm ${
                  isRulerActive
                    ? 'bg-blue-700 text-white border-blue-800 ring-2 ring-blue-400/40'
                    : 'bg-white text-blue-900 border-blue-300 hover:bg-blue-50'
                }`}
              >
                <Ruler className="w-4 h-4 text-blue-700" />
                <span>1. Calibrar Píxel a Metros (Escala IA)</span>
              </button>

              {/* External Link */}
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                title="Abrir archivo en ventana independiente"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir Archivo en Ventana</span>
              </a>

              {/* Scale Presets */}
              <div className="flex items-center gap-1 bg-white border border-blue-300 rounded-xl p-1 text-xs font-bold">
                <button
                  onClick={() => {
                    setScaleMode('fit');
                    setZoom(0.85);
                  }}
                  className={`px-2 py-0.5 rounded transition ${
                    scaleMode === 'fit' ? 'bg-blue-700 text-white' : 'text-slate-700 hover:bg-blue-50'
                  }`}
                >
                  Ajustar
                </button>
                <button
                  onClick={() => {
                    setScaleMode('1:1');
                    setZoom(1);
                  }}
                  className={`px-2 py-0.5 rounded transition ${
                    scaleMode === '1:1' ? 'bg-blue-700 text-white' : 'text-slate-700 hover:bg-blue-50'
                  }`}
                >
                  1:1
                </button>
                <button
                  onClick={() => {
                    setScaleMode('wide');
                    setZoom(1.35);
                  }}
                  className={`px-2 py-0.5 rounded transition ${
                    scaleMode === 'wide' ? 'bg-blue-700 text-white' : 'text-slate-700 hover:bg-blue-50'
                  }`}
                >
                  Ampliado
                </button>
              </div>

              {/* Step 2: Run In-Place AI Analysis (STAYS IN TAB 2 WITH PROGRESS BAR!) */}
              <button
                onClick={handleRunInPlaceAIAnalysis}
                disabled={isAnalyzing}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>2. Analizar Vista con IA</span>
              </button>
            </div>
          </div>

          {/* Calibration Banner Indicator */}
          <div className="bg-blue-50 px-4 py-2 border-t border-b border-blue-200 flex flex-wrap items-center justify-between text-xs text-blue-900 font-medium">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-700 shrink-0" />
              {isCalibrated ? (
                <span>
                  <strong>Escala Calibrada para Análisis IA:</strong> 1m = {pxPerMeter?.toFixed(2)}px.
                </span>
              ) : (
                <span>
                  <strong>Calibración Métrica:</strong> Haz clic en <em>&quot;1. Calibrar Píxel a Metros&quot;</em> y marca 2 puntos en el plano antes de analizar.
                </span>
              )}
            </div>

            {isCalibrated && (
              <button onClick={handleResetRuler} className="text-blue-700 underline font-bold text-xs">
                Recalibrar
              </button>
            )}
          </div>

          {/* Ruler Calibration / Measurement Active Sub-Bar */}
          {isRulerActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-emerald-50 border-b border-emerald-300 p-3 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2 text-emerald-950">
                <MousePointerClick className="w-4 h-4 text-emerald-700 shrink-0" />
                {!isCalibrated ? (
                  <span>
                    <strong>Modo Calibración:</strong> Haz clic en 2 puntos sobre el plano (ej. ancho de terreno o muro).
                  </span>
                ) : (
                  <span>
                    <strong>Modo Medición Directa:</strong> Haz clic en 2 puntos para medir distancias reales en metros.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!isCalibrated && pointA && pointB && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">Distancia real entre puntos:</span>
                    <input
                      type="number"
                      step="0.01"
                      value={knownDistanceMeters}
                      onChange={(e) => setKnownDistanceMeters(e.target.value)}
                      className="w-20 bg-white border border-emerald-500 rounded-lg px-2 py-1 font-bold text-emerald-950 text-xs font-mono outline-none"
                    />
                    <span className="font-bold">m</span>
                    <button
                      onClick={handleCalibrate}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                    >
                      Confirmar Calibración
                    </button>
                  </div>
                )}

                {isCalibrated && measuredMeters && (
                  <div className="bg-emerald-200 border border-emerald-500 text-emerald-950 px-3 py-1 rounded-lg font-mono font-bold text-sm">
                    Distancia Medida: {measuredMeters} m
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* IN-PLACE PROGRESS BAR (0% TO 100%) */}
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border-2 border-amber-500 p-4 rounded-xl text-white space-y-2 shadow-xl"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-amber-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{progressStatus}</span>
                </span>
                <span className="font-mono text-amber-400 font-bold">{progressPercent}%</span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <motion.div
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Floating Precision Zoom Controls */}
        <div className="bg-slate-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between gap-4 text-xs font-bold">
          <div className="flex items-center gap-2 text-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-blue-700" />
            <span>Zoom: {Math.round(zoom * 100)}%</span>
          </div>

          <div className="flex items-center gap-2">
            {[75, 100, 150, 200, 300].map((pct) => (
              <button
                key={pct}
                onClick={() => setZoom(pct / 100)}
                className={`px-2 py-1 rounded text-[11px] font-mono ${
                  Math.round(zoom * 100) === pct ? 'bg-blue-700 text-white font-bold' : 'bg-white text-slate-700 border border-slate-300'
                }`}
              >
                {pct}%
              </button>
            ))}

            <div className="h-4 w-[1px] bg-slate-300 mx-1" />

            <button onClick={handleZoomOut} className="p-1.5 hover:bg-slate-200 rounded text-slate-800" title="Alejar">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={handleZoomIn} className="p-1.5 hover:bg-slate-200 rounded text-slate-800" title="Acercar">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={handleResetZoom} className="p-1.5 hover:bg-slate-200 rounded text-slate-800" title="Restablecer">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div
          ref={containerRef}
          onClick={handleCanvasClick}
          className={`flex-1 overflow-auto bg-slate-200 p-4 scrollbar-thin max-h-[850px] min-h-[600px] relative ${
            isRulerActive ? 'cursor-crosshair' : 'cursor-grab'
          }`}
        >
          <div
            className="relative mx-auto transition-transform duration-200 ease-out origin-top-left"
            style={{ transform: `scale(${zoom})`, width: '100%', minWidth: '950px' }}
          >
            <div className="relative rounded-xl overflow-hidden border-2 border-blue-600 shadow-2xl bg-white">
              {/* Render PDF Canvas or Image Canvas */}
              {isPdfFile && !isDefaultProject ? (
                <PdfCanvasRenderer url={fileUrl} className="min-h-[550px]" />
              ) : (
                <img
                  src={isDefaultProject ? '/assets/aistudio/plano_aprobado_municipal_page1.png' : fileUrl}
                  alt={activeProject?.title || 'Plano Municipal'}
                  className="w-full h-auto block select-none min-h-[550px] object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/aistudio/plano_aprobado_municipal_page1.png';
                  }}
                />
              )}

              {/* Ruler Calibration Vector Line Overlay */}
              {isRulerActive && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                  {pointA && (
                    <circle cx={pointA.x} cy={pointA.y} r={6} fill="#ef4444" stroke="#ffffff" strokeWidth={2} />
                  )}
                  {pointB && (
                    <circle cx={pointB.x} cy={pointB.y} r={6} fill="#ef4444" stroke="#ffffff" strokeWidth={2} />
                  )}
                  {pointA && pointB && (
                    <>
                      <line
                        x1={pointA.x}
                        y1={pointA.y}
                        x2={pointB.x}
                        y2={pointB.y}
                        stroke="#ef4444"
                        strokeWidth={3}
                        strokeDasharray="6,4"
                      />
                      <text
                        x={(pointA.x + pointB.x) / 2}
                        y={(pointA.y + pointB.y) / 2 - 8}
                        fill="#1e293b"
                        fontSize={12}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        Calibración: {knownDistanceMeters} m
                      </text>
                    </>
                  )}

                  {/* Active Measurement Line */}
                  {measurePointA && (
                    <circle cx={measurePointA.x} cy={measurePointA.y} r={6} fill="#10b981" stroke="#ffffff" strokeWidth={2} />
                  )}
                  {measurePointB && (
                    <circle cx={measurePointB.x} cy={measurePointB.y} r={6} fill="#10b981" stroke="#ffffff" strokeWidth={2} />
                  )}
                  {measurePointA && measurePointB && (
                    <>
                      <line
                        x1={measurePointA.x}
                        y1={measurePointA.y}
                        x2={measurePointB.x}
                        y2={measurePointB.y}
                        stroke="#10b981"
                        strokeWidth={4}
                      />
                      <rect
                        x={(measurePointA.x + measurePointB.x) / 2 - 35}
                        y={(measurePointA.y + measurePointB.y) / 2 - 20}
                        width={70}
                        height={24}
                        rx={6}
                        fill="#065f46"
                      />
                      <text
                        x={(measurePointA.x + measurePointB.x) / 2}
                        y={(measurePointA.y + measurePointB.y) / 2 - 4}
                        fill="#ffffff"
                        fontSize={11}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {measuredMeters} m
                      </text>
                    </>
                  )}
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI ANALYSIS RESULT CARD IN PESTAÑA 2 (IN-PLACE DISPLAY) */}
      <AnimatePresence>
        {aiAnalysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white border-2 border-blue-600 rounded-2xl p-6 shadow-xl space-y-4 text-slate-900"
          >
            <div className="flex items-center justify-between border-b border-blue-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-950 text-base flex items-center gap-2">
                    <span>Resultado del Análisis Acumulativo de Obra con IA</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </h4>
                  <p className="text-xs text-slate-600">
                    Analizado en vivo para {activeProject?.title} ({allProjects.length} expediente(s) acumulados)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAiAnalysisResult(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Cerrar Resultado
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-300 p-5 rounded-xl text-xs leading-relaxed whitespace-pre-wrap font-sans text-slate-800 shadow-inner">
              {aiAnalysisResult}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
