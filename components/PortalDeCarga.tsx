'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Upload,
  FileText,
  CheckCircle2,
  Plus,
  Building,
  Trash2,
  Eye,
  FileDown,
  ShieldCheck,
  FolderOpen,
  RotateCcw,
  AlertTriangle,
  FileCode
} from 'lucide-react';
import { ProjectData } from './NewProjectModal';
import { generateProjectPDF } from '@/lib/pdfGenerator';

interface PortalDeCargaProps {
  projects: ProjectData[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onProjectCreated: (project: ProjectData) => void;
  onDeleteProject?: (id: string) => void;
  onResetAnalysis?: () => void;
}

export default function PortalDeCarga({
  projects,
  activeProjectId,
  onSelectProject,
  onProjectCreated,
  onDeleteProject,
  onResetAnalysis
}: PortalDeCargaProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isFueraDeAprobacion, setIsFueraDeAprobacion] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    title: '',
    propietario: '',
    profesional: '',
    catastro: '',
    superficie: '',
    estructura: 'Fundaciones Z1/Z2/B1, 28 columnas PB, 24 PA, losas L1-L8 (h=17cm).'
  });
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);

      if (!formData.title) {
        setFormData((prev) => ({
          ...prev,
          title: selectedFile.name.replace(/\.[^/.]+$/, '')
        }));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);

      if (!formData.title) {
        setFormData((prev) => ({
          ...prev,
          title: selectedFile.name.replace(/\.[^/.]+$/, '')
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newProject: ProjectData = {
      id: `proj_${Date.now()}`,
      title: `${formData.title} ${isFueraDeAprobacion ? '(Fuera de Aprobación Municipal)' : ''}`,
      propietario: formData.propietario || 'Propietario no especificado',
      profesional: formData.profesional || 'Ing. Civil / Dirección Técnica',
      catastro: formData.catastro || 'Sin Aprobación Municipal / Anteproyecto',
      superficie: formData.superficie || 'Superficie no especificada',
      estructura: formData.estructura,
      fileUrl: previewUrl || '/assets/aistudio/plano_aprobado_municipal_87bd728a.pdf',
      fileName: file ? file.name : 'Plano_Nuevo.pdf',
      fileType: file && file.type.includes('image') ? 'image' : 'pdf'
    };

    onProjectCreated(newProject);
    setFile(null);
    setPreviewUrl('');
    setFormData({
      title: '',
      propietario: '',
      profesional: '',
      catastro: '',
      superficie: '',
      estructura: 'Fundaciones Z1/Z2/B1, 28 columnas PB, 24 PA, losas L1-L8 (h=17cm).'
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Card with Reset & Unapproved Plan buttons */}
      <div className="bg-white border-2 border-blue-600 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start justify-between gap-6 text-slate-900">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300">
              Portal de Carga & Gestión
            </span>
            <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-blue-700" />
              <span>Portal de Carga de Proyectos</span>
            </h2>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-sans">
            Carga planos municipales o <strong>Planos Fuera de Aprobación Municipal (Anteproyectos / Croquis)</strong>. Todo plano cargado se incorpora automáticamente al contexto del <strong>Análisis con Inteligencia Artificial (Gemini)</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Reset Analysis Button */}
          <button
            onClick={onResetAnalysis}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md"
            title="Blanquear el análisis a 0 para comenzar un proyecto limpio"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset a 0 (Blanquear Análisis)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Upload Area (7 cols) */}
        <div className="lg:col-span-7 bg-white border-2 border-blue-600 rounded-2xl p-6 shadow-xl space-y-6 text-slate-900">
          <div className="border-b border-blue-200 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-blue-950 text-sm flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-700" />
              <span>Cargar Nuevo Plano o Anteproyecto</span>
            </h3>

            {/* Toggle Fuera de Aprobación Municipal */}
            <button
              type="button"
              onClick={() => setIsFueraDeAprobacion(!isFueraDeAprobacion)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                isFueraDeAprobacion
                  ? 'bg-amber-100 text-amber-900 border-amber-400 font-extrabold'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Plano fuera de Aprobación Municipal {isFueraDeAprobacion ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* File Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer relative ${
                dragActive
                  ? 'border-blue-600 bg-blue-50'
                  : file
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-blue-300 bg-slate-50 hover:border-blue-500'
              }`}
            >
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />

              {file ? (
                <div className="space-y-2 flex flex-col items-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  <div className="text-sm font-bold text-slate-900">{file.name}</div>
                  <div className="text-xs text-slate-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Listo para incorporar al Análisis IA
                  </div>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center">
                  <Upload className="w-10 h-10 text-blue-700 mb-1" />
                  <div className="text-sm font-bold text-slate-900">
                    Arrastra el plano o anteproyecto aquí o <span className="text-blue-700 underline">haz clic para examinar</span>
                  </div>
                  <div className="text-xs text-slate-600">Soporta formatos PDF, PNG, JPG, WEBP</div>
                </div>
              )}
            </div>

            {isFueraDeAprobacion && (
              <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl flex items-start gap-2 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Atención:</strong> Este plano se procesará como <em>&quot;Plano Fuera de Aprobación Municipal / Anteproyecto&quot;</em> para revisión preventiva y cómputo previo con IA.
                </span>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-800 font-bold mb-1">Nombre / Domicilio de Obra</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Casa Residencial - Lote 14"
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Propietario / Comitente</label>
                <input
                  type="text"
                  value={formData.propietario}
                  onChange={(e) => setFormData({ ...formData, propietario: e.target.value })}
                  placeholder="Ej: Carlos Gómez"
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Profesional proyectista</label>
                <input
                  type="text"
                  value={formData.profesional}
                  onChange={(e) => setFormData({ ...formData, profesional: e.target.value })}
                  placeholder="Ej: Ing. Civil / Arq. Proyectista"
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Catastro / Estado Municipal</label>
                <input
                  type="text"
                  value={formData.catastro}
                  onChange={(e) => setFormData({ ...formData, catastro: e.target.value })}
                  placeholder={isFueraDeAprobacion ? 'Fuera de Aprobación Municipal' : 'CIRC 01 SECC 09 MZA 052 PARC 001'}
                  className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg"
            >
              <FileText className="w-4 h-4" />
              <span>Cargar Plano para Análisis IA</span>
            </button>
          </form>
        </div>

        {/* Right Column: Expedientes & PDF (5 cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-blue-600 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between text-slate-900">
          <div className="space-y-4">
            <div className="border-b border-blue-200 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-700" />
                <span>Expedientes y Planos Cargados</span>
              </h3>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 pr-1">
              {projects.map((proj) => {
                const isActive = proj.id === activeProjectId;
                return (
                  <motion.div
                    key={proj.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => onSelectProject(proj.id)}
                    className={`p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between gap-3 ${
                      isActive
                        ? 'bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-400/30'
                        : 'bg-white border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                          {proj.fileType.toUpperCase()}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{proj.title}</h4>
                        <p className="text-xs text-slate-600">{proj.propietario}</p>
                      </div>

                      {isActive && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 shrink-0">
                          ACTIVO
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-600 font-mono space-y-0.5">
                      <div><strong className="text-slate-800">Catastro:</strong> {proj.catastro}</div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200 pt-2.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateProjectPDF(proj);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-[11px] flex items-center gap-1.5 transition shadow-sm"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>PDF Ficha</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <a
                          href={proj.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition"
                          title="Ver archivo original"
                        >
                          <Eye className="w-4 h-4" />
                        </a>

                        {proj.id !== 'default' && onDeleteProject && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProject(proj.id);
                            }}
                            className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition"
                            title="Eliminar expediente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
