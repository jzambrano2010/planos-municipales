'use client';

import React, { useState, useEffect } from 'react';
import BlueprintViewer from '@/components/BlueprintViewer';
import BlueprintDataSummary from '@/components/BlueprintDataSummary';
import AIBlueprintAssistant from '@/components/AIBlueprintAssistant';
import PortalDeCarga from '@/components/PortalDeCarga';
import ApiKeyModal from '@/components/ApiKeyModal';
import NewProjectModal, { ProjectData } from '@/components/NewProjectModal';
import { generateProjectPDF } from '@/lib/pdfGenerator';
import {
  Building2,
  ShieldCheck,
  Award,
  Printer,
  Sparkles,
  Ruler,
  Layers,
  HardHat,
  Key,
  FileDown,
  Eye,
  FolderOpen,
  Calculator
} from 'lucide-react';

const DEFAULT_PROJECT: ProjectData = {
  id: 'default',
  title: 'Plano Calle Davos N° 753',
  propietario: 'Elías Tomás Monte (DNI 42.338.065)',
  profesional: 'Ing. Civil Julio A. Zambrano (MP 4097)',
  catastro: 'CIRC 01 | SECC 09 | MZA 052 | PARC 001',
  superficie: '236.89 m² cubiertos / 10.66 m² semicubiertos (Total: 247.55 m²)',
  estructura: 'Fundaciones compuestas Z1/Z2/B1, 28 columnas PB, 24 columnas PA, losas L1-L8 (h=17cm). Contrapiso PB 10cm, Carpeta PA 3cm.',
  fileUrl: '/assets/aistudio/plano_aprobado_municipal_87bd728a.pdf',
  fileName: 'plano_aprobado_municipal_87bd728a.pdf',
  fileType: 'pdf'
};

export default function Home() {
  const [activeMainTab, setActiveMainTab] = useState<'portal' | 'visual' | 'desglose' | 'inteligencia' | 'costos'>('visual');
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gemini_custom_api_key') || '';
    }
    return '';
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);

  const [projects, setProjects] = useState<ProjectData[]>([DEFAULT_PROJECT]);
  const [activeProjectId, setActiveProjectId] = useState<string>('default');

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.setItem('gemini_custom_api_key', key);
      } else {
        localStorage.removeItem('gemini_custom_api_key');
      }
    }
  };

  const handleProjectCreated = (newProject: ProjectData) => {
    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProjectId === id) {
      setActiveProjectId('default');
    }
  };

  const handleResetAnalysis = () => {
    const blankProject: ProjectData = {
      id: `blank_${Date.now()}`,
      title: 'Nuevo Proyecto sin Cargar',
      propietario: 'A especificar',
      profesional: 'A especificar',
      catastro: 'Sin registro',
      superficie: '0 m²',
      estructura: 'Sin definir',
      fileUrl: '/assets/aistudio/plano_aprobado_municipal_87bd728a.pdf',
      fileName: 'Sin_Plano.pdf',
      fileType: 'pdf'
    };
    setProjects([blankProject]);
    setActiveProjectId(blankProject.id);
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || DEFAULT_PROJECT;

  const handleExportPDF = () => {
    generateProjectPDF(activeProject);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 pb-16 font-sans">
      {/* Top Banner & Header */}
      <header className="border-b-2 border-blue-600 bg-white sticky top-0 z-40 shadow-md no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white font-black shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black text-blue-950 tracking-tight flex items-center gap-2">
                <span>Visor y Analizador de Planos Municipales</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                  SISTEMA DE ANÁLISIS TÉCNICO
                </span>
              </h1>
              <p className="text-xs text-slate-600 font-semibold">{activeProject.title} — {activeProject.profesional}</p>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Active Project Dropdown */}
            {projects.length > 1 && (
              <select
                value={activeProjectId}
                onChange={(e) => setActiveProjectId(e.target.value)}
                className="bg-white text-slate-900 border-2 border-blue-600 rounded-xl text-xs font-bold px-3 py-2 outline-none cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    📁 {p.title}
                  </option>
                ))}
              </select>
            )}

            {/* Export PDF Official Button */}
            <button
              onClick={handleExportPDF}
              className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md"
              title="Generar PDF estructurado de Ficha Sintética y Balance de Superficies"
            >
              <FileDown className="w-4 h-4" />
              <span>Exportar PDF Ficha</span>
            </button>

            {/* API Key Settings Button */}
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border-2 ${
                customApiKey
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-500'
                  : 'bg-white text-blue-800 border-blue-600 hover:bg-blue-50'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-blue-700" />
              <span>{customApiKey ? 'API Key Configurada' : 'Configurar API Key'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 transition shadow-md"
              title="Imprimir"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 MAIN TOP-LEVEL NAVIGATION TABS */}
        <div className="bg-blue-50 border-t border-blue-200 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2 scrollbar-thin">
            <button
              onClick={() => setActiveMainTab('portal')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeMainTab === 'portal'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-slate-800 hover:text-blue-900 hover:bg-blue-100'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>1. Portal de Carga de Archivos</span>
              {projects.length > 0 && (
                <span className="bg-white text-blue-900 border border-blue-300 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                  {projects.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveMainTab('visual')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeMainTab === 'visual'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-slate-800 hover:text-blue-900 hover:bg-blue-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>2. Explorador Visual y Análisis IA</span>
            </button>

            <button
              onClick={() => setActiveMainTab('desglose')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeMainTab === 'desglose'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-slate-800 hover:text-blue-900 hover:bg-blue-100'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>3. Desglose Técnico y Balance de Superficies</span>
            </button>

            <button
              onClick={() => setActiveMainTab('inteligencia')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeMainTab === 'inteligencia'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-slate-800 hover:text-blue-900 hover:bg-blue-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>4. Consultas e Inteligencia de Obra</span>
            </button>

            <button
              onClick={() => setActiveMainTab('costos')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeMainTab === 'costos'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 font-extrabold'
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-800" />
              <span>5. Costos Aproximados Totales</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 no-print">
          <div className="bg-white border-2 border-blue-600 p-3.5 rounded-xl flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-800 shrink-0 font-bold">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-600 uppercase font-bold">Superficie Total</div>
              <div className="text-xs font-black text-slate-900 font-mono truncate max-w-[140px]" title={activeProject.superficie}>
                {activeProject.superficie}
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-blue-600 p-3.5 rounded-xl flex items-center gap-3 shadow-md">
            <div className="w-9 h-9 rounded-lg bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-800 shrink-0 font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-600 uppercase font-bold">Normativa Sísmica</div>
              <div className="text-xs font-black text-blue-900 font-mono">Ley 10575/2018</div>
            </div>
          </div>

          <div className="bg-white border-2 border-blue-600 p-3.5 rounded-xl flex items-center gap-3 shadow-md">
            <div className="w-9 h-9 rounded-lg bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-800 shrink-0 font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-600 uppercase font-bold">Firma Digital</div>
              <div className="text-xs font-black text-slate-900 font-mono">Verificada</div>
            </div>
          </div>

          <div className="bg-white border-2 border-blue-600 p-3.5 rounded-xl flex items-center gap-3 shadow-md">
            <div className="w-9 h-9 rounded-lg bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-800 shrink-0 font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-600 uppercase font-bold">Catastro</div>
              <div className="text-xs font-black text-slate-900 font-mono truncate max-w-[140px]" title={activeProject.catastro}>
                {activeProject.catastro}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Main Tab Display */}

        {/* TAB 1: Portal de Carga de Archivos */}
        {activeMainTab === 'portal' && (
          <section>
            <PortalDeCarga
              projects={projects}
              activeProjectId={activeProjectId}
              onSelectProject={setActiveProjectId}
              onProjectCreated={handleProjectCreated}
              onDeleteProject={handleDeleteProject}
              onResetAnalysis={handleResetAnalysis}
            />
          </section>
        )}

        {/* TAB 2: Explorador Visual y Análisis IA */}
        {activeMainTab === 'visual' && (
          <section className="space-y-4">
            <BlueprintViewer
              activeProject={activeProject}
              allProjects={projects}
              customApiKey={customApiKey}
            />
          </section>
        )}

        {/* TAB 3: Desglose Técnico y Balance de Superficies */}
        {activeMainTab === 'desglose' && (
          <section className="space-y-4">
            <BlueprintDataSummary key="desglose" activeProject={activeProject} initialTab="computos" />
          </section>
        )}

        {/* TAB 4: Consultas e Inteligencia de Obra */}
        {activeMainTab === 'inteligencia' && (
          <section className="space-y-4">
            <AIBlueprintAssistant
              customApiKey={customApiKey}
              onOpenKeyModal={() => setIsApiKeyModalOpen(true)}
              activeProject={activeProject}
            />
          </section>
        )}

        {/* TAB 5: Costos Aproximados Totales */}
        {activeMainTab === 'costos' && (
          <section className="space-y-4">
            <BlueprintDataSummary key="costos" activeProject={activeProject} initialTab="costos" />
          </section>
        )}
      </div>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaveKey={handleSaveApiKey}
        currentKey={customApiKey}
      />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </main>
  );
}
