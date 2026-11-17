'use client';

import React, { useState, useEffect } from 'react';
import { Key, Check, ShieldAlert, ExternalLink, X, Eye, EyeOff } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKey: (key: string) => void;
  currentKey: string;
}

export default function ApiKeyModal({ isOpen, onClose, onSaveKey, currentKey }: ApiKeyModalProps) {
  const [keyInput, setKeyInput] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const [prevCurrentKey, setPrevCurrentKey] = useState(currentKey);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (currentKey !== prevCurrentKey || isOpen !== prevIsOpen) {
    setPrevCurrentKey(currentKey);
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setKeyInput(currentKey);
    }
  }

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveKey('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base">Configurar Clave API de Gemini</h3>
            <p className="text-xs text-slate-400">Permite usar el Asistente IA fuera del entorno de desarrollo</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-slate-300">
            Tu Gemini API Key (Google AI Studio)
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 pr-10 text-xs text-slate-100 font-mono outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <span>¿No tienes una clave? Obtén una gratis en</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-0.5 font-bold"
            >
              <span>Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-300">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Tu clave se guardará localmente en tu navegador (`localStorage`) y nunca se compartirá con terceros.
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          {currentKey ? (
            <button
              onClick={handleClear}
              className="px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition"
            >
              Borrar clave
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : null}
              <span>{savedSuccess ? 'Guardado' : 'Guardar Clave'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
