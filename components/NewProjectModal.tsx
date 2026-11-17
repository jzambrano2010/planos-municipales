'use client';

import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle2, Building, Plus, AlertCircle } from 'lucide-react';

export interface ProjectData {
  id: string;
  title: string;
  propietario: string;
  profesional: string;
  catastro: string;
  superficie: string;
  estructura: string;
  fileUrl: string;
  fileName: string;
  fileType: 'pdf' | 'image';
}

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: ProjectData) => void;
}

export default function NewProjectModal({ isOpen, onClose, onProjectCreated }: NewProjectModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    propietario: '',
    profesional: '',
    catastro: '',
    superficie: '',
    estructura: 'Fundaciones compuestas, Estructura H°A°, Losas de viguetas pretensadas.'
  });
  const [dragActive, setDragActive] = useState<boolean>(false);

  if (!isOpen) return null;

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
    if (!file && !formData.title) return;

    const newProject: ProjectData = {
      id: `proj_${Date.now()}`,
      title: formData.title || 'Plano Municipal sin Nombre',
      propietario: formData.propietario || 'Propietario no especificado',
      profesional: formData.profesional || 'Profesional / Dirección Técnica',
      catastro: formData.catastro || 'Catastro no registrado',
      superficie: formData.superficie || 'Superficie no calculada',
      estructura: formData.estructura,
      fileUrl: previewUrl || '/assets/aistudio/plano_aprobado_municipal_87bd728a.pdf',
      fileName: file ? file.name : 'Plano_Nuevo.pdf',
      fileType: file && file.type.includes('image') ? 'image' : 'pdf'
    };

    onProjectCreated(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl space-y-4 p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">Cargar Nuevo Proyecto o Plano Municipal</h3>
            <p className="text-xs text-slate-400">Sube el plano arquitectónico en formato PDF o Imagen</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* File Upload Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer relative ${
              dragActive
                ? 'border-amber-400 bg-amber-500/10'
                : file
                ? 'border-emerald-500/60 bg-emerald-950/20'
                : 'border-slate-800 bg-slate-950 hover:border-slate-700'
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
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <div className="text-xs font-bold text-slate-100">{file.name}</div>
                <div className="text-[11px] text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Listo para inspección visual e IA
                </div>
              </div>
            ) : (
              <div className="space-y-2 flex flex-col items-center">
                <Upload className="w-8 h-8 text-amber-400 mb-1" />
                <div className="text-xs font-bold text-slate-200">
                  Arrastra aquí tu plano municipal o <span className="text-amber-400 underline">haz clic para examinar</span>
                </div>
                <div className="text-[11px] text-slate-500">Soporta planos en PDF, PNG, JPG, WEBP</div>
              </div>
            )}
          </div>

          {/* Form Fields for Project Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nombre o Domicilio de la Obra</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Calle Belgrano 1200 - Córdoba"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Propietario / Titular</label>
              <input
                type="text"
                value={formData.propietario}
                onChange={(e) => setFormData({ ...formData, propietario: e.target.value })}
                placeholder="Ej: Juan Pérez (DNI 30.123.456)"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Profesional / Conducción Técnica</label>
              <input
                type="text"
                value={formData.profesional}
                onChange={(e) => setFormData({ ...formData, profesional: e.target.value })}
                placeholder="Ej: Arq. María Gómez (MP 8590)"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nomenclatura Catastral / Lote</label>
              <input
                type="text"
                value={formData.catastro}
                onChange={(e) => setFormData({ ...formData, catastro: e.target.value })}
                placeholder="Ej: CIRC 02 - SECC 05 - MZA 12 - PARC 04"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Superficie Estimada (m²)
            </label>
            <input
              type="text"
              value={formData.superficie}
              onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
              placeholder="Ej: 180 m² cubiertos / 25 m² semicubiertos"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-slate-100 text-xs outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
            >
              <FileText className="w-4 h-4" />
              <span>Cargar Proyecto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
