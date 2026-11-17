'use client';

import React, { useState, useEffect } from 'react';
import { Send, Bot, Sparkles, RefreshCw, Key, ShieldCheck } from 'lucide-react';
import { ProjectData } from './NewProjectModal';

const SUGGESTED_QUERIES = [
  {
    label: 'Cálculo de Materiales H°A°',
    prompt: '¿Podrías estimar la cantidad aproximada de cemento, hierro ø10 y ø6, y hormigón necesario para la estructura?'
  },
  {
    label: 'Verificación Ley 10575/2018',
    prompt: 'Analiza el cumplimiento de la Ley Antisísmica 10575/2018 y las especificaciones registradas en el plano.'
  },
  {
    label: 'Cómputo de Contrapisos y Carpetas',
    prompt: 'Detalla el cómputo de contrapisos de cascote h=10cm en PB y carpetas cementicias h=3cm en PA para solados cerámicos.'
  },
  {
    label: 'Aislación Térmica e Hidrófuga',
    prompt: 'Detalla el paquete constructivo de la cubierta plana (hormigón alivianado, pintura poliuretánica, geotextil 70g/m² y bovedillas) y la eficiencia del DVH.'
  }
];

interface AIBlueprintAssistantProps {
  customApiKey?: string;
  onOpenKeyModal?: () => void;
  activeProject?: ProjectData | null;
  initialPrompt?: string;
}

export default function AIBlueprintAssistant({
  customApiKey = '',
  onOpenKeyModal,
  activeProject,
  initialPrompt
}: AIBlueprintAssistantProps) {
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>>([
    {
      sender: 'ai',
      text: '¡Hola! Soy tu **Asistente Técnico Inteligente de Obra y Planos**. He analizado el expediente cargado. Puedes hacerme cualquier consulta sobre estructura, contrapisos, carpetas, balance de superficies o Pliego de Especificaciones Técnicas.',
      timestamp: 'Inicio'
    }
  ]);

  useEffect(() => {
    setIsMounted(true);
    if (initialPrompt) {
      handleSend(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const getCurrentTime = () => {
    if (typeof window === 'undefined') return 'Inicio';
    return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || prompt;
    if (!textToSend.trim() || loading) return;

    const time = getCurrentTime();
    setMessages((prev) => [...prev, { sender: 'user', text: textToSend, timestamp: time }]);
    if (!userPrompt) setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          queryType: 'Consulta técnica sobre el plano',
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
            : undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: data.text, timestamp: getCurrentTime() }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `⚠️ No se pudo procesar la respuesta: ${data.error || 'Error en la respuesta del servidor.'}`,
            timestamp: getCurrentTime()
          }
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `⚠️ Error de comunicación: ${err.message}`,
          timestamp: getCurrentTime()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-blue-600 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[650px] text-slate-900">
      {/* Header */}
      <div className="bg-slate-100 p-4 border-b-2 border-blue-600 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-blue-950 text-sm flex items-center gap-1.5">
              <span>Asistente IA de Obra</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            </h3>
            <p className="text-[11px] text-slate-600">Consultas e Inteligencia de Obra (Gemini 3.8 Flash)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenKeyModal}
            className={`p-1.5 rounded-lg border transition text-xs flex items-center gap-1 font-bold ${
              customApiKey
                ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                : 'bg-white text-blue-800 border-blue-300 hover:bg-blue-50'
            }`}
            title="Configurar Clave API"
          >
            <Key className="w-3.5 h-3.5 text-blue-700" />
            <span className="hidden sm:inline">{customApiKey ? 'API Key OK' : 'API Key'}</span>
          </button>

          <button
            onClick={() =>
              setMessages([
                {
                  sender: 'ai',
                  text: 'Conversación reiniciada. ¿Qué otra duda tienes sobre la obra o el Pliego?',
                  timestamp: getCurrentTime()
                }
              ])
            }
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition text-xs flex items-center gap-1 font-bold"
            title="Limpiar chat"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Queries */}
      <div className="bg-blue-50 p-2.5 border-b border-blue-200 flex items-center gap-2 overflow-x-auto scrollbar-thin">
        {SUGGESTED_QUERIES.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(item.prompt)}
            disabled={loading}
            className="px-3 py-1.5 bg-white hover:bg-blue-100 disabled:opacity-50 text-slate-800 text-xs rounded-lg border border-blue-300 shrink-0 font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-blue-700" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono font-bold px-1">
              <span>{msg.sender === 'user' ? 'TÚ' : 'INGENIERO IA'}</span>
              <span>•</span>
              <span>{isMounted ? msg.timestamp : ''}</span>
            </div>
            <div
              className={`max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-700 text-white font-medium rounded-tr-none shadow-md'
                  : 'bg-white border-2 border-blue-300 text-slate-900 rounded-tl-none whitespace-pre-wrap font-sans shadow-md'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-700 text-xs font-bold italic p-2.5 bg-white rounded-xl border border-blue-300 w-fit shadow-sm">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-700" />
            <span>Analizando plano y Pliego de Especificaciones...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-100 border-t-2 border-blue-600 flex items-center gap-2"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Escribe tu consulta técnica sobre la obra, contrapisos, carpetas o Pliego..."
          disabled={loading}
          className="flex-1 bg-white border border-slate-300 focus:border-blue-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-500 outline-none transition disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="bg-blue-700 hover:bg-blue-800 text-white disabled:opacity-50 font-bold p-2.5 rounded-xl transition shadow-md shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
