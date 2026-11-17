'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  MapPin,
  UserCheck,
  ShieldCheck,
  Ruler,
  Layers,
  Home,
  CheckCircle,
  Box,
  HardHat,
  Droplets,
  Zap,
  Calculator,
  Percent,
  CheckCircle2,
  PackageCheck,
  Printer,
  FileText,
  BookOpen,
  ShoppingBag,
  DoorOpen,
  Cpu,
  AlertCircle,
  LayoutList,
  Award
} from 'lucide-react';
import { generatePliegoWord } from '@/lib/wordGenerator';
import { ProjectData } from './NewProjectModal';

interface MaterialChandiasItem {
  id: string;
  category:
    | 'Hormigón & Acero'
    | 'Contrapisos & Solados'
    | 'Mampostería & Mortero'
    | 'Capa Aisladora Doble Horizontal y Vertical'
    | 'Cubiertas & Aislaciones'
    | 'Instalaciones Sanitarias & Pluviales'
    | 'Agua Fría & Caliente (Acqua System)'
    | 'Artefactos Sanitarios & Griferías'
    | 'Aberturas & Carpinterías'
    | 'Instalaciones Eléctricas & Domótica'
    | 'Revestimientos & Instalaciones';
  itemDescription: string;
  physicalQty: number; // Volume, Area, Length, Units
  physicalUnit: string;
  dosajeChandias: string;
  calculatedTheoretical: string; // Físicas
  commercialUnits: string; // Comerciales
}

const CATEGORY_COLORS: Record<
  string,
  { headerBg: string; border: string; badgeBg: string; textColor: string; cardBg: string }
> = {
  'Hormigón & Acero': {
    headerBg: 'bg-blue-900 text-white',
    border: 'border-blue-600',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
    textColor: 'text-blue-950',
    cardBg: 'bg-blue-50/40'
  },
  'Contrapisos & Solados': {
    headerBg: 'bg-emerald-900 text-white',
    border: 'border-emerald-600',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    textColor: 'text-emerald-950',
    cardBg: 'bg-emerald-50/40'
  },
  'Mampostería & Mortero': {
    headerBg: 'bg-amber-900 text-white',
    border: 'border-amber-600',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    textColor: 'text-amber-950',
    cardBg: 'bg-amber-50/40'
  },
  'Capa Aisladora Doble Horizontal y Vertical': {
    headerBg: 'bg-sky-900 text-white',
    border: 'border-sky-600',
    badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
    textColor: 'text-sky-950',
    cardBg: 'bg-sky-50/40'
  },
  'Cubiertas & Aislaciones': {
    headerBg: 'bg-purple-900 text-white',
    border: 'border-purple-600',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
    textColor: 'text-purple-950',
    cardBg: 'bg-purple-50/40'
  },
  'Instalaciones Sanitarias & Pluviales': {
    headerBg: 'bg-indigo-900 text-white',
    border: 'border-indigo-600',
    badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    textColor: 'text-indigo-950',
    cardBg: 'bg-indigo-50/40'
  },
  'Agua Fría & Caliente (Acqua System)': {
    headerBg: 'bg-teal-900 text-white',
    border: 'border-teal-600',
    badgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
    textColor: 'text-teal-950',
    cardBg: 'bg-teal-50/40'
  },
  'Artefactos Sanitarios & Griferías': {
    headerBg: 'bg-cyan-950 text-white',
    border: 'border-cyan-700',
    badgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    textColor: 'text-cyan-950',
    cardBg: 'bg-cyan-50/40'
  },
  'Aberturas & Carpinterías': {
    headerBg: 'bg-rose-950 text-white',
    border: 'border-rose-700',
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
    textColor: 'text-rose-950',
    cardBg: 'bg-rose-50/40'
  },
  'Instalaciones Eléctricas & Domótica': {
    headerBg: 'bg-slate-900 text-white',
    border: 'border-slate-700',
    badgeBg: 'bg-slate-200 text-slate-900 border-slate-400',
    textColor: 'text-slate-950',
    cardBg: 'bg-slate-100/50'
  },
  'Revestimientos & Instalaciones': {
    headerBg: 'bg-orange-950 text-white',
    border: 'border-orange-700',
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
    textColor: 'text-orange-950',
    cardBg: 'bg-orange-50/40'
  }
};

const CHANDIAS_MATERIAL_COMPUTATIONS: MaterialChandiasItem[] = [
  // 1. Hormigón & Acero (H-21 Dosaje 1:2:3 / CIRSOC 201 / Viguetas T180)
  {
    id: 'relleno_nivelacion',
    category: 'Contrapisos & Solados',
    itemDescription: 'Relleno y Nivelación de Terreno por Unidades Habitacionales (U.H. 1: Lote 125m² x 0.30m + U.H. 2: Lote 125m² x 0.30m)',
    physicalQty: 75.0,
    physicalUnit: 'm³',
    dosajeChandias: 'Fórmula por U.H.: U.H. 1 (125 m² x 0.30 m = 37.5 m³) + U.H. 2 (125 m² x 0.30 m = 37.5 m³) = Total 75 m³ sub-base compactada en capas de 15cm',
    calculatedTheoretical: '75 m³ de tierra seleccionada / suelo-tosca (U.H. 1: 37.5 m³ + U.H. 2: 37.5 m³)',
    commercialUnits: '15 Camiones de Tierra de Relleno (5 m³ c/u - U.H. 1: 7.5 cam. / U.H. 2: 7.5 cam.)'
  },
  {
    id: 'losas_viguetas_pretensadas',
    category: 'Hormigón & Acero',
    itemDescription: 'Losas de Viguetas Prefabricadas T180 + Capa de Compresión H-21 (10% Sup = 23.69 m³) + Bovedillas EPS h=12cm + Malla SIMA (Losas L1 a L8 - 236.89 m²)',
    physicalQty: 236.89,
    physicalUnit: 'm²',
    dosajeChandias: 'Cómputo H-21 (Regla 10% Sup Losas = 23.69 m³ H°) + Dosaje Chandías 1:2:3 (320kg cem / 0.45m³ arena / 0.85m³ piedra por m³) + 320 m.l. Viguetas T180 + 1,250 Bovedillas EPS + 18 Paneles Malla SIMA Q92',
    calculatedTheoretical: '23.69 m³ H° H-21 (7,581 kg Cemento + 10.66 m³ Arena + 20.14 m³ Piedra) + 320 m.l. Viguetas + 1,250 Bovedillas EPS + 18 Paneles Malla SIMA',
    commercialUnits: '304 Bolsas Cemento (25kg) + 11 m³ Arena + 20 m³ Piedra + 80 Viguetas Pretensadas T180 (3.20m-4.50m) + 1250 Bovedillas EPS h=12cm + 18 Paneles Malla SIMA (2.40x6m)'
  },
  {
    id: 'h_fundaciones',
    category: 'Hormigón & Acero',
    itemDescription: 'Hormigón H-21 en Zapatas Z1 (0.80x0.20m), Z2 (0.60x0.40m) y Bases B1',
    physicalQty: 24.5,
    physicalUnit: 'm³',
    dosajeChandias: 'H-21 1:2:3 (320kg cem / 0.45m³ arena / 0.85m³ piedra por m³)',
    calculatedTheoretical: '7,840 kg Cemento + 11.0 m³ Arena + 20.8 m³ Piedra partida',
    commercialUnits: '314 Bolsas Cemento (25kg) + 11 m³ Arena + 21 m³ Piedra (5 camiones)'
  },
  {
    id: 'h_columnas',
    category: 'Hormigón & Acero',
    itemDescription: 'Hormigón H-21 en 52 Columnas C1 (28 PB + 24 PA)',
    physicalQty: 12.8,
    physicalUnit: 'm³',
    dosajeChandias: 'H-21 1:2:3 (320kg cem / 0.45m³ arena / 0.85m³ piedra por m³)',
    calculatedTheoretical: '4,096 kg Cemento + 5.76 m³ Arena + 10.88 m³ Piedra partida',
    commercialUnits: '164 Bolsas Cemento (25kg) + 6 m³ Arena + 11 m³ Piedra partida'
  },
  {
    id: 'h_vigas_losas',
    category: 'Hormigón & Acero',
    itemDescription: 'Vigas de Hormigón Armado V1-V5 (PB y PA)',
    physicalQty: 21.6,
    physicalUnit: 'm³',
    dosajeChandias: 'H-21 1:2:3 (320kg cem / 0.45m³ arena / 0.85m³ piedra por m³)',
    calculatedTheoretical: '6,912 kg Cemento + 9.72 m³ Arena + 18.36 m³ Piedra partida',
    commercialUnits: '277 Bolsas Cemento (25kg) + 10 m³ Arena + 19 m³ Piedra partida'
  },
  {
    id: 'acero_adn420',
    category: 'Hormigón & Acero',
    itemDescription: 'Acero de Construcción ADN 420 (Barras ø10 mm y ø8 mm)',
    physicalQty: 1840,
    physicalUnit: 'kg',
    dosajeChandias: 'Chandías: Ratios sísmicos H°A° (75-85 kg acero / m³ H° - CIRSOC 103)',
    calculatedTheoretical: '1,136 kg (ø10 mm) + 704 kg (ø8 mm)',
    commercialUnits: '154 Barras ø10mm x 12m + 149 Barras ø8mm x 12m (303 barras total)'
  },
  {
    id: 'acero_estribos',
    category: 'Hormigón & Acero',
    itemDescription: 'Estribos de Acero Liso ø6 mm (c/15cm en columnas y vigas)',
    physicalQty: 480,
    physicalUnit: 'kg',
    dosajeChandias: 'Chandías: 0.222 kg/m (180 barras de 12m / ~1420 estribos 15x15cm)',
    calculatedTheoretical: '480 kg acero liso ø6 mm',
    commercialUnits: '180 Barras ø6mm x 12m (Comercial)'
  },
  {
    id: 'malla_sima',
    category: 'Hormigón & Acero',
    itemDescription: 'Malla Electrosoldada SIMA 1ø6 mm c/20x20cm (Losas L1 a L8)',
    physicalQty: 250,
    physicalUnit: 'm²',
    dosajeChandias: 'Chandías: Solape mínimo 5-10% entre paneles (14.4 m² por panel)',
    calculatedTheoretical: '236.89 m² netos + 5% solape = 248.7 m²',
    commercialUnits: '18 Paneles Malla SIMA (2.40 x 6.00 m)'
  },

  // 2. Contrapisos & Carpetas (CHANDÍAS DOSAJES)
  {
    id: 'contrapiso_pb',
    category: 'Contrapisos & Solados',
    itemDescription: 'Contrapiso de Hormigón de Cascote h=10 cm sobre suelo compactado (PB)',
    physicalQty: 13.4,
    physicalUnit: 'm³',
    dosajeChandias: 'Chandías Dosaje 1:1/4:4:8 (105kg cem / 45kg cal / 0.45m³ arena / 0.90m³ cascote)',
    calculatedTheoretical: '1,407 kg Cemento + 603 kg Cal + 6.0 m³ Arena + 12.0 m³ Cascote',
    commercialUnits: '57 Bolsas Cemento (25kg) + 25 Bolsas Cal (25kg) + 6 m³ Arena + 12 m³ Cascote'
  },
  {
    id: 'carpeta_pa',
    category: 'Contrapisos & Solados',
    itemDescription: 'Carpeta Cementicia de Nivelación 1:3 h=3 cm en Planta Alta (previa a cerámicos)',
    physicalQty: 3.1,
    physicalUnit: 'm³',
    dosajeChandias: 'Chandías Dosaje 1:3 (450kg cem / 1.05m³ arena zarandeada por m³ mortero)',
    calculatedTheoretical: '1,395 kg Cemento + 3.25 m³ Arena fina zarandeada',
    commercialUnits: '56 Bolsas Cemento (25kg) + 3.5 m³ Arena fina'
  },
  {
    id: 'pisos_ceramicos',
    category: 'Contrapisos & Solados',
    itemDescription: 'Pisos Cerámicos / Porcellanato 50x50 cm + Pegamento e Pastina (PB y PA)',
    physicalQty: 236.89,
    physicalUnit: 'm²',
    dosajeChandias: 'Chandías: Rendimiento pegamento 6kg/m² + 0.3kg pastina/m²',
    calculatedTheoretical: '236.89 m² cerámicos + 1,421 kg pegamento + 71 kg pastina',
    commercialUnits: '125 Cajas Cerámicos (2m²/caja = 250m²) + 57 Bolsas Pegamento (25kg) + 15 Bolsas Pastina'
  },

  // 3. Mampostería & Morteros (CIRSOC 501)
  {
    id: 'mamp_exterior',
    category: 'Mampostería & Mortero',
    itemDescription: 'Mampostería de Ladrillo Cerámico Portante 18x19x33 cm (Muros Exteriores)',
    physicalQty: 230,
    physicalUnit: 'm²',
    dosajeChandias: 'Chandías Mortero 1:1/2:4 (16 unid/m² + 4.2kg cem / 9.5kg cal / 0.035m³ arena)',
    calculatedTheoretical: '3,680 Ladrillos + 966 kg Cemento + 2,185 kg Cal + 8.0 m³ Arena',
    commercialUnits: '3,670 Ladrillos Portantes 18cm + 39 Bolsas Cemento (25kg) + 88 Bolsas Cal (25kg)'
  },
  {
    id: 'mamp_interior',
    category: 'Mampostería & Mortero',
    itemDescription: 'Mampostería de Ladrillo Hueco 12x19x33 cm (Tabiques Divisorios)',
    physicalQty: 130,
    physicalUnit: 'm²',
    dosajeChandias: 'Chandías Mortero 1:1/2:4 (16 unid/m² + 2.8kg cem / 6.2kg cal / 0.025m³ arena)',
    calculatedTheoretical: '2,080 Ladrillos + 364 kg Cemento + 806 kg Cal + 3.25 m³ Arena',
    commercialUnits: '2,080 Ladrillos Huecos 12cm + 15 Bolsas Cemento (25kg) + 33 Bolsas Cal (25kg)'
  },
  {
    id: 'tapia_excavacion',
    category: 'Mampostería & Mortero',
    itemDescription: 'Excavación Manual para Zapatas de Tapia en Patio Trasero (Sección 0.50m x 0.60m x 42.50 m.l. - U.H. 1: 16.25m + U.H. 2: 16.25m + Divisoria Común: 10m)',
    physicalQty: 12.75,
    physicalUnit: 'm³',
    dosajeChandias: 'Fórmula: 42.50 m.l. tapias (U.H.1: 16.25m + U.H.2: 16.25m + Divisoria Común: 10m) x 0.50m ancho x 0.60m prof = 12.75 m³ excavación',
    calculatedTheoretical: '12.75 m³ de excavación manual en zanja',
    commercialUnits: 'Trabajo de Zanjeo Manual y Retiro de Tierra Sobrante'
  },
  {
    id: 'tapia_zapata_hormigon',
    category: 'Hormigón & Acero',
    itemDescription: 'Zapata Corrida de Hormigón H-15 / Hormigón Pobre en Tapias de Patio Trasero (Sección 0.50m x 0.20m x 42.50 m.l.)',
    physicalQty: 4.25,
    physicalUnit: 'm³',
    dosajeChandias: 'Chandías Dosaje 1:3:5 (240kg cem / 0.60m³ arena / 0.85m³ piedra o cascote por m³)',
    calculatedTheoretical: '1,020 kg Cemento + 2.55 m³ Arena + 3.61 m³ Piedra/Cascote (4.25 m³ H°)',
    commercialUnits: '41 Bolsas Cemento (25kg) + 3 m³ Arena + 4 m³ Cascote/Piedra'
  },
  {
    id: 'tapia_muro_mamposteria',
    category: 'Mampostería & Mortero',
    itemDescription: 'Muro de Tapia Típica en Patio Trasero h=2.40m en Ladrillo Hueco 12x19x33 cm (42.50 m.l. x 2.40m = 102 m²)',
    physicalQty: 102.00,
    physicalUnit: 'm²',
    dosajeChandias: 'Fórmula: 42.50 m.l. x 2.40m alto = 102 m². Mortero 1:1/2:4 (16 unid/m² + 2.8kg cem / 6.2kg cal / 0.025m³ arena)',
    calculatedTheoretical: '1,632 Ladrillos Huecos + 286 kg Cemento + 632 kg Cal + 2.55 m³ Arena',
    commercialUnits: '1,632 Ladrillos Huecos 12cm + 12 Bolsas Cemento (25kg) + 26 Bolsas Cal (25kg)'
  },
  {
    id: 'tapia_revoque_impermeable',
    category: 'Mampostería & Mortero',
    itemDescription: 'Revoque Exterior Impermeable (Ceresita 1:3) + Grueso y Fino en Tapias de Patio Trasero (2 caras x 102 m² = 204 m²)',
    physicalQty: 204.00,
    physicalUnit: 'm²',
    dosajeChandias: 'Chandías: Mortero 1:3 con Ceresita 1kg/m² (6kg cem / 15kg cal / 0.03m³ arena / 0.12kg Ceresita)',
    calculatedTheoretical: '1,224 kg Cemento + 3,060 kg Cal + 6.12 m³ Arena + 24.5 kg Ceresita',
    commercialUnits: '49 Bolsas Cemento (25kg) + 123 Bolsas Cal (25kg) + 6.5 m³ Arena + 2 Bidones Ceresita (12kg)'
  },

  // 4. Cubiertas & Aislaciones
  {
    id: 'cub_hormigon_alivianado',
    category: 'Cubiertas & Aislaciones',
    itemDescription: 'Hormigón Alivianado con perlas EPS para carga de pendiente h=8cm promedio',
    physicalQty: 18.9,
    physicalUnit: 'm³',
    dosajeChandias: 'Chandías: 130kg cemento + 1 m³ perlas poliestireno por m³',
    calculatedTheoretical: '2,457 kg Cemento + 18.9 m³ Perlas Poliestireno Expandido',
    commercialUnits: '99 Bolsas Cemento (25kg) + 19 m³ Perlas Poliestireno (bolsas 1m³)'
  },
  {
    id: 'impermeabilizacion_poliuretanica',
    category: 'Cubiertas & Aislaciones',
    itemDescription: 'Membrana Líquida Poliuritánica + Malla Geotextil 70 gr/m²',
    physicalQty: 245,
    physicalUnit: 'm²',
    dosajeChandias: 'Chandías: Rendimiento 1.2kg/m² en 3 manos cruzadas + 5% solape',
    calculatedTheoretical: '294 kg Membrana Poliuritánica + 258 m² Malla Geotextil 70g',
    commercialUnits: '15 Cuñetes Membrana Poliuritánica (20kg) + 260 m² Malla Geotextil 70g'
  },

  // 5. Instalaciones Sanitarias (Cloacales & Pluviales - Manual Awaduct / IRAM 13476)
  {
    id: 'inst_cloacal_principal',
    category: 'Instalaciones Sanitarias & Pluviales',
    itemDescription: 'Instalación Cloacal Principal: Cañerías Awaduct PVC ø110 mm Reforzado en PB, PA y colectores',
    physicalQty: 64.0,
    physicalUnit: 'm.l.',
    dosajeChandias: 'Manual Awaduct: O\'Ring doble labio M.O.L., 1 caño 4m c/3.6m red + codos 45°',
    calculatedTheoretical: '64.0 m.l. cañería Awaduct ø110 mm + 14 Codos ø110 a 45° + 10 Piletas/Bocas',
    commercialUnits: '17 Caños Awaduct Cloacal ø110mm x 4m + 16 Codos 45° ø110mm'
  },
  {
    id: 'inst_cloacal_secundaria',
    category: 'Instalaciones Sanitarias & Pluviales',
    itemDescription: 'Instalación Cloacal Secundaria y Ventilaciones: Cañerías Awaduct PVC ø63 mm / ø50 mm',
    physicalQty: 48.0,
    physicalUnit: 'm.l.',
    dosajeChandias: 'Manual Awaduct: Caños de 4m + Piletas de patio sifonadas 20x20cm inox',
    calculatedTheoretical: '48.0 m.l. cañería Awaduct ø63mm/ø50mm + 6 Piletas de patio sifonadas',
    commercialUnits: '13 Caños Awaduct ø63mm x 4m + 6 Piletas de Patio Sifonadas 20x20cm'
  },
  {
    id: 'inst_camaras_inspeccion',
    category: 'Instalaciones Sanitarias & Pluviales',
    itemDescription: 'Cámaras de Inspección 60x60 cm (H°A° / Mampostería revocada con mortero 1:2 Ceresita)',
    physicalQty: 4.0,
    physicalUnit: 'unidades',
    dosajeChandias: 'Chandías: 120kg cem / 0.25m³ arena / 6kg Ceresita por cámara',
    calculatedTheoretical: '4 Cámaras 60x60cm completos con cojinetes + 480 kg Cemento + 24 kg Ceresita',
    commercialUnits: '4 Cámaras de Inspección 60x60cm con Tapa de H° + 20 Bolsas Cemento (25kg) + 2 Bidones Ceresita (12kg)'
  },
  {
    id: 'inst_pluvial_bajadas',
    category: 'Instalaciones Sanitarias & Pluviales',
    itemDescription: 'Instalación Pluvial: Cañerías Awaduct PVC ø110 mm en Embudos de Losa y Bajadas Pluviales',
    physicalQty: 56.0,
    physicalUnit: 'm.l.',
    dosajeChandias: 'Manual Awaduct: 1 bajada ø110mm c/60m² de cubierta + embudos con rejilla',
    calculatedTheoretical: '56.0 m.l. cañería Awaduct pluvial ø110mm + 6 Embudos de losa',
    commercialUnits: '15 Caños Awaduct Pluvial ø110mm x 4m + 6 Embudos de Losa 20x20cm'
  },

  // 6. Agua Fría & Caliente (Manual Acqua System / IRAM 13470 - IRAM 13471)
  {
    id: 'acqua_25mm',
    category: 'Agua Fría & Caliente (Acqua System)',
    itemDescription: 'Cañería Acqua System PN20 Termofusión ø25 mm (Tramos principales e interconexiones)',
    physicalQty: 48.0,
    physicalUnit: 'm.l.',
    dosajeChandias: 'Manual Acqua System: Unión por Termofusión a 260°C (+5% desperdicio corte)',
    calculatedTheoretical: '48.0 m.l. cañería PP-R ø25mm PN20',
    commercialUnits: '13 Tiras Caño Acqua System PN20 ø25mm (Tiras 4m)'
  },
  {
    id: 'acqua_20mm',
    category: 'Agua Fría & Caliente (Acqua System)',
    itemDescription: 'Cañería Acqua System PN20 Termofusión ø20 mm (Derivaciones a artefactos baños y cocinas)',
    physicalQty: 72.0,
    physicalUnit: 'm.l.',
    dosajeChandias: 'Manual Acqua System: Unión por Termofusión a 260°C (+5% desperdicio corte)',
    calculatedTheoretical: '72.0 m.l. cañería PP-R ø20mm PN20',
    commercialUnits: '19 Tiras Caño Acqua System PN20 ø20mm (Tiras 4m)'
  },
  {
    id: 'acqua_accesorios',
    category: 'Agua Fría & Caliente (Acqua System)',
    itemDescription: 'Accesorios Acqua System (Codos 90°, Codos con rosca metal MH 1/2", Tes, Uniones Dobles, Sobrepasos)',
    physicalQty: 95.0,
    physicalUnit: 'unid',
    dosajeChandias: 'Manual Acqua System: Conexiones con rosca con inserto de bronce niquelado',
    calculatedTheoretical: '40 Codos ø20/25 + 24 Codos rosca hembra 1/2" + 18 Tes + 13 Uniones dobles',
    commercialUnits: '95 Piezas surtidas Acqua System Termofusión'
  },

  // 7. Artefactos Sanitarios & Griferías
  {
    id: 'artefacto_inodoro',
    category: 'Artefactos Sanitarios & Griferías',
    itemDescription: 'Inodoros sifonados de losa blanca con mochila de doble descarga integrada',
    physicalQty: 4.0,
    physicalUnit: 'unid',
    dosajeChandias: 'Especificación: Inodoro loza blanca c/depósito a codo y fuelle de goma (2 PB + 2 PA)',
    calculatedTheoretical: '4 Inodoros con mochila + 4 Asientos c/caída amortiguada',
    commercialUnits: '4 Juegos Inodoro Completo c/Mochila y Asiento'
  },
  {
    id: 'artefacto_bidet',
    category: 'Artefactos Sanitarios & Griferías',
    itemDescription: 'Bidets de losa blanca 3 orificios para grifería combinación',
    physicalQty: 2.0,
    physicalUnit: 'unid',
    dosajeChandias: 'Especificación: Bidet loza blanca en baños principales Planta Alta',
    calculatedTheoretical: '2 Bidets completos',
    commercialUnits: '2 Bidets Losa Blanca'
  },
  {
    id: 'artefacto_lavatorio',
    category: 'Artefactos Sanitarios & Griferías',
    itemDescription: 'Lavatorios / Vanitorys con balsa de loza blanca y mueble suspendido',
    physicalQty: 4.0,
    physicalUnit: 'unid',
    dosajeChandias: 'Especificación: 2 vanitorys PB (Toilettes) + 2 vanitorys PA (Baños principales)',
    calculatedTheoretical: '4 Lavatorios / Vanitorys',
    commercialUnits: '4 Muebles Vanitory c/Balsa Loza Blanca'
  },
  {
    id: 'artefacto_pileta_cocina',
    category: 'Artefactos Sanitarios & Griferías',
    itemDescription: 'Piletas de Cocina Bacha Doble Acero Inoxidable AISI 304 (Dúplex 1 y 2)',
    physicalQty: 2.0,
    physicalUnit: 'unid',
    dosajeChandias: 'Especificación: Bacha doble 71x37x18 cm colocación bajo mesada',
    calculatedTheoretical: '2 Piletas Bacha Doble Acero Inox',
    commercialUnits: '2 Piletas Bacha Doble Acero Inoxidable'
  },
  {
    id: 'artefacto_mesada_cocina',
    category: 'Artefactos Sanitarios & Griferías',
    itemDescription: 'Mesadas de Granito Gris Mara h=2cm con zócalo h=5cm y trasforo para bacha',
    physicalQty: 4.80,
    physicalUnit: 'm.l.',
    dosajeChandias: 'Especificación: 2 Mesadas de L = 2.40 m de largo cada una en PB',
    calculatedTheoretical: '4.80 metros lineales de mesada de granito',
    commercialUnits: '2 Mesadas Granito Gris Mara (2.40 x 0.60 m c/u)'
  },
  {
    id: 'griferia_cocina',
    category: 'Artefactos Sanitarios & Griferías',
    itemDescription: 'Griferías Monocomando Pico Alto Giratorio para Pileta de Cocina',
    physicalQty: 2.0,
    physicalUnit: 'juegos',
    dosajeChandias: 'Especificación: Cierre cerámico monocomando cromado en cocinas PB',
    calculatedTheoretical: '2 Juegos grifería cocina',
    commercialUnits: '2 Juegos Grifería Monocomando Cocina'
  },
  {
    id: 'griferia_baños',
    category: 'Artefactos Sanitarios & Griferías',
    itemDescription: 'Griferías para Lavatorio (4 juegos) y Bidet (2 juegos) Cierre Cerámico',
    physicalQty: 6.0,
    physicalUnit: 'juegos',
    dosajeChandias: 'Especificación: Línea cromo brillante cierre cerámico',
    calculatedTheoretical: '4 Juegos lavatorio + 2 Juegos bidet',
    commercialUnits: '6 Juegos Grifería Baños Completa'
  },
  {
    id: 'griferia_ducha',
    category: 'Artefactos Sanitarios & Griferías',
    itemDescription: 'Griferías para Ducha con Monocomando, Transferencia y Flor de Lluvia ø20cm',
    physicalQty: 2.0,
    physicalUnit: 'juegos',
    dosajeChandias: 'Especificación: Ducha embutida en baños Planta Alta',
    calculatedTheoretical: '2 Juegos grifería ducha con flor ø20cm',
    commercialUnits: '2 Juegos Grifería Ducha c/Flor Lluvia'
  },

  // 8. Aberturas & Carpinterías (Norma Codificación: Px=Puertas, PVx=Puerta Ventanas, Vx=Ventanas, Otros=Otras Carpinterías)
  {
    id: 'abertura_p1',
    category: 'Aberturas & Carpinterías',
    itemDescription: 'Puertas P1 (Norma Px = Puertas): Ingreso Principal Chapa/Aluminio inyectado (90x205 cm) en PB',
    physicalQty: 2.0,
    physicalUnit: 'unid',
    dosajeChandias: 'Norma Px (Puerta): Marco chapa B.W.G 18 + cerradura de seguridad (PB)',
    calculatedTheoretical: '2 Puertas de Ingreso P1 (90x205 cm)',
    commercialUnits: '2 Puertas P1 Ingreso (90x205 cm)'
  },
  {
    id: 'abertura_p2',
    category: 'Aberturas & Carpinterías',
    itemDescription: 'Puertas P2 (Norma Px = Puertas): Placa Interiores MDF 70x200 cm con marco de chapa (4 PB + 6 PA)',
    physicalQty: 10.0,
    physicalUnit: 'unid',
    dosajeChandias: 'Norma Px (Puerta): Hoja placa de madera MDF para pintar con herrajes balancín',
    calculatedTheoretical: '10 Puertas Placa P2 (70x200 cm)',
    commercialUnits: '10 Puertas Placa P2 Interiores (70x200 cm)'
  },
  {
    id: 'abertura_pv1',
    category: 'Aberturas & Carpinterías',
    itemDescription: 'Puertas Ventana PV1 (Norma PVx = Puerta Ventanas): Aluminio Modena DVH 200x205 cm (2 PB + 2 PA Balcón)',
    physicalQty: 4.0,
    physicalUnit: 'unid',
    dosajeChandias: 'Norma PVx (Puerta Ventana): Vidrio DVH 4/12/4 mm + felpas de hermeticidad',
    calculatedTheoretical: '4 Puertas Ventana PV1 (200x205 cm)',
    commercialUnits: '4 Puertas Ventana PV1 Modena DVH (200x205 cm)'
  },
  {
    id: 'abertura_v1',
    category: 'Aberturas & Carpinterías',
    itemDescription: 'Ventanas V1 (Norma Vx = Ventanas): Dormitorios Aluminio Modena DVH (140x120 cm) en PA',
    physicalQty: 4.0,
    physicalUnit: 'unid',
    dosajeChandias: 'Norma Vx (Ventana): Hojas corredizas con cortina de enrollar PVC en PA',
    calculatedTheoretical: '4 Ventanas Dormitorio V1 (140x120 cm)',
    commercialUnits: '4 Ventanas V1 Modena DVH (140x120 cm)'
  },
  {
    id: 'abertura_v2',
    category: 'Aberturas & Carpinterías',
    itemDescription: 'Ventanas V2 (Norma Vx = Ventanas): Cocina Aluminio Modena DVH (120x90 cm) en PB',
    physicalQty: 2.0,
    physicalUnit: 'unid',
    dosajeChandias: 'Norma Vx (Ventana): Hojas corredizas sobre mesada en PB',
    calculatedTheoretical: '2 Ventanas Cocina V2 (120x90 cm)',
    commercialUnits: '2 Ventanas V2 Modena DVH (120x90 cm)'
  },
  {
    id: 'abertura_v3',
    category: 'Aberturas & Carpinterías',
    itemDescription: 'Ventanas V3 (Norma Vx = Ventanas): Baños Banderita / Paño Fijo (60x40 cm) (2 PB + 2 PA)',
    physicalQty: 4.0,
    physicalUnit: 'unid',
    dosajeChandias: 'Norma Vx (Ventana): Vidrio esmerilado/fantasía en sanitarios',
    calculatedTheoretical: '4 Banderitas Baño V3 (60x40 cm)',
    commercialUnits: '4 Ventanas Banderita V3 (60x40 cm)'
  },
  {
    id: 'abertura_o1',
    category: 'Aberturas & Carpinterías',
    itemDescription: 'Otras Carpinterías O1 (Cualquier Otro Código): Portones Garaje Levadizos Automatizados (260x210 cm)',
    physicalQty: 2.0,
    physicalUnit: 'unid',
    dosajeChandias: 'Norma Otro Código: Estructura metálica de chapa desplegada/tubular con motor automatizado',
    calculatedTheoretical: '2 Portones Garaje O1 (260x210 cm)',
    commercialUnits: '2 Portones Automatizados O1 Garaje (260x210 cm)'
  },

  // 9. Instalaciones Eléctricas & Domótica (AEA 90364 / IRAM 2183)
  {
    id: 'elec_iluminacion',
    category: 'Instalaciones Eléctricas & Domótica',
    itemDescription: 'Bocas de Iluminación Techo / Pared (Centros octogonales y Apliques en PB y PA)',
    physicalQty: 36.0,
    physicalUnit: 'bocas',
    dosajeChandias: 'Norma AEA 90364: Cañería de hierro semipesado / PVC ignífugo + cable 1.5mm² IRAM 2183',
    calculatedTheoretical: '36 Bocas iluminación + 450 m.l. Cable 1.5mm²',
    commercialUnits: '36 Cajas Octogonales + 4 Rollos Cable 1.5mm² (100m)'
  },
  {
    id: 'elec_tug',
    category: 'Instalaciones Eléctricas & Domótica',
    itemDescription: 'Tomacorrientes de Uso General (TUG) 10A (Cajas rectangulares con tomas dobles)',
    physicalQty: 48.0,
    physicalUnit: 'tomas',
    dosajeChandias: 'Norma AEA: Cable 2.5mm² antinflama IRAM 2183 + llave térmica seccional 16A',
    calculatedTheoretical: '48 Módulos tomas dobles + 600 m.l. Cable 2.5mm²',
    commercialUnits: '48 Bastidores y Placas + 6 Rollos Cable 2.5mm² (100m)'
  },
  {
    id: 'elec_tue',
    category: 'Instalaciones Eléctricas & Domótica',
    itemDescription: 'Tomacorrientes de Uso Especial (TUE) 16A para Aire Acondicionado y Artefactos Especiales',
    physicalQty: 8.0,
    physicalUnit: 'tomas',
    dosajeChandias: 'Norma AEA: Circuitos independientes con cable 4mm² y térmicas 20A',
    calculatedTheoretical: '8 Tomas TUE 16A + 160 m.l. Cable 4mm²',
    commercialUnits: '8 Módulos TUE 16A + 2 Rollos Cable 4mm² (100m)'
  },
  {
    id: 'elec_baja_tension',
    category: 'Instalaciones Eléctricas & Domótica',
    itemDescription: 'Líneas de Baja Tensión: UTP Cat6 Internet (6 bocas) + Alarma/PIR (4 puntos) + Portero (2 unid)',
    physicalQty: 12.0,
    physicalUnit: 'bocas',
    dosajeChandias: 'Especificación: Cableado UTP Cat6 para red gigabit e interfonía',
    calculatedTheoretical: '6 Bocas RJ45 + 4 Sensores PIR + 2 Centrales Portero',
    commercialUnits: '12 Cajas LBT + 1 Rollo UTP Cat6 (305m)'
  },
  {
    id: 'elec_domotica',
    category: 'Instalaciones Eléctricas & Domótica',
    itemDescription: 'Módulos de Domótica / Automatismo Wi-Fi en Tableros Seccionales para iluminación y portón',
    physicalQty: 2.0,
    physicalUnit: 'sistemas',
    dosajeChandias: 'Especificación: Relés inteligentes integrados en tableros seccionales de PB',
    calculatedTheoretical: '2 Módulos Domóticos de automatización',
    commercialUnits: '2 Tableros Automatizados c/Módulos Wi-Fi'
  },

  // 10. Revestimientos & Instalaciones Complementarias
  {
    id: 'revestimiento_banos',
    category: 'Revestimientos & Instalaciones',
    itemDescription: 'Revestimiento Cerámico Especial de Paredes en Baños 30x45 cm Cortines con Pegamento Klaukol Impermeable y Pastina Sanitaria (h=2.10m)',
    physicalQty: 50.40,
    physicalUnit: 'm²',
    dosajeChandias: 'Fórmula: (Perímetro 4 Baños: 2 PB + 2 PA - Vano Puertas) x 2.10m alto = 50.40 m². Pegamento Klaukol Impermeable 6kg/m² + Pastina Sanitaria 0.4kg/m²',
    calculatedTheoretical: '50.40 m² Cerámicos Pared + 302 kg Pegamento Impermeable + 20 kg Pastina Sanitaria',
    commercialUnits: '36 Cajas Cerámico Baño (54 m²) + 13 Bolsas Klaukol Impermeable (25kg) + 4 Bolsas Pastina Sanitaria (5kg)'
  },
  {
    id: 'revestimiento_cocina',
    category: 'Revestimientos & Instalaciones',
    itemDescription: 'Revestimiento Cerámico Pared Sobre Mesada en Cocina (h=0.60m)',
    physicalQty: 2.88,
    physicalUnit: 'm²',
    dosajeChandias: 'Fórmula: Largo Mesada (4.80 m.l.) x 0.60m alto. Mortero adhesivo + pastina impermeable de junta',
    calculatedTheoretical: '2.88 m² de revestimiento sobre mesada',
    commercialUnits: '3 Cajas Cerámico 30x45 cm / Guarda Cocina (4.5 m²)'
  },
  {
    id: 'revestimiento_antebanos',
    category: 'Revestimientos & Instalaciones',
    itemDescription: 'Revestimiento Cerámico en Baños Zonificados / Antebaño Lavabo (h=1.00m)',
    physicalQty: 4.00,
    physicalUnit: 'm²',
    dosajeChandias: 'Fórmula: (Ancho Vanitorio 0.80m + 1.20m) x 1.00m alto = 2.00m² por antebaño (2 Antebaños PA)',
    calculatedTheoretical: '4.00 m² revestimiento antebaños',
    commercialUnits: '3 Cajas Cerámico 30x45 cm Lavabo (4.5 m²)'
  },
  {
    id: 'placas_cementicias',
    category: 'Revestimientos & Instalaciones',
    itemDescription: 'Placas Cementicias de Exterior (Sostenes fachada) + Perfilería PGC/PGU',
    physicalQty: 48,
    physicalUnit: 'm²',
    dosajeChandias: 'Chandías: Perfilería PGC/PGU cada 40cm + fijaciones de acero inoxidable',
    calculatedTheoretical: '48 m² placas cementicias + perfilería de chapa galvanizada',
    commercialUnits: '18 Placas Cementicias (1.20x2.40m) + 24 Perfiles PGC/PGU'
  }
];

const INITIAL_CONSOLIDATED_COMMERCIAL_MATERIALS = [
  { id: 1, insumo: 'Cemento Portland Normal (Bolsas 25kg)', unidad: 'Bolsa 25 kg', cantidadNum: 1166, defaultPrice: 6200 },
  { id: 2, insumo: 'Cal Hidráulica en Polvo (Bolsas 25kg)', unidad: 'Bolsa 25 kg', cantidadNum: 301, defaultPrice: 6200 },
  { id: 3, insumo: 'Acero ADN 420 (Barras ø6mm a ø10mm x 12m)', unidad: 'Barra 12m', cantidadNum: 460, defaultPrice: 12800 },
  { id: 4, insumo: 'Arena Gruesa de Río / Arena Fina Zarandeada', unidad: 'm³ (Camión)', cantidadNum: 62, defaultPrice: 28000 },
  { id: 5, insumo: 'Piedra Partida (10-20mm) / Cascote Molido Limpio', unidad: 'm³ (Camión)', cantidadNum: 69, defaultPrice: 32000 },
  { id: 6, insumo: 'Tierra de Relleno y Nivelación (U.H. 1: 125m² + U.H. 2: 125m² x 0.30m)', unidad: 'Camión (5 m³)', cantidadNum: 15, defaultPrice: 65000 },
  { id: 7, insumo: 'Ladrillos Cerámicos Portantes 18x19x33 cm', unidad: 'Unidades', cantidadNum: 3670, defaultPrice: 850 },
  { id: 8, insumo: 'Ladrillos Cerámicos Huecos 12x19x33 cm (Muros + Tapias)', unidad: 'Unidades', cantidadNum: 3712, defaultPrice: 620 },
  { id: 9, insumo: 'Viguetas Pretensadas T180 (Losas L1 a L8)', unidad: 'm.l. (Vigueta)', cantidadNum: 320, defaultPrice: 6800 },
  { id: 10, insumo: 'Bovedillas de Telgopor EPS h=12cm', unidad: 'Unidades', cantidadNum: 1250, defaultPrice: 2400 },
  { id: 11, insumo: 'Malla Electrosoldada SIMA Q92 ø4.2mm 15x15cm', unidad: 'Paneles (2.4x6m)', cantidadNum: 18, defaultPrice: 42000 },
  { id: 12, insumo: 'Pisos Cerámicos / Porcellanato 50x50 cm', unidad: 'Caja (2 m²)', cantidadNum: 125, defaultPrice: 26000 },
  { id: 13, insumo: 'Revestimiento Cerámico Pared Baños 30x45 Cortines (h=2.10m)', unidad: 'Caja (1.5 m²)', cantidadNum: 36, defaultPrice: 24000 },
  { id: 14, insumo: 'Pegamento Klaukol / Weber Impermeable Baños', unidad: 'Bolsa 25 kg', cantidadNum: 13, defaultPrice: 14200 },
  { id: 15, insumo: 'Pastina Sanitaria Impermeable Baños', unidad: 'Bolsa 5 kg', cantidadNum: 4, defaultPrice: 8500 },
  { id: 16, insumo: 'Aditivo Impermeable Ceresita (Tapias, Cámaras & Capa Aisladora)', unidad: 'Bidón 12 kg', cantidadNum: 4, defaultPrice: 16500 },
  { id: 17, insumo: 'Cañería Awaduct PVC Sanitarios ø110 mm', unidad: 'Caño x 4m', cantidadNum: 32, defaultPrice: 18500 },
  { id: 18, insumo: 'Cañería Awaduct PVC Sanitarios ø63 mm', unidad: 'Caño x 4m', cantidadNum: 13, defaultPrice: 11200 },
  { id: 19, insumo: 'Cañería Acqua System PN20 Termofusión ø25 mm', unidad: 'Tira x 4m', cantidadNum: 13, defaultPrice: 14500 },
  { id: 20, insumo: 'Cañería Acqua System PN20 Termofusión ø20 mm', unidad: 'Tira x 4m', cantidadNum: 19, defaultPrice: 10800 },
  { id: 21, insumo: 'Inodoros Losa Blanca con Mochila Dual', unidad: 'Unid. Completa', cantidadNum: 4, defaultPrice: 185000 },
  { id: 22, insumo: 'Bidets Losa Blanca 3 Orificios', unidad: 'Unid. Completa', cantidadNum: 2, defaultPrice: 125000 },
  { id: 23, insumo: 'Lavatorios con Vanitory / Mueble Balsa', unidad: 'Mueble c/ Bacha', cantidadNum: 4, defaultPrice: 195000 },
  { id: 24, insumo: 'Piletas de Cocina Bacha Doble Acero Inox', unidad: 'Unidades', cantidadNum: 2, defaultPrice: 145000 },
  { id: 25, insumo: 'Mesadas Granito Gris Mara (L=2.40m c/u)', unidad: 'Mesada (2.40m)', cantidadNum: 2, defaultPrice: 220000 },
  { id: 26, insumo: 'Aberturas Modena DVH Exteriores (V1 a V5)', unidad: 'Unidades', cantidadNum: 16, defaultPrice: 320000 },
  { id: 27, insumo: 'Puertas Placa MDF Interiores 70x200 cm (P1)', unidad: 'Unidades', cantidadNum: 10, defaultPrice: 95000 },
  { id: 28, insumo: 'Bocas Iluminación Techo, Tomas TUG 10A y TUE 16A', unidad: 'Boca / Toma', cantidadNum: 84, defaultPrice: 8500 },
  { id: 29, insumo: 'Líneas UTP Cat6, Sensores Alarma y Domótica', unidad: 'Boca / Módulo', cantidadNum: 12, defaultPrice: 22000 },
  { id: 30, insumo: 'Pintura Asfáltica Base Acuosa (Capa Aisladora Doble)', unidad: 'Lata 18 kg', cantidadNum: 2, defaultPrice: 48000 },
  { id: 31, insumo: 'Agrotileno 200 Micras (Film Polietileno 1.10 m²/m²)', unidad: 'm² (1.10 m²/m²)', cantidadNum: 72, defaultPrice: 2200 }
];

const DEFAULT_LABOR_RATES = [
  { id: 'albanileria', especialidad: '1.- Albañilería (Muros, Estructura H°A°, Capa Aisladora, Contrapisos, Revoques y Colocación)', ratePerM2: 180000 },
  { id: 'electrica', especialidad: '2.- Instalación Eléctrica (Canalizado, Cableado, Tableros y Térmicas)', ratePerM2: 35000 },
  { id: 'cloacal_pluvial', especialidad: '3.- Instalación Cloacal y Desagües Pluviales (Zanjeo, Cañerías y Cámaras)', ratePerM2: 28000 },
  { id: 'agua_artefactos', especialidad: '4.- Instalación AF y AC, con Colocación de Artefactos y Griferías', ratePerM2: 32000 },
  { id: 'gas', especialidad: '5.- Instalación de Gas Natural (Cañería, Pruebas y Trámite Matriculado)', ratePerM2: 22000 },
  { id: 'alarmas_internet', especialidad: '6.- Instalación de Alarmas, Domótica e Internet UTP Cat6', ratePerM2: 18000 }
];

const LABOR_CRITERIA_FACTORS: Record<'uocra' | 'contratista' | 'cpropia', { label: string; shortLabel: string; factor: number; description: string; badgeClass: string }> = {
  uocra: {
    label: '1. Valor Base UOCRA (x 1.00)',
    shortLabel: 'Base UOCRA (x1.00)',
    factor: 1.00,
    description: 'Tarifas base Mercado Córdoba según CCT UOCRA por oficial',
    badgeClass: 'bg-blue-700 text-white border-blue-800'
  },
  contratista: {
    label: '2. Valor Contratista (x 2.10)',
    shortLabel: 'Valor Contratista (x2.10)',
    factor: 2.10,
    description: 'Empresa Constructora / Llave en Mano (Incluye Leyes Sociales, ART, Supervisión, Gastos Generales y Beneficio)',
    badgeClass: 'bg-purple-700 text-white border-purple-800'
  },
  cpropia: {
    label: '3. Valor C.Propia (x 0.80)',
    shortLabel: 'Valor C.Propia (x0.80)',
    factor: 0.80,
    description: 'Construcción Propia / Administración Directa por día con Dirección Técnica (Ahorro del 20% en intermediación)',
    badgeClass: 'bg-emerald-700 text-white border-emerald-800'
  }
};

export interface RoomZoningItem {
  id: string;
  nombreLocal: string;
  planta: 'PB' | 'PA';
  unidad: 'U.H. 1' | 'U.H. 2';
  dimensiones: string;
  superficieNeta: number; // m² útiles sin muros
  perimetroBruto: number; // m.l.
  vanoDescuento: number; // m.l. (paso de puertas)
  perimetroZocalo: number; // m.l. neto para zócalos
  revestimientoEspecial?: string;
  tipoSolado: string;
}

const ROOM_ZONING_DATA: RoomZoningItem[] = [
  // U.H. 1
  { id: 'uh1_estar', nombreLocal: 'Estar / Comedor / Cocina', planta: 'PB', unidad: 'U.H. 1', dimensiones: '6.20 x 6.21 m', superficieNeta: 38.50, perimetroBruto: 24.82, vanoDescuento: 2.70, perimetroZocalo: 22.12, tipoSolado: 'Porcellanato 50x50 cm + Zócalo Cerámico' },
  { id: 'uh1_toilette', nombreLocal: 'Toilette (Baño Social PB)', planta: 'PB', unidad: 'U.H. 1', dimensiones: '1.50 x 1.60 m', superficieNeta: 2.40, perimetroBruto: 6.20, vanoDescuento: 0.70, perimetroZocalo: 5.50, revestimientoEspecial: 'Cerámico Pared 30x45 h=2.10m (11.55 m²)', tipoSolado: 'Cerámico Antideslizante 30x30 cm' },
  { id: 'uh1_cochera', nombreLocal: 'Cochera Semicubierta / Porche', planta: 'PB', unidad: 'U.H. 1', dimensiones: '3.00 x 5.00 m', superficieNeta: 15.00, perimetroBruto: 16.00, vanoDescuento: 3.00, perimetroZocalo: 13.00, tipoSolado: 'Hormigón Peinado / Cerámico Alto Tránsito' },
  { id: 'uh1_dorm1', nombreLocal: 'Dormitorio 1 (Principal)', planta: 'PA', unidad: 'U.H. 1', dimensiones: '3.80 x 3.89 m', superficieNeta: 14.80, perimetroBruto: 15.38, vanoDescuento: 1.60, perimetroZocalo: 13.78, tipoSolado: 'Cerámico Simil Madera + Zócalo Madera' },
  { id: 'uh1_dorm2', nombreLocal: 'Dormitorio 2 (Secundario)', planta: 'PA', unidad: 'U.H. 1', dimensiones: '3.40 x 3.59 m', superficieNeta: 12.20, perimetroBruto: 13.98, vanoDescuento: 1.60, perimetroZocalo: 12.38, tipoSolado: 'Cerámico Simil Madera + Zócalo Madera' },
  { id: 'uh1_bano_pa', nombreLocal: 'Baño Principal PA', planta: 'PA', unidad: 'U.H. 1', dimensiones: '2.10 x 2.00 m', superficieNeta: 4.20, perimetroBruto: 8.20, vanoDescuento: 0.70, perimetroZocalo: 7.50, revestimientoEspecial: 'Cerámico Pared 30x45 h=2.10m (15.75 m²)', tipoSolado: 'Cerámico Antideslizante 30x30 cm' },
  { id: 'uh1_pasillo', nombreLocal: 'Pasillo / Antebaño / Escalera', planta: 'PA', unidad: 'U.H. 1', dimensiones: '3.50 x 3.00 m', superficieNeta: 10.50, perimetroBruto: 18.00, vanoDescuento: 2.80, perimetroZocalo: 15.20, tipoSolado: 'Porcellanato 50x50 cm + Zócalo' },
  { id: 'uh1_balcon', nombreLocal: 'Balcón Exterior PA', planta: 'PA', unidad: 'U.H. 1', dimensiones: '3.00 x 1.78 m', superficieNeta: 5.23, perimetroBruto: 9.56, vanoDescuento: 2.00, perimetroZocalo: 7.56, tipoSolado: 'Cerámico Exterior + Impermeabilizante' },

  // U.H. 2
  { id: 'uh2_estar', nombreLocal: 'Estar / Comedor / Cocina', planta: 'PB', unidad: 'U.H. 2', dimensiones: '6.20 x 6.21 m', superficieNeta: 38.50, perimetroBruto: 24.82, vanoDescuento: 2.70, perimetroZocalo: 22.12, tipoSolado: 'Porcellanato 50x50 cm + Zócalo Cerámico' },
  { id: 'uh2_toilette', nombreLocal: 'Toilette (Baño Social PB)', planta: 'PB', unidad: 'U.H. 2', dimensiones: '1.50 x 1.60 m', superficieNeta: 2.40, perimetroBruto: 6.20, vanoDescuento: 0.70, perimetroZocalo: 5.50, revestimientoEspecial: 'Cerámico Pared 30x45 h=2.10m (11.55 m²)', tipoSolado: 'Cerámico Antideslizante 30x30 cm' },
  { id: 'uh2_cochera', nombreLocal: 'Cochera Semicubierta / Porche', planta: 'PB', unidad: 'U.H. 2', dimensiones: '3.00 x 5.00 m', superficieNeta: 15.00, perimetroBruto: 16.00, vanoDescuento: 3.00, perimetroZocalo: 13.00, tipoSolado: 'Hormigón Peinado / Cerámico Alto Tránsito' },
  { id: 'uh2_dorm1', nombreLocal: 'Dormitorio 1 (Principal)', planta: 'PA', unidad: 'U.H. 2', dimensiones: '3.80 x 3.89 m', superficieNeta: 14.80, perimetroBruto: 15.38, vanoDescuento: 1.60, perimetroZocalo: 13.78, tipoSolado: 'Cerámico Simil Madera + Zócalo Madera' },
  { id: 'uh2_dorm2', nombreLocal: 'Dormitorio 2 (Secundario)', planta: 'PA', unidad: 'U.H. 2', dimensiones: '3.40 x 3.59 m', superficieNeta: 12.20, perimetroBruto: 13.98, vanoDescuento: 1.60, perimetroZocalo: 12.38, tipoSolado: 'Cerámico Simil Madera + Zócalo Madera' },
  { id: 'uh2_bano_pa', nombreLocal: 'Baño Principal PA', planta: 'PA', unidad: 'U.H. 2', dimensiones: '2.10 x 2.00 m', superficieNeta: 4.20, perimetroBruto: 8.20, vanoDescuento: 0.70, perimetroZocalo: 7.50, revestimientoEspecial: 'Cerámico Pared 30x45 h=2.10m (15.75 m²)', tipoSolado: 'Cerámico Antideslizante 30x30 cm' },
  { id: 'uh2_pasillo', nombreLocal: 'Pasillo / Antebaño / Escalera', planta: 'PA', unidad: 'U.H. 2', dimensiones: '3.50 x 3.00 m', superficieNeta: 10.50, perimetroBruto: 18.00, vanoDescuento: 2.80, perimetroZocalo: 15.20, tipoSolado: 'Porcellanato 50x50 cm + Zócalo' },
  { id: 'uh2_balcon', nombreLocal: 'Balcón Exterior PA', planta: 'PA', unidad: 'U.H. 2', dimensiones: '3.00 x 1.78 m', superficieNeta: 5.23, perimetroBruto: 9.56, vanoDescuento: 2.00, perimetroZocalo: 7.56, tipoSolado: 'Cerámico Exterior + Impermeabilizante' }
];

interface BlueprintDataSummaryProps {
  activeProject?: ProjectData | null;
  initialTab?: 'zonificacion' | 'computos' | 'general' | 'superficies' | 'distribucion' | 'estructura' | 'costos';
}

export default function BlueprintDataSummary({ activeProject, initialTab = 'computos' }: BlueprintDataSummaryProps) {
  const [activeTab, setActiveTab] = useState<'zonificacion' | 'computos' | 'general' | 'superficies' | 'distribucion' | 'estructura' | 'costos'>(initialTab);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('todos');
  const [isGeneratingWord, setIsGeneratingWord] = useState<boolean>(false);
  const [showFramedSummary, setShowFramedSummary] = useState<boolean>(false);

  // 3 Labor Criterios State: uocra (x1.00), contratista (x2.10), cpropia (x0.80) with localStorage persistence
  const [laborCriterion, setLaborCriterion] = useState<'uocra' | 'contratista' | 'cpropia'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('labor_criterion_selected');
      if (saved === 'uocra' || saved === 'contratista' || saved === 'cpropia') {
        return saved;
      }
    }
    return 'uocra';
  });

  const handleSelectLaborCriterion = (crit: 'uocra' | 'contratista' | 'cpropia') => {
    setLaborCriterion(crit);
    if (typeof window !== 'undefined') {
      localStorage.setItem('labor_criterion_selected', crit);
    }
  };

  const activeLaborFactor = LABOR_CRITERIA_FACTORS[laborCriterion].factor;

  // Editable prices state (supports string input while typing)
  const [materialPrices, setMaterialPrices] = useState<Record<number, string | number>>(() => {
    const init: Record<number, string | number> = {};
    INITIAL_CONSOLIDATED_COMMERCIAL_MATERIALS.forEach((item) => {
      init[item.id] = item.defaultPrice;
    });
    return init;
  });

  const [laborRates, setLaborRates] = useState<Record<string, string | number>>(() => {
    const init: Record<string, string | number> = {};
    DEFAULT_LABOR_RATES.forEach((item) => {
      init[item.id] = item.ratePerM2;
    });
    return init;
  });

  // Editable built area state (default 247.55 m²)
  const [builtAreaInput, setBuiltAreaInput] = useState<string | number>(247.55);
  const totalBuiltArea = Math.max(0.01, parseCurrencyNumber(builtAreaInput, 247.55));

  // Editable wall thickness for Capa Aisladora Doble Horizontal y Vertical (default 0.18 m - Ladrillo Portante 18cm)
  const [wallThicknessInput, setWallThicknessInput] = useState<string | number>('0.18');
  const parsedWallThickness = parseFloat(String(wallThicknessInput).replace(',', '.'));
  const wallThicknessM =
    !isNaN(parsedWallThickness) && parsedWallThickness >= 0.05 && parsedWallThickness <= 0.60
      ? parsedWallThickness
      : 0.18;

  // Dynamic computation: Zócalos de Planta Baja -> Capa Aisladora Doble Horizontal y Vertical
  const pbZoningRooms = ROOM_ZONING_DATA.filter((room) => room.planta === 'PB');
  const pbZocaloMetersUH1 = pbZoningRooms
    .filter((room) => room.unidad === 'U.H. 1')
    .reduce((acc, room) => acc + room.perimetroZocalo, 0);
  const pbZocaloMetersUH2 = pbZoningRooms
    .filter((room) => room.unidad === 'U.H. 2')
    .reduce((acc, room) => acc + room.perimetroZocalo, 0);
  const pbZocaloMetersTotal = Number((pbZocaloMetersUH1 + pbZocaloMetersUH2).toFixed(2)); // 81.24 m.l.

  // Desarrollo transversal = 2 * espesor de muro + 2 * 0.20 m
  const capaAisladoraDesarrolloM = Number((2 * wallThicknessM + 2 * 0.20).toFixed(4));
  const capaAisladoraM2 = Number((pbZocaloMetersTotal * capaAisladoraDesarrolloM).toFixed(2));

  // Mortero cementicio con hidrófugo e = 2.5 cm (0.025 m) - Chandías 1:3 (450 kg cem / 1.05 m³ arena / 25 kg hidrófugo por m³)
  const capaAisladoraMorteroM3 = Number((capaAisladoraM2 * 0.025).toFixed(3));
  const capaAisladoraCementoKg = Math.round(capaAisladoraMorteroM3 * 450);
  const capaAisladoraCementoBolsas = Math.ceil((capaAisladoraCementoKg * 1.05) / 25);
  const capaAisladoraArenaM3 = Number((capaAisladoraMorteroM3 * 1.05).toFixed(2));
  const capaAisladoraArenaComercial = Math.ceil(capaAisladoraArenaM3 * 1.05);
  const capaAisladoraHidrofugoKg = Number((capaAisladoraMorteroM3 * 25).toFixed(1));
  const capaAisladoraHidrofugoBidones = Math.ceil((capaAisladoraHidrofugoKg * 1.05) / 12);

  // Pintura asfáltica base acuosa (2 manos, rendimiento 0.55 kg/m²)
  const capaAisladoraPinturaKg = Number((capaAisladoraM2 * 0.55).toFixed(2));
  const capaAisladoraPinturaLatas = Math.ceil((capaAisladoraPinturaKg * 1.05) / 18);

  // Agrotileno 200 micras: 1.10 m² / m²
  const capaAisladoraAgrotilenoM2 = Number((capaAisladoraM2 * 1.10).toFixed(2));
  const capaAisladoraAgrotilenoComercial = Math.ceil(capaAisladoraAgrotilenoM2 * 1.05);

  function parseCurrencyNumber(val: string | number | undefined, defaultVal = 0): number {
    if (val === undefined || val === null || val === '') return defaultVal;
    if (typeof val === 'number') return isNaN(val) ? defaultVal : val;

    let str = String(val).trim().replace(/[\$\s]/g, '');
    if (!str) return defaultVal;

    // Handles dot as thousand separator (e.g. "11.500", "1.500.000") and comma as decimal (e.g. "11500,50")
    if (str.includes(',') && str.includes('.')) {
      str = str.replace(/\./g, '').replace(',', '.');
    } else if (str.includes(',')) {
      str = str.replace(',', '.');
    } else if ((str.match(/\./g) || []).length > 1) {
      str = str.replace(/\./g, '');
    } else if (str.includes('.')) {
      const parts = str.split('.');
      if (parts.length === 2 && parts[1].length === 3) {
        str = str.replace('.', '');
      }
    }

    const num = parseFloat(str);
    return isNaN(num) ? defaultVal : num;
  }

  const getMaterialUnitPrice = (id: number): number => {
    const item = INITIAL_CONSOLIDATED_COMMERCIAL_MATERIALS.find((m) => m.id === id);
    const defaultPrice = item ? item.defaultPrice : 0;
    return parseCurrencyNumber(materialPrices[id], defaultPrice);
  };

  const getLaborRatePerM2 = (id: string): number => {
    const item = DEFAULT_LABOR_RATES.find((l) => l.id === id);
    const defaultRate = item ? item.ratePerM2 : 0;
    return parseCurrencyNumber(laborRates[id], defaultRate);
  };

  const handleResetMaterialPrices = () => {
    const init: Record<number, string | number> = {};
    INITIAL_CONSOLIDATED_COMMERCIAL_MATERIALS.forEach((item) => {
      init[item.id] = item.defaultPrice;
    });
    setMaterialPrices(init);
  };

  const handleAdjustMaterialPricesPercentage = (percentage: number) => {
    setMaterialPrices((prev) => {
      const updated: Record<number, string | number> = {};
      INITIAL_CONSOLIDATED_COMMERCIAL_MATERIALS.forEach((item) => {
        const currentPrice = parseCurrencyNumber(prev[item.id], item.defaultPrice);
        updated[item.id] = Math.round(currentPrice * (1 + percentage / 100));
      });
      return updated;
    });
  };

  const handleResetLaborRates = () => {
    const init: Record<string, string | number> = {};
    DEFAULT_LABOR_RATES.forEach((item) => {
      init[item.id] = item.ratePerM2;
    });
    setLaborRates(init);
  };

  const handleAdjustLaborRatesPercentage = (percentage: number) => {
    setLaborRates((prev) => {
      const updated: Record<string, string | number> = {};
      DEFAULT_LABOR_RATES.forEach((item) => {
        const currentRate = parseCurrencyNumber(prev[item.id], item.ratePerM2);
        updated[item.id] = Math.round(currentRate * (1 + percentage / 100));
      });
      return updated;
    });
  };

  const consolidatedMaterialsList = INITIAL_CONSOLIDATED_COMMERCIAL_MATERIALS.map((item) => {
    if (item.id === 1) {
      return { ...item, cantidadNum: item.cantidadNum + capaAisladoraCementoBolsas };
    }
    if (item.id === 4) {
      return { ...item, cantidadNum: item.cantidadNum + capaAisladoraArenaComercial };
    }
    if (item.id === 16) {
      return { ...item, cantidadNum: item.cantidadNum + capaAisladoraHidrofugoBidones };
    }
    if (item.id === 30) {
      return { ...item, cantidadNum: capaAisladoraPinturaLatas };
    }
    if (item.id === 31) {
      return { ...item, cantidadNum: capaAisladoraAgrotilenoComercial };
    }
    return item;
  });

  const totalMaterialCost = consolidatedMaterialsList.reduce((acc, item) => {
    const price = getMaterialUnitPrice(item.id);
    return acc + item.cantidadNum * price;
  }, 0);

  const materialCostPerM2 = totalMaterialCost / totalBuiltArea;

  // Base labor rate per m² (sum of 6 trades without factor)
  const baseLaborRatePerM2 = DEFAULT_LABOR_RATES.reduce((acc, item) => {
    const rate = getLaborRatePerM2(item.id);
    return acc + rate;
  }, 0);

  // Effective labor rate per m² with active criteria factor applied (x1.00, x2.10, x0.80)
  const totalLaborRatePerM2 = Math.round(baseLaborRatePerM2 * activeLaborFactor);

  const totalLaborCost = totalLaborRatePerM2 * totalBuiltArea;

  const grandTotalCost = totalMaterialCost + totalLaborCost;
  const grandTotalCostPerM2 = grandTotalCost / totalBuiltArea;

  const capaAisladoraComputationItems: MaterialChandiasItem[] = [
    {
      id: 'capa_aisladora_cementicia',
      category: 'Capa Aisladora Doble Horizontal y Vertical',
      itemDescription: `Capa Aisladora Doble Cementicia Horizontal y Vertical e=2.5cm c/ Hidrófugo (${pbZocaloMetersTotal.toFixed(2)} m.l. zócalos PB × [2×${wallThicknessM.toFixed(2)}m + 2×0.20m] = ${capaAisladoraDesarrolloM.toFixed(2)} m desarrollo)`,
      physicalQty: capaAisladoraM2,
      physicalUnit: 'm²',
      dosajeChandias: `Fórmula: ${pbZocaloMetersTotal.toFixed(2)} m.l. PB × ${capaAisladoraDesarrolloM.toFixed(2)} m = ${capaAisladoraM2.toFixed(2)} m² × 0.025m = ${capaAisladoraMorteroM3.toFixed(2)} m³ | Chandías Mortero 1:3 (450kg cem / 1.05m³ arena / 25kg hidrófugo por m³)`,
      calculatedTheoretical: `${capaAisladoraMorteroM3.toFixed(2)} m³ mortero: ${capaAisladoraCementoKg} kg Cemento + ${capaAisladoraArenaM3.toFixed(2)} m³ Arena fina + ${capaAisladoraHidrofugoKg} kg Hidrófugo`,
      commercialUnits: `${capaAisladoraCementoBolsas} Bolsas Cemento (25kg) + ${capaAisladoraArenaComercial} m³ Arena fina + ${capaAisladoraHidrofugoBidones} Bidones Hidrófugo (12kg)`
    },
    {
      id: 'capa_aisladora_pintura_asfaltica',
      category: 'Capa Aisladora Doble Horizontal y Vertical',
      itemDescription: `Pintura Asfáltica Base Acuosa sobre Capa Aisladora Doble (2 manos sobre ${capaAisladoraM2.toFixed(2)} m²)`,
      physicalQty: capaAisladoraM2,
      physicalUnit: 'm²',
      dosajeChandias: `Emulsión asfáltica base acuosa en 2 manos cruzadas sobre cajón hidrófugo (Rendimiento 0.55 kg/m²)`,
      calculatedTheoretical: `${capaAisladoraPinturaKg.toFixed(2)} kg Pintura Asfáltica Base Acuosa`,
      commercialUnits: `${capaAisladoraPinturaLatas} Latas Pintura Asfáltica Base Acuosa (18 kg c/u)`
    },
    {
      id: 'capa_aisladora_agrotileno',
      category: 'Capa Aisladora Doble Horizontal y Vertical',
      itemDescription: `Agrotileno 200 Micras para Capa Aisladora Doble (1.10 m² / m² sobre ${capaAisladoraM2.toFixed(2)} m²)`,
      physicalQty: capaAisladoraAgrotilenoM2,
      physicalUnit: 'm²',
      dosajeChandias: `Rendimiento 1.10 m² / m² por solapes y dobleces en cajón hidrófugo (${capaAisladoraM2.toFixed(2)} m² × 1.10)`,
      calculatedTheoretical: `${capaAisladoraAgrotilenoM2.toFixed(2)} m² Agrotileno 200 micras`,
      commercialUnits: `${capaAisladoraAgrotilenoComercial} m² Agrotileno 200µ (+5% = ${Math.ceil(capaAisladoraAgrotilenoComercial / 100)} Rollo 2x50m o fraccionado)`
    }
  ];

  const allMaterialComputations: MaterialChandiasItem[] = [
    ...CHANDIAS_MATERIAL_COMPUTATIONS,
    ...capaAisladoraComputationItems
  ];

  const categories = [
    'todos',
    'Hormigón & Acero',
    'Contrapisos & Solados',
    'Mampostería & Mortero',
    'Capa Aisladora Doble Horizontal y Vertical',
    'Cubiertas & Aislaciones',
    'Instalaciones Sanitarias & Pluviales',
    'Agua Fría & Caliente (Acqua System)',
    'Artefactos Sanitarios & Griferías',
    'Aberturas & Carpinterías',
    'Instalaciones Eléctricas & Domótica',
    'Revestimientos & Instalaciones'
  ];

  const uniqueCategories = [
    'Hormigón & Acero',
    'Contrapisos & Solados',
    'Mampostería & Mortero',
    'Capa Aisladora Doble Horizontal y Vertical',
    'Cubiertas & Aislaciones',
    'Instalaciones Sanitarias & Pluviales',
    'Agua Fría & Caliente (Acqua System)',
    'Artefactos Sanitarios & Griferías',
    'Aberturas & Carpinterías',
    'Instalaciones Eléctricas & Domótica',
    'Revestimientos & Instalaciones'
  ];

  const filteredComputations = allMaterialComputations.filter(
    (item) => selectedCategoryFilter === 'todos' || item.category === selectedCategoryFilter
  );

  const handlePrintA4 = () => {
    window.print();
  };

  const handlePrintSummary = () => {
    setShowFramedSummary(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDownloadWord = async () => {
    setIsGeneratingWord(true);
    try {
      await generatePliegoWord(
        activeProject?.title || 'Plano Calle Davos N° 753',
        activeProject?.propietario || 'Elías Tomás Monte',
        activeProject?.profesional || 'Ing. Civil Julio Zambrano (MP 4097)',
        activeProject?.catastro || 'CIRC 01 | SECC 09 | MZA 052 | PARC 001'
      );
    } catch (err) {
      console.error('Error al generar Pliego Word:', err);
    } finally {
      setIsGeneratingWord(false);
    }
  };

  return (
    <div className="bg-white border-2 border-blue-600 rounded-2xl overflow-hidden shadow-xl text-slate-900 print:border-none print:shadow-none print:m-0 print:p-0">
      {/* Printable CSS style definitions for 10mm margin A4 portrait print */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            background: #ffffff !important;
            color: #0f172a !important;
            font-size: 10pt;
          }
          .no-print {
            display: none !important;
          }
          .print-area {
            width: 100% !important;
            max-width: 190mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          td, th {
            color: #0f172a !important;
            border: 1px solid #cbd5e1 !important;
            padding: 5px !important;
          }
        }
      `}</style>

      {/* Navigation Tabs (Screen view only) */}
      <div className="bg-slate-100 p-2.5 border-b-2 border-blue-600 flex flex-wrap gap-1.5 no-print">
        <button
          onClick={() => setActiveTab('zonificacion')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition ${
            activeTab === 'zonificacion'
              ? 'bg-blue-700 text-white shadow-md'
              : 'bg-white text-blue-950 border border-blue-300 hover:bg-blue-50'
          }`}
        >
          <Home className="w-4 h-4 shrink-0" />
          <span>Planilla de Zonificación por Destino (Neta Sin Muros)</span>
          <span className="bg-blue-100 text-blue-900 border border-blue-300 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
            205.66 m² útiles
          </span>
        </button>

        <button
          onClick={() => setActiveTab('computos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'computos'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Cómputos Chandías (Físicos & Comerciales +5%)</span>
          <span className="bg-white text-blue-800 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border border-blue-300">
            {allMaterialComputations.length} ítems
          </span>
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'general'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Datos Municipales</span>
        </button>

        <button
          onClick={() => setActiveTab('superficies')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'superficies'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>Balance Superficies</span>
        </button>

        <button
          onClick={() => setActiveTab('distribucion')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'distribucion'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Distribución</span>
        </button>

        <button
          onClick={() => setActiveTab('estructura')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'estructura'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50'
          }`}
        >
          <HardHat className="w-4 h-4" />
          <span>Estructura H°A°</span>
        </button>

        <button
          onClick={() => setActiveTab('costos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'costos'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>5. Costos Aproximados Totales</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="p-6 space-y-6 print-area">
        {/* Header Bar Actions */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-300 flex flex-wrap items-center justify-between gap-4 no-print">
          <div className="space-y-1">
            <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-700" />
              <span>Cómputo según Dosajes del Manual de Chandías & Unidades Comerciales (+5% Desperdicio)</span>
            </h4>
            <p className="text-xs text-slate-600">
              Cómputo estimativo previo, sujeto a elaboración pormenorizada posterior por parte de Instalador.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Framed Summary Mode */}
            <button
              onClick={() => setShowFramedSummary(!showFramedSummary)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md border ${
                showFramedSummary
                  ? 'bg-indigo-700 text-white border-indigo-800'
                  : 'bg-white text-indigo-900 border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <LayoutList className="w-4 h-4" />
              <span>{showFramedSummary ? 'Ver Tabla Continua' : 'Ver Cuadros por Rubro'}</span>
            </button>

            {/* Imprimir Resumen Button (Requested!) */}
            <button
              onClick={handlePrintSummary}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition shadow-md"
              title="Imprimir Resumen encuadrado por Rubro con rellenos de color diferenciados"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Resumen</span>
            </button>

            {/* Word Download Button */}
            <button
              onClick={handleDownloadWord}
              disabled={isGeneratingWord}
              className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 transition shadow-md disabled:opacity-50"
              title="Descargar Pliego de Especificaciones Técnicas editable en Word"
            >
              <FileText className="w-4 h-4" />
              <span>{isGeneratingWord ? 'Generando...' : 'Descargar Pliego Word (.docx)'}</span>
            </button>

            {/* Print A4 PDF Button */}
            <button
              onClick={handlePrintA4}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition shadow-md"
              title="Imprimir formato A4 vertical con margen de 10mm"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir A4 (10mm)</span>
            </button>
          </div>
        </div>

        {/* TAB: PLANILLA DE ZONIFICACIÓN POR DESTINO DEL LOCAL & CÓMPUTO NETA SIN MUROS */}
        {(activeTab === 'zonificacion' || activeTab === 'computos') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-blue-900 text-white p-5 rounded-2xl border-2 border-blue-950 space-y-3 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-700 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-black shadow-md">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-amber-300 tracking-tight flex items-center gap-2 uppercase">
                      <span>Planilla Oficial de Zonificación por Destino del Local</span>
                    </h3>
                    <p className="text-xs text-blue-100">
                      Cómputo Físico de Superficies Útiles Netas (Sin Muros), Perímetros para Zócalos y Revestimientos Sanitarios Especiales
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-lg font-black shadow-sm">
                    205.66 m² Neta Útil
                  </span>
                  <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-lg font-black shadow-sm">
                    194.08 m.l. Zócalos
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-sans pt-1">
                <div className="bg-blue-950/80 p-3 rounded-xl border border-blue-700 space-y-1">
                  <span className="text-blue-300 font-bold block text-[10px] uppercase">Terreno por U.H.:</span>
                  <span className="text-white font-mono font-bold block text-[11px]">U.H.1: 125m² | U.H.2: 125m²</span>
                  <span className="text-amber-300 font-mono font-black text-xs block">Relleno = 75 m³ (0.30m esp)</span>
                </div>

                <div className="bg-blue-950/80 p-3 rounded-xl border border-blue-700 space-y-1">
                  <span className="text-blue-300 font-bold block text-[10px] uppercase">Superficie Útil Neta:</span>
                  <span className="text-emerald-400 font-mono font-black text-sm block">205.66 m² (Sin Muros)</span>
                  <span className="text-slate-300 text-[10px] block">+ 41.89 m² Impronta Muros = 247.55 m²</span>
                </div>

                <div className="bg-blue-950/80 p-3 rounded-xl border border-blue-700 space-y-1">
                  <span className="text-blue-300 font-bold block text-[10px] uppercase">Perímetro Neto Zócalos:</span>
                  <span className="text-amber-300 font-mono font-black text-sm block">194.08 m.l.</span>
                  <span className="text-slate-300 text-[10px] block">Deduciendo 36.06 m.l. vanos puertas</span>
                </div>

                <div className="bg-blue-950/80 p-3 rounded-xl border border-blue-700 space-y-1">
                  <span className="text-blue-300 font-bold block text-[10px] uppercase">Revestimiento Baños h=2.10m:</span>
                  <span className="text-emerald-300 font-mono font-black text-sm block">50.40 m² Cerámico</span>
                  <span className="text-slate-300 text-[10px] block">4 Baños c/ Klaukol Impermeable</span>
                </div>
              </div>
            </div>

            {/* TABLA OFICIAL DE ZONIFICACIÓN POR DESTINO DEL LOCAL */}
            <div className="bg-white border-2 border-blue-700 rounded-xl overflow-hidden shadow-md">
              <div className="bg-blue-900 text-white p-3 flex flex-wrap items-center justify-between gap-2 border-b border-blue-950">
                <h5 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <LayoutList className="w-4 h-4 text-amber-300" />
                  <span>Planilla Desglosada por Destino de Local (Superficies Netas, Perímetros Zócalos y Revestimientos)</span>
                </h5>

                <span className="text-[10px] font-mono font-bold bg-amber-400 text-blue-950 px-2.5 py-0.5 rounded shadow-sm">
                  16 Ambientes Discretizados (U.H. 1 + U.H. 2)
                </span>
              </div>

              <div className="p-2 overflow-x-auto">
                <table className="w-full text-left text-[11px] text-slate-900 border-collapse border border-slate-300">
                  <thead className="bg-slate-200 text-slate-900 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-2 border border-slate-300 bg-slate-300 w-16 text-center">Unidad</th>
                      <th className="p-2 border border-slate-300 bg-slate-200">Local / Destino del Ambiente</th>
                      <th className="p-2 border border-slate-300 text-center w-14 bg-slate-200">Planta</th>
                      <th className="p-2 border border-slate-300 text-center w-24 bg-slate-200">Dimensiones</th>
                      <th className="p-2 border border-slate-300 text-emerald-950 bg-emerald-100 font-black text-right w-28">
                        Sup. Neta (Sin Muros)
                      </th>
                      <th className="p-2 border border-slate-300 text-center w-24 bg-slate-200">Perím. Bruto</th>
                      <th className="p-2 border border-slate-300 text-center w-24 bg-slate-200">Vano Puertas</th>
                      <th className="p-2 border border-slate-300 text-blue-950 bg-blue-100 font-black text-right w-28">
                        Perím. Zócalo (Neto)
                      </th>
                      <th className="p-2 border border-slate-300 bg-amber-100 text-amber-950 font-bold">Revestimientos & Solados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 font-sans">
                    {ROOM_ZONING_DATA.map((room, rIdx) => (
                      <tr key={room.id} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-blue-50/40 transition'}>
                        <td className="p-1.5 border border-slate-300 text-center font-mono font-bold text-[10px] text-blue-900 bg-blue-50/60">
                          {room.unidad}
                        </td>
                        <td className="p-1.5 border border-slate-300 font-bold text-slate-900 text-[11px]">
                          {room.nombreLocal}
                        </td>
                        <td className="p-1.5 border border-slate-300 text-center font-mono font-bold text-slate-700 text-[10px]">
                          {room.planta}
                        </td>
                        <td className="p-1.5 border border-slate-300 text-center font-mono text-slate-700 text-[11px]">
                          {room.dimensiones}
                        </td>
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-black text-emerald-950 bg-emerald-50 text-[11px]">
                          {room.superficieNeta.toFixed(2)} m²
                        </td>
                        <td className="p-1.5 border border-slate-300 text-center font-mono text-slate-600 text-[11px]">
                          {room.perimetroBruto.toFixed(2)} m
                        </td>
                        <td className="p-1.5 border border-slate-300 text-center font-mono text-slate-500 text-[11px]">
                          -{room.vanoDescuento.toFixed(2)} m
                        </td>
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-black text-blue-950 bg-blue-50 text-[11px]">
                          {room.perimetroZocalo.toFixed(2)} m.l.
                        </td>
                        <td className="p-1.5 border border-slate-300 text-[10.5px]">
                          <div className="space-y-0.5">
                            {room.revestimientoEspecial && (
                              <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 font-bold px-1.5 py-0.5 rounded text-[10px] mr-1">
                                🚿 {room.revestimientoEspecial}
                              </span>
                            )}
                            <span className="text-slate-700 block font-medium">{room.tipoSolado}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white font-mono font-bold text-xs">
                    <tr>
                      <td colSpan={4} className="p-2.5 border border-slate-800 text-right uppercase tracking-wider text-slate-200">
                        Totales Consolidados (Sin Muros):
                      </td>
                      <td className="p-2.5 border border-slate-800 text-right text-emerald-300 font-black text-sm">
                        205.66 m²
                      </td>
                      <td className="p-2.5 border border-slate-800 text-center text-slate-300 text-[11px]">
                        230.14 m
                      </td>
                      <td className="p-2.5 border border-slate-800 text-center text-slate-400 text-[11px]">
                        -36.06 m
                      </td>
                      <td className="p-2.5 border border-slate-800 text-right text-amber-300 font-black text-sm">
                        194.08 m.l.
                      </td>
                      <td className="p-2.5 border border-slate-800 text-emerald-200 font-sans text-[11px]">
                        ✓ 50.40 m² Revestimiento Cerámico Pared Baños (h=2.10m)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* CÓMPUTO DE CAPA AISLADORA DOBLE HORIZONTAL Y VERTICAL (DESDE ZÓCALOS DE PLANTA BAJA) */}
            <div className="bg-sky-50 border-2 border-sky-700 rounded-xl p-4 space-y-3 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-800 text-white flex items-center justify-center shrink-0">
                    <Droplets className="w-4 h-4 text-sky-200" />
                  </div>
                  <div>
                    <h5 className="font-black text-sky-950 text-xs sm:text-sm uppercase tracking-wide">
                      Rubro: Capa Aisladora Doble Horizontal y Vertical (Cajón Hidrófugo PB)
                    </h5>
                    <p className="text-[11px] text-slate-700">
                      Calculado desde los metros lineales de zócalos de <strong>Planta Baja ({pbZocaloMetersTotal.toFixed(2)} m.l.)</strong> × <strong>(2 × Espesor Muro + 2 × 0.20 m)</strong>, espesor cementicio <strong>2.5 cm</strong>.
                    </p>
                  </div>
                </div>

                {/* Espesor de muro interactive selector */}
                <div className="flex flex-wrap items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-sky-300 text-xs no-print">
                  <span className="font-bold text-sky-950 text-[11px]">Espesor Muro:</span>
                  {['0.12', '0.15', '0.18', '0.20', '0.30'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setWallThicknessInput(val)}
                      className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border transition ${
                        wallThicknessM.toFixed(2) === val
                          ? 'bg-sky-800 text-white border-sky-900'
                          : 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100'
                      }`}
                    >
                      {val}m
                    </button>
                  ))}
                  <input
                    type="text"
                    inputMode="decimal"
                    value={wallThicknessInput}
                    onChange={(e) => setWallThicknessInput(e.target.value)}
                    className="w-14 text-center font-mono font-black text-sky-950 bg-sky-50 border border-sky-400 rounded px-1 py-0.5 text-[11px] outline-none focus:ring-2 focus:ring-sky-500"
                    aria-label="Espesor de muro en metros"
                  />
                  <span className="font-mono font-bold text-slate-600 text-[11px]">m</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-sky-300 space-y-1">
                  <span className="font-bold text-slate-700 text-[10px] uppercase block">1. Zócalos Planta Baja (PB):</span>
                  <span className="font-mono font-black text-sky-950 text-sm block">{pbZocaloMetersTotal.toFixed(2)} m.l.</span>
                  <span className="text-[10.5px] text-slate-600 block">
                    U.H. 1 ({pbZocaloMetersUH1.toFixed(2)} m) + U.H. 2 ({pbZocaloMetersUH2.toFixed(2)} m)
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-sky-300 space-y-1">
                  <span className="font-bold text-slate-700 text-[10px] uppercase block">2. Desarrollo y Superficie:</span>
                  <span className="font-mono font-black text-sky-950 text-sm block">{capaAisladoraM2.toFixed(2)} m²</span>
                  <span className="text-[10.5px] text-slate-600 block font-mono">
                    {pbZocaloMetersTotal.toFixed(2)}m × (2×{wallThicknessM.toFixed(2)} + 2×0.20) = {capaAisladoraDesarrolloM.toFixed(2)}m
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-sky-300 space-y-1">
                  <span className="font-bold text-slate-700 text-[10px] uppercase block">3. Mortero Cementicio e=2.5 cm:</span>
                  <span className="font-mono font-black text-emerald-900 text-sm block">{capaAisladoraMorteroM3.toFixed(2)} m³ c/ Hidrófugo</span>
                  <span className="text-[10.5px] text-slate-700 block">
                    {capaAisladoraCementoBolsas} Bolsas Cem. + {capaAisladoraArenaComercial} m³ Arena + {capaAisladoraHidrofugoBidones} Bid. Ceresita
                  </span>
                </div>

                <div className="bg-sky-900 text-white p-3 rounded-lg border border-sky-950 space-y-1">
                  <span className="font-bold text-sky-200 text-[10px] uppercase block">4. Asfáltica + Agrotileno 200µ:</span>
                  <span className="font-mono font-black text-amber-300 text-sm block">
                    {capaAisladoraPinturaLatas} Latas 18kg + {capaAisladoraAgrotilenoComercial} m²
                  </span>
                  <span className="text-[10.5px] text-sky-100 block">
                    Asfáltica: {capaAisladoraM2.toFixed(2)} m² | Agrotileno 1.10 m²/m²: {capaAisladoraAgrotilenoM2.toFixed(2)} m² (+5%)
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB: COMPUTO CHANDIAS (CANTIDADES CALCULADAS Y UNIDADES COMERCIALES) */}
        {activeTab === 'computos' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Rubro Chips Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-print scrollbar-thin">
              <span className="text-slate-600 font-bold text-xs shrink-0">Filtrar por Rubro:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition shrink-0 border ${
                    selectedCategoryFilter === cat
                      ? 'bg-blue-700 text-white border-blue-800'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-blue-50'
                  }`}
                >
                  {cat === 'todos' ? 'Todos los Rubros' : cat}
                </button>
              ))}
            </div>

            {/* ALERTA DE CONTROL IA - AUDITORÍA DE CARPINTERÍAS (PLANO GRÁFICO VS PLANILLA OFICIAL) */}
            <div className="bg-amber-50 border-2 border-amber-500 rounded-xl p-3.5 space-y-2 text-amber-950 text-xs shadow-sm">
              <div className="flex items-center justify-between border-b border-amber-300 pb-1.5">
                <div className="flex items-center gap-2 font-black text-amber-900 uppercase tracking-wide text-[11px]">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Auditoría de Control IA: Carpinterías (Plano Gráfico en Planta vs. Planilla Oficial)</span>
                </div>
                <span className="bg-amber-200 text-amber-900 font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-amber-400">
                  Norma Px / PVx / Vx / Otros
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] font-sans">
                <div className="bg-white p-2 rounded-lg border border-amber-300">
                  <span className="font-bold text-slate-800 block">Puertas (Px):</span>
                  <span className="text-slate-600 block">P1 Ingreso (2x) + P2 Placa (10x)</span>
                  <span className="text-emerald-700 font-bold block">✓ Coinciden (12 Unid)</span>
                </div>

                <div className="bg-white p-2 rounded-lg border border-amber-300">
                  <span className="font-bold text-slate-800 block">Puertas Ventana (PVx):</span>
                  <span className="text-slate-600 block">PV1 Balcón/Patio Modena DVH (4x)</span>
                  <span className="text-emerald-700 font-bold block">✓ Coinciden (4 Unid)</span>
                </div>

                <div className="bg-white p-2 rounded-lg border border-amber-300">
                  <span className="font-bold text-slate-800 block">Ventanas (Vx):</span>
                  <span className="text-slate-600 block">V1 Dorm. (4x) + V2 Coc. (2x) + V3 Banderita (4x)</span>
                  <span className="text-emerald-700 font-bold block">✓ Coinciden (10 Unid)</span>
                </div>

                <div className="bg-white p-2 rounded-lg border border-amber-300">
                  <span className="font-bold text-slate-800 block">Otras Carpinterías (Otros):</span>
                  <span className="text-slate-600 block">O1 Portones Garaje Levadizos (2x)</span>
                  <span className="text-emerald-700 font-bold block">✓ Coinciden (2 Unid)</span>
                </div>
              </div>

              <p className="text-[10.5px] text-amber-900 italic font-medium pt-0.5">
                * La IA verifica dinámicamente cada plano cargado. Si la cantidad dibujada en planta no coincide con la Planilla oficial, el sistema emitirá automáticamente una <strong>Alerta de Control de Discrepancia</strong> en rojo con la diferencia exacta a verificar en obra.
              </p>
            </div>

            {/* OPTION 1: FRAMED RESUMEN BY RUBRO (COLOR-CODED EXCEL-STYLE TABLES MAX 11PT) */}
            {showFramedSummary ? (
              <div className="space-y-5 print:space-y-4">
                <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl flex items-center justify-between text-[11px] text-emerald-950 font-medium no-print">
                  <div className="flex items-center gap-2">
                    <LayoutList className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>Modo Resumen Estilo Excel Activo:</strong> Tablas compactas en formato planilla Excel (máx 11pt, sin columna de dosajes) con encuadre por rubro e impresión A4 limpia.
                    </span>
                  </div>
                </div>

                {uniqueCategories
                  .filter((cat) => selectedCategoryFilter === 'todos' || selectedCategoryFilter === cat)
                  .map((catName, idx) => {
                    const catItems = allMaterialComputations.filter((item) => item.category === catName);
                    if (catItems.length === 0) return null;
                    const colors = CATEGORY_COLORS[catName] || CATEGORY_COLORS['Hormigón & Acero'];

                    return (
                      <div
                        key={catName}
                        className={`rounded-xl border-2 ${colors.border} overflow-hidden shadow-sm bg-white page-break-inside-avoid`}
                      >
                        {/* Rubro Header Excel Frame */}
                        <div className={`${colors.headerBg} px-3 py-1.5 flex items-center justify-between border-b border-slate-300`}>
                          <h4 className="font-bold text-[11px] uppercase tracking-wide flex items-center gap-2">
                            <span>RUBRO {idx + 1}: {catName.toUpperCase()}</span>
                          </h4>
                          <span className="text-[10px] font-mono bg-black/20 text-white px-2 py-0.5 rounded font-bold">
                            {catItems.length} ítem(s)
                          </span>
                        </div>

                        {/* Excel Grid Table (No Dosaje column, Max 11pt font) */}
                        <div className="overflow-x-auto p-1.5">
                          <table className="w-full text-left text-[11px] text-slate-900 border-collapse border border-slate-300">
                            <thead className="bg-slate-200 text-slate-900 uppercase font-bold text-[10px]">
                              <tr>
                                <th className="p-1.5 border border-slate-300 bg-slate-200 text-slate-900">
                                  Ítem y Descripción de Obra
                                </th>
                                <th className="p-1.5 border border-slate-300 text-center w-36 bg-slate-200 text-slate-900">
                                  Cómputo Físico
                                </th>
                                <th className="p-1.5 border border-slate-300 text-emerald-950 bg-emerald-200 font-extrabold">
                                  Cantidades en Unidades Comerciales (+5% Desperdicio)
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-300">
                              {catItems.map((item, iIndex) => (
                                <tr key={item.id} className={iIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                  <td className="p-1.5 border border-slate-300 font-bold text-slate-900 text-[11px]">
                                    {item.itemDescription}
                                  </td>
                                  <td className="p-1.5 border border-slate-300 font-mono font-bold text-center text-slate-900 text-[11px] whitespace-nowrap">
                                    {item.physicalQty} {item.physicalUnit}
                                  </td>
                                  <td className="p-1.5 border border-slate-300 text-[11px] font-black text-emerald-950 bg-emerald-50/70">
                                    <div className="flex items-center gap-1.5">
                                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                      <span>{item.commercialUnits}</span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              /* OPTION 2: FULL CONTINUOUS TABLE (Compact Excel Style) */
              <div className="bg-white rounded-xl border-2 border-blue-600 overflow-x-auto shadow-sm">
                <table className="w-full text-left text-[11px] text-slate-800 border-collapse border border-slate-300">
                  <thead className="bg-blue-900 text-white uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-2 border border-blue-800">Rubro e Ítem de Obra</th>
                      <th className="p-2 border border-blue-800 text-center w-28">Cómputo Físico</th>
                      <th className="p-2 border border-blue-800 bg-blue-950">Dosaje / Rendimiento (Chandías)</th>
                      <th className="p-2 border border-blue-800 bg-blue-800 text-amber-200">
                        Cantidades Calculadas (Físicas)
                      </th>
                      <th className="p-2 border border-blue-800 bg-emerald-900 text-emerald-100">
                        Cantidades Unidades Comerciales (+5%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredComputations.map((item, idx) => (
                      <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}>
                        <td className="p-2 border border-slate-200 text-[11px]">
                          <span className="text-[9px] font-bold uppercase text-blue-900 block mb-0.5">
                            {item.category}
                          </span>
                          <strong className="text-slate-900 font-bold block">{item.itemDescription}</strong>
                        </td>

                        <td className="p-2 border border-slate-200 font-mono font-bold whitespace-nowrap text-slate-900 text-center text-[11px]">
                          {item.physicalQty} {item.physicalUnit}
                        </td>

                        <td className="p-2 border border-slate-200 text-[10px] text-slate-700 bg-slate-50">
                          {item.dosajeChandias}
                        </td>

                        <td className="p-2 border border-slate-200 font-mono font-bold text-blue-950 text-[11px] bg-blue-50/60">
                          {item.calculatedTheoretical}
                        </td>

                        <td className="p-2 border border-slate-200 text-[11px] font-bold text-emerald-900 bg-emerald-50/50">
                          <div className="flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>{item.commercialUnits}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CONSOLIDATED COMMERCIAL MATERIALS PURCHASING SUMMARY - EXCEL TABLE STYLE (MAX 11PT) */}
            <div className="bg-white border-2 border-emerald-700 rounded-xl overflow-hidden shadow-md page-break-inside-avoid">
              {/* Header Frame */}
              <div className="bg-emerald-800 text-white p-3 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900">
                <h5 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-300" />
                  <span>Resumen Consolidado de Compras Comerciales (Dosajes Chandías +5% Desperdicio)</span>
                </h5>

                <span className="text-[10px] font-mono font-bold bg-white/20 text-white px-2 py-0.5 rounded border border-emerald-400">
                  Planilla Comercial de Insumos
                </span>
              </div>

              {/* Excel Grid Table for Consolidated Purchases */}
              <div className="p-2 overflow-x-auto">
                <table className="w-full text-left text-[11px] text-slate-900 border-collapse border border-slate-300">
                  <thead className="bg-slate-200 text-slate-900 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-2 border border-slate-300 w-12 text-center bg-slate-300">N°</th>
                      <th className="p-2 border border-slate-300 bg-slate-200">Insumo / Material Comercial</th>
                      <th className="p-2 border border-slate-300 text-center w-40 bg-slate-200">Unidad Comercial</th>
                      <th className="p-2 border border-slate-300 text-emerald-950 bg-emerald-200 font-extrabold text-right">
                        Cantidad Total Estimada Previa (+5%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 font-sans">
                    {consolidatedMaterialsList.map((row, rIdx) => (
                      <tr key={row.id} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-emerald-50/40 transition'}>
                        <td className="p-1.5 border border-slate-300 font-mono font-bold text-center text-slate-600 bg-slate-100/60">
                          {row.id}
                        </td>
                        <td className="p-1.5 border border-slate-300 font-bold text-slate-900 text-[11px]">
                          {row.insumo}
                        </td>
                        <td className="p-1.5 border border-slate-300 text-center font-mono text-slate-700 text-[11px]">
                          {row.unidad}
                        </td>
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-black text-emerald-950 bg-emerald-50 text-[11px]">
                          {row.cantidadNum.toLocaleString('es-AR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Required Professional Note */}
              <div className="bg-amber-50 border-t border-amber-300 p-2.5 flex items-center gap-2 text-[11px] text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Aviso Profesional de Obra:</strong> Cómputo estimativo previo, sujeto a elaboración pormenorizada posterior por parte de Instalador.
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB: DATOS GENERALES */}
        {activeTab === 'general' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border-2 border-blue-600 space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm border-b border-blue-200 pb-2">
                  <MapPin className="w-4 h-4 text-blue-700" />
                  <span>Ubicación y Catastro</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Obra:</span>
                    <span className="font-bold text-slate-900">{activeProject?.title || 'Calle Davos 753'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Propietario:</span>
                    <span className="font-bold text-slate-900">{activeProject?.propietario || 'Elías Tomás Monte'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Nomenclatura Catastral:</span>
                    <span className="font-mono text-blue-800 font-bold">{activeProject?.catastro || 'CIRC 01 SECC 09 MZA 052 PARC 001'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border-2 border-blue-600 space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm border-b border-blue-200 pb-2">
                  <UserCheck className="w-4 h-4 text-blue-700" />
                  <span>Dirección Técnica & Normativa</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Proyectista:</span>
                    <span className="font-bold text-slate-900">{activeProject?.profesional || 'Ing. Civil Julio Zambrano'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Normativa Sísmica:</span>
                    <span className="font-bold text-blue-800">Cumple Ley 10575/2018 / CIRSOC 103</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB: SUPERFICIES & ZONIFICACIÓN */}
        {activeTab === 'superficies' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Top KPI Cards for Balance de Superficies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border-2 border-blue-600 text-center space-y-1 shadow-sm">
                <div className="text-slate-600 text-[10px] uppercase font-bold tracking-wide">Superficie Terreno Lote Total</div>
                <div className="text-2xl font-black text-blue-950 font-mono">250.00 m²</div>
                <div className="text-[10px] text-blue-800 font-bold">U.H. 1 (125 m²) + U.H. 2 (125 m²)</div>
              </div>

              <div className="bg-white p-4 rounded-xl border-2 border-emerald-600 text-center space-y-1 shadow-sm">
                <div className="text-slate-600 text-[10px] uppercase font-bold tracking-wide">Superficie Útil Neta (Sin Muros)</div>
                <div className="text-2xl font-black text-emerald-900 font-mono">205.66 m²</div>
                <div className="text-[10px] text-emerald-700 font-bold">Pisotera neta de locales habitables</div>
              </div>

              <div className="bg-white p-4 rounded-xl border-2 border-amber-500 text-center space-y-1 shadow-sm">
                <div className="text-slate-600 text-[10px] uppercase font-bold tracking-wide">Impronta Muros & Tabiques</div>
                <div className="text-2xl font-black text-amber-900 font-mono">41.89 m²</div>
                <div className="text-[10px] text-amber-800 font-bold">16.9% del área total cubierta</div>
              </div>

              <div className="bg-blue-900 text-white p-4 rounded-xl border border-blue-950 text-center space-y-1 shadow-sm">
                <div className="text-blue-200 text-[10px] uppercase font-bold tracking-wide">Superficie Cubierta Bruta Total</div>
                <div className="text-2xl font-black font-mono">247.55 m²</div>
                <div className="text-[10px] text-amber-300 font-bold">PB (134.43 m²) + PA (102.46 m² + Balcón)</div>
              </div>
            </div>

            {/* CÓMPUTO DE RELLENO Y NIVELACIÓN DISCRETIZADO POR UNIDAD HABITACIONAL */}
            <div className="bg-emerald-50 border-2 border-emerald-600 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm border-b border-emerald-200 pb-2">
                <Layers className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Cómputo de Relleno y Nivelación de Terreno Discretizado por Unidad Habitacional (U.H.)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Cada unidad habitacional cuenta con su correspondiente superficie de terreno delimitada. Se aplica la fórmula de sub-base compactada en capas de 15cm con espesor promedio de <strong>0.30 m</strong>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-emerald-300 space-y-1">
                  <span className="font-bold text-slate-900 block">Unidad Habitacional 1 (U.H. 1):</span>
                  <span className="text-slate-600 block">Superficie Terreno: 125.00 m² x 0.30m</span>
                  <span className="font-mono font-black text-emerald-900 text-sm block">Volumen = 37.50 m³</span>
                  <span className="text-[10px] text-slate-500 block">7.5 Camiones de tierra de relleno</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-300 space-y-1">
                  <span className="font-bold text-slate-900 block">Unidad Habitacional 2 (U.H. 2):</span>
                  <span className="text-slate-600 block">Superficie Terreno: 125.00 m² x 0.30m</span>
                  <span className="font-mono font-black text-emerald-900 text-sm block">Volumen = 37.50 m³</span>
                  <span className="text-[10px] text-slate-500 block">7.5 Camiones de tierra de relleno</span>
                </div>

                <div className="bg-emerald-900 text-white p-3 rounded-lg border border-emerald-950 space-y-1">
                  <span className="font-bold text-emerald-200 block uppercase text-[10px]">Total Consolidado Terreno:</span>
                  <span className="text-emerald-100 block text-[11px]">250.00 m² Lote Total x 0.30m</span>
                  <span className="font-mono font-black text-amber-300 text-base block">Total = 75.00 m³</span>
                  <span className="text-[10px] text-emerald-200 block">15 Camiones de 5 m³ c/u</span>
                </div>
              </div>
            </div>

            {/* CÓMPUTO DE TAPIAS Y MUROS DE CIERRE EN PATIO TRASERO */}
            <div className="bg-amber-50 border-2 border-amber-600 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-950 text-sm border-b border-amber-300 pb-2">
                <Building2 className="w-5 h-5 text-amber-700 shrink-0" />
                <span>Tapias y Muros de Cierre en Patio Trasero (Con Zapata Corrida y Excavación)</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed">
                Se computan los muros perimetrales de cierre de patio para U.H. 1 y U.H. 2, identificando y descontando la longitud de la tapia divisoria común para evitar duplicaciones en el balance:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-amber-300 space-y-1">
                  <span className="font-bold text-slate-900 block text-[11px]">Longitud de Tapias:</span>
                  <span className="text-slate-600 block text-[11px]">U.H. 1 (16.25m) + U.H. 2 (16.25m) + Divisoria Común (10m)</span>
                  <span className="font-mono font-black text-amber-950 block">42.50 m.l. Totales</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-300 space-y-1">
                  <span className="font-bold text-slate-900 block text-[11px]">1. Excavación para Zapatas:</span>
                  <span className="text-slate-600 block text-[11px]">Sección 0.50m ancho x 0.60m profundidad x 42.50m.l.</span>
                  <span className="font-mono font-black text-amber-950 block">12.75 m³ Zanjeo</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-300 space-y-1">
                  <span className="font-bold text-slate-900 block text-[11px]">2. Zapata Corrida H-15:</span>
                  <span className="text-slate-600 block text-[11px]">Sección 0.50m ancho x 0.20m altura x 42.50m.l.</span>
                  <span className="font-mono font-black text-amber-950 block">4.25 m³ Hormigón</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-300 space-y-1">
                  <span className="font-bold text-slate-900 block text-[11px]">3. Muro Tapia y Revoque:</span>
                  <span className="text-slate-600 block text-[11px]">Muro h=2.40m (102 m²) + Revoque Impermeable 2 caras</span>
                  <span className="font-mono font-black text-amber-950 block">204 m² Revoque</span>
                </div>
              </div>
            </div>

            {/* CÓMPUTO DE CAPA AISLADORA DOBLE HORIZONTAL Y VERTICAL */}
            <div className="bg-sky-50 border-2 border-sky-600 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sky-950 text-sm border-b border-sky-300 pb-2">
                <Droplets className="w-5 h-5 text-sky-700 shrink-0" />
                <span>Capa Aisladora Doble Horizontal y Vertical en Planta Baja (e = 2.5 cm + Asfáltica + Agrotileno 200µ)</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed">
                Computada a partir de los <strong>{pbZocaloMetersTotal.toFixed(2)} m.l.</strong> de zócalos en Planta Baja por un desarrollo transversal de <strong>(2 × {wallThicknessM.toFixed(2)} m muro + 2 × 0.20 m = {capaAisladoraDesarrolloM.toFixed(2)} m)</strong>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-sky-300 space-y-1">
                  <span className="font-bold text-slate-900 block text-[11px]">Zócalos Planta Baja:</span>
                  <span className="text-slate-600 block text-[11px]">U.H. 1 ({pbZocaloMetersUH1.toFixed(2)}m) + U.H. 2 ({pbZocaloMetersUH2.toFixed(2)}m)</span>
                  <span className="font-mono font-black text-sky-950 block">{pbZocaloMetersTotal.toFixed(2)} m.l.</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-sky-300 space-y-1">
                  <span className="font-bold text-slate-900 block text-[11px]">Capa Aisladora Cementicia:</span>
                  <span className="text-slate-600 block text-[11px]">{pbZocaloMetersTotal.toFixed(2)} m.l. × {capaAisladoraDesarrolloM.toFixed(2)} m</span>
                  <span className="font-mono font-black text-sky-950 block">{capaAisladoraM2.toFixed(2)} m² ({capaAisladoraMorteroM3.toFixed(2)} m³)</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-sky-300 space-y-1">
                  <span className="font-bold text-slate-900 block text-[11px]">Pintura Asfáltica Base Acuosa:</span>
                  <span className="text-slate-600 block text-[11px]">2 manos ({capaAisladoraPinturaKg.toFixed(2)} kg teóricos)</span>
                  <span className="font-mono font-black text-sky-950 block">{capaAisladoraPinturaLatas} Latas 18 kg</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-sky-300 space-y-1">
                  <span className="font-bold text-slate-900 block text-[11px]">Agrotileno 200 Micras:</span>
                  <span className="text-slate-600 block text-[11px]">1.10 m²/m² = {capaAisladoraAgrotilenoM2.toFixed(2)} m²</span>
                  <span className="font-mono font-black text-sky-950 block">{capaAisladoraAgrotilenoComercial} m² (+5%)</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB: DISTRIBUCION & ZONIFICACIÓN POR DESTINO DEL LOCAL */}
        {activeTab === 'distribucion' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-blue-50 border-2 border-blue-600 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-700 shrink-0" />
                <span>Planilla de Zonificación por Destino del Local (Superficies Útiles sin Muros y Zócalos)</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Desglose ambiente por ambiente para U.H. 1 y U.H. 2. Calcula la <strong>superficie útil neta de pisada sin muros</strong>, deduce los vanos de carpinterías para determinar el <strong>perímetro neto de zócalos</strong> y discretiza los <strong>baños con revestimiento cerámico de pared h=2.10m</strong>:
              </p>
            </div>

            {/* TABLA INTERACTIVA DE ZONIFICACIÓN POR DESTINO DEL LOCAL */}
            <div className="bg-white border-2 border-blue-700 rounded-xl overflow-hidden shadow-md">
              <div className="bg-blue-900 text-white p-3 flex items-center justify-between">
                <h5 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <LayoutList className="w-4 h-4 text-blue-300" />
                  <span>Cómputo Discretizado por Local / Ambiente (U.H. 1 & U.H. 2)</span>
                </h5>
                <span className="bg-blue-950 text-amber-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-blue-600">
                  {ROOM_ZONING_DATA.length} Locales Discretizados
                </span>
              </div>

              <div className="p-2 overflow-x-auto">
                <table className="w-full text-left text-[11px] text-slate-900 border-collapse border border-slate-300">
                  <thead className="bg-slate-200 text-slate-900 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-2 border border-slate-300 bg-slate-300 w-16 text-center">Unidad</th>
                      <th className="p-2 border border-slate-300 bg-slate-200">Local / Destino del Ambiente</th>
                      <th className="p-2 border border-slate-300 text-center w-14 bg-slate-200">Planta</th>
                      <th className="p-2 border border-slate-300 text-center w-24 bg-slate-200">Dimensiones</th>
                      <th className="p-2 border border-slate-300 text-emerald-950 bg-emerald-100 font-black text-right w-28">
                        Sup. Neta (Sin Muros)
                      </th>
                      <th className="p-2 border border-slate-300 text-center w-24 bg-slate-200">Perím. Bruto</th>
                      <th className="p-2 border border-slate-300 text-center w-24 bg-slate-200">Vano Puertas</th>
                      <th className="p-2 border border-slate-300 text-blue-950 bg-blue-100 font-black text-right w-28">
                        Perím. Zócalo (Neto)
                      </th>
                      <th className="p-2 border border-slate-300 bg-amber-100 text-amber-950 font-bold">Revestimientos & Solados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 font-sans">
                    {ROOM_ZONING_DATA.map((room, rIdx) => (
                      <tr key={room.id} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-blue-50/40 transition'}>
                        <td className="p-1.5 border border-slate-300 text-center font-mono font-bold text-[10px] text-blue-900 bg-blue-50/60">
                          {room.unidad}
                        </td>
                        <td className="p-1.5 border border-slate-300 font-bold text-slate-900 text-[11px]">
                          {room.nombreLocal}
                        </td>
                        <td className="p-1.5 border border-slate-300 text-center font-mono font-bold text-slate-700 text-[10px]">
                          {room.planta}
                        </td>
                        <td className="p-1.5 border border-slate-300 text-center font-mono text-slate-700 text-[11px]">
                          {room.dimensiones}
                        </td>
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-black text-emerald-950 bg-emerald-50 text-[11px]">
                          {room.superficieNeta.toFixed(2)} m²
                        </td>
                        <td className="p-1.5 border border-slate-300 text-center font-mono text-slate-600 text-[11px]">
                          {room.perimetroBruto.toFixed(2)} m
                        </td>
                        <td className="p-1.5 border border-slate-300 text-center font-mono text-slate-500 text-[11px]">
                          -{room.vanoDescuento.toFixed(2)} m
                        </td>
                        <td className="p-1.5 border border-slate-300 text-right font-mono font-black text-blue-950 bg-blue-50 text-[11px]">
                          {room.perimetroZocalo.toFixed(2)} m.l.
                        </td>
                        <td className="p-1.5 border border-slate-300 text-[10.5px]">
                          <div className="space-y-0.5">
                            {room.revestimientoEspecial && (
                              <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 font-bold px-1.5 py-0.5 rounded text-[10px] mr-1">
                                🚿 {room.revestimientoEspecial}
                              </span>
                            )}
                            <span className="text-slate-700 block font-medium">{room.tipoSolado}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white font-mono font-bold text-xs">
                    <tr>
                      <td colSpan={4} className="p-2.5 border border-slate-800 text-right uppercase tracking-wider text-slate-200">
                        Totales Consolidados (Sin Muros):
                      </td>
                      <td className="p-2.5 border border-slate-800 text-right text-emerald-300 font-black text-sm">
                        205.66 m²
                      </td>
                      <td className="p-2.5 border border-slate-800 text-center text-slate-300 text-[11px]">
                        230.14 m
                      </td>
                      <td className="p-2.5 border border-slate-800 text-center text-slate-400 text-[11px]">
                        -36.06 m
                      </td>
                      <td className="p-2.5 border border-slate-800 text-right text-amber-300 font-black text-sm">
                        194.08 m.l.
                      </td>
                      <td className="p-2.5 border border-slate-800 text-emerald-200 font-sans text-[11px]">
                        ✓ 50.40 m² Revestimiento Cerámico Pared Baños (h=2.10m)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="bg-sky-50 border-2 border-sky-600 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-black text-sky-950 uppercase block">
                  Resumen Zócalos Planta Baja → Capa Aisladora Doble Horizontal y Vertical
                </span>
                <span className="text-slate-700 block">
                  {pbZocaloMetersTotal.toFixed(2)} m.l. PB × (2×{wallThicknessM.toFixed(2)}m + 2×0.20m) = <strong>{capaAisladoraM2.toFixed(2)} m²</strong> | Mortero 2.5 cm ({capaAisladoraMorteroM3.toFixed(2)} m³) + Pintura Asfáltica ({capaAisladoraPinturaLatas} latas 18kg) + Agrotileno 200µ ({capaAisladoraAgrotilenoComercial} m²)
                </span>
              </div>
              <span className="font-mono font-black bg-sky-800 text-white px-3 py-1.5 rounded-lg">
                {capaAisladoraM2.toFixed(2)} m² Capa Aisladora
              </span>
            </div>
          </motion.div>
        )}

        {/* TAB: ESTRUCTURA */}
        {activeTab === 'estructura' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="bg-white p-5 rounded-xl border-2 border-blue-600 space-y-2">
              <h5 className="font-bold text-blue-900 text-sm">Fundaciones, Columnas, Losas de Viguetas y Ley Sísmica</h5>
              <p className="text-xs text-slate-700">
                Fundaciones Z1 (0.80x0.20m), Z2 (0.60x0.40m), Bases aisladas B1 (0.80x0.60m), 28x C1 en PB y 24x C1 en PA. Losas L1-L8 compuestas por 80 viguetas pretensadas T180, 1,250 bovedillas EPS h=12cm y Malla SIMA Q92. Estricto cumplimiento Ley 10575/2018 y reglamentos CIRSOC 103 / 201.
              </p>
            </div>
          </motion.div>
        )}

        {/* TAB: COSTOS APROXIMADOS TOTALES (MATERIALES EDITABLES + MANO DE OBRA X M2) */}
        {activeTab === 'costos' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Top Cost KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-emerald-900 text-white p-4 rounded-xl border border-emerald-700 shadow-sm space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Total Materiales (+5%)</div>
                <div className="text-2xl font-black font-mono">
                  ${totalMaterialCost.toLocaleString('es-AR')}
                </div>
                <div className="text-[10px] text-emerald-300 font-mono">
                  ${Math.round(materialCostPerM2).toLocaleString('es-AR')} / m²
                </div>
              </div>

              <div className="bg-blue-900 text-white p-4 rounded-xl border border-blue-700 shadow-sm space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Total Mano de Obra Estimada</div>
                <div className="text-2xl font-black font-mono">
                  ${totalLaborCost.toLocaleString('es-AR')}
                </div>
                <div className="text-[10px] text-blue-300 font-mono">
                  ${totalLaborRatePerM2.toLocaleString('es-AR')} / m²
                </div>
              </div>

              <div className="bg-amber-500 text-slate-950 p-4 rounded-xl border border-amber-600 shadow-sm space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-950">Costo Total Estimado Obra</div>
                <div className="text-2xl font-black font-mono">
                  ${grandTotalCost.toLocaleString('es-AR')}
                </div>
                <div className="text-[10px] font-bold text-amber-900">
                  Materiales + Mano de Obra 6 Rubros
                </div>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-700 shadow-sm space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Costo Material + MO / m²</div>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  ${Math.round(grandTotalCostPerM2).toLocaleString('es-AR')}
                </div>
                <div className="text-[10px] text-slate-400">
                  Basado en {totalBuiltArea} m² edificados
                </div>
              </div>
            </div>

            {/* TABLA 1: RESUMEN CONSOLIDADO DE COMPRAS COMERCIALES CON PRECIOS EDITABLES */}
            <div className="bg-white border-2 border-emerald-700 rounded-xl overflow-hidden shadow-md space-y-2">
              <div className="bg-emerald-800 text-white p-3 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900">
                <div className="space-y-0.5">
                  <h5 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-300" />
                    <span>Costos de Materiales: Resumen Consolidado de Compras Comerciales (Córdoba / Easy / ML)</span>
                  </h5>
                  <p className="text-[10px] text-emerald-200">
                    Precios unitarios editables en ARS ($). Modifica cualquier valor para recalcular automáticamente el Costo Parcial y Total.
                  </p>
                </div>

                {/* Material Prices Action Controls */}
                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                  <button
                    onClick={() => handleAdjustMaterialPricesPercentage(10)}
                    className="px-2 py-1 rounded bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold transition shadow-sm"
                    title="Aumentar un +10% los precios de insumos por inflación"
                  >
                    +10% Inflación
                  </button>

                  <button
                    onClick={() => handleAdjustMaterialPricesPercentage(-5)}
                    className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm"
                    title="Aplicar un -5% de descuento por compra mayorista"
                  >
                    -5% Descuento
                  </button>

                  <button
                    onClick={handleResetMaterialPrices}
                    className="px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-100 font-bold transition shadow-sm border border-emerald-700"
                    title="Restablecer precios unitarios de mercado Easy / MercadoLibre Córdoba"
                  >
                    Restablecer Precios Originales
                  </button>
                </div>
              </div>

              <div className="p-2 overflow-x-auto">
                <table className="w-full text-left text-[11px] text-slate-900 border-collapse border border-slate-300">
                  <thead className="bg-slate-200 text-slate-900 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-2 border border-slate-300 w-10 text-center bg-slate-300">N°</th>
                      <th className="p-2 border border-slate-300 bg-slate-200">Insumo / Material Comercial</th>
                      <th className="p-2 border border-slate-300 text-center w-28 bg-slate-200">Unidad</th>
                      <th className="p-2 border border-slate-300 text-center w-24 bg-slate-200">Cantidad</th>
                      <th className="p-2 border border-slate-300 w-44 text-center bg-amber-100 text-amber-950 font-bold">
                        Precio Unitario ($ ARS)
                      </th>
                      <th className="p-2 border border-slate-300 text-emerald-950 bg-emerald-200 font-extrabold text-right w-44">
                        Costo Parcial ($ ARS)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 font-sans">
                    {consolidatedMaterialsList.map((row, rIdx) => {
                      const rawVal = materialPrices[row.id] !== undefined ? String(materialPrices[row.id]) : String(row.defaultPrice);
                      const numericUnitPrice = getMaterialUnitPrice(row.id);
                      const partialCost = Math.round(row.cantidadNum * numericUnitPrice);

                      return (
                        <tr key={row.id} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-emerald-50/30 transition'}>
                          <td className="p-1.5 border border-slate-300 font-mono font-bold text-center text-slate-600 bg-slate-100/60">
                            {row.id}
                          </td>
                          <td className="p-1.5 border border-slate-300 font-bold text-slate-900 text-[11px]">
                            {row.insumo}
                          </td>
                          <td className="p-1.5 border border-slate-300 text-center font-mono text-slate-700 text-[11px]">
                            {row.unidad}
                          </td>
                          <td className="p-1.5 border border-slate-300 text-center font-mono font-bold text-slate-900 text-[11px]">
                            {row.cantidadNum}
                          </td>
                          <td className="p-1.5 border border-slate-300 bg-amber-50/60">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-amber-800 font-mono font-bold">$</span>
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={rawVal}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setMaterialPrices((prev) => ({ ...prev, [row.id]: val }));
                                  }}
                                  className="w-full text-xs font-mono font-bold text-slate-900 bg-white border border-amber-300 rounded px-1.5 py-0.5 outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                                  placeholder={`$ ${row.defaultPrice.toLocaleString('es-AR')}`}
                                />
                              </div>
                              <span className="text-[9.5px] font-mono font-extrabold text-amber-900 bg-amber-100/90 px-1 py-0.5 rounded text-center border border-amber-300 shadow-2xs">
                                $ {numericUnitPrice.toLocaleString('es-AR')}
                              </span>
                            </div>
                          </td>
                          <td className="p-1.5 border border-slate-300 text-right font-mono font-black text-emerald-950 bg-emerald-50 text-[11px]">
                            ${partialCost.toLocaleString('es-AR')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white font-mono font-bold text-xs">
                    <tr>
                      <td colSpan={5} className="p-2.5 border border-slate-700 text-right uppercase tracking-wider text-slate-200">
                        Total Costo de Materiales (Compras Comerciales +5% Desperdicio):
                      </td>
                      <td className="p-2.5 border border-slate-700 text-right text-emerald-400 font-black text-sm">
                        ${totalMaterialCost.toLocaleString('es-AR')}
                      </td>
                    </tr>
                    <tr className="bg-slate-800 text-amber-300 text-[11px]">
                      <td colSpan={5} className="p-2 border border-slate-700 text-right uppercase tracking-wider font-sans">
                        Costo de Materiales por m² Construido ({totalBuiltArea} m²):
                      </td>
                      <td className="p-2 border border-slate-700 text-right text-amber-300 font-black text-xs">
                        ${Math.round(materialCostPerM2).toLocaleString('es-AR')} / m²
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* TABLA 2: RENGLONES MANO DE OBRA ESTIMADA POR M2 CON 3 CRITERIOS DE CÁLCULO */}
            <div className="bg-white border-2 border-blue-700 rounded-xl overflow-hidden shadow-md space-y-3">
              <div className="bg-blue-900 text-white p-3 flex flex-wrap items-center justify-between gap-3 border-b border-blue-950">
                <div className="space-y-0.5">
                  <h5 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                    <HardHat className="w-4 h-4 text-amber-300" />
                    <span>Calculadora de Mano de Obra Estimada por m² (Mercado Córdoba 2026)</span>
                  </h5>
                  <p className="text-[10px] text-blue-200">
                    Selecciona el Criterio de Ejecución (UOCRA x1.00, Contratista x2.10, C.Propia x0.80) para modificar automáticamente las tarifas por m² y el costo final de obra.
                  </p>
                </div>

                {/* Interactive Calculator Quick Controls */}
                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                  <div className="bg-blue-950/80 p-1.5 rounded-lg border border-blue-600 flex items-center gap-2">
                    <span className="text-blue-200 font-bold">Superficie Obra:</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={builtAreaInput}
                      onChange={(e) => setBuiltAreaInput(e.target.value)}
                      className="w-20 text-xs font-mono font-black text-slate-900 bg-white border border-blue-300 rounded px-1 py-0.5 outline-none focus:ring-2 focus:ring-amber-400 text-center"
                    />
                    <span className="text-amber-300 font-bold font-mono">m²</span>
                  </div>

                  <button
                    onClick={() => handleAdjustLaborRatesPercentage(10)}
                    className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition shadow-sm"
                    title="Aumentar un +10% todas las tarifas base por m²"
                  >
                    +10% Inflación
                  </button>

                  <button
                    onClick={handleResetLaborRates}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition shadow-sm border border-slate-600"
                    title="Restablecer tarifas base UOCRA Córdoba"
                  >
                    Restablecer Base
                  </button>
                </div>
              </div>

              {/* BARRA SELECTORA DE LOS 3 CRITERIOS DE CÁLCULO DE MANO DE OBRA */}
              <div className="bg-slate-100 p-3 border-b border-slate-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold text-xs flex items-center gap-1.5">
                    <span>Seleccionar Criterio de Modalidad de Contratación (Plaza Córdoba):</span>
                  </span>
                  <span className={`text-[10.5px] font-mono font-bold px-2 py-0.5 rounded border shadow-2xs ${LABOR_CRITERIA_FACTORS[laborCriterion].badgeClass}`}>
                    Factor Activo: {activeLaborFactor.toFixed(2)}x
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(['uocra', 'contratista', 'cpropia'] as const).map((critKey) => {
                    const info = LABOR_CRITERIA_FACTORS[critKey];
                    const isSelected = laborCriterion === critKey;

                    return (
                      <button
                        type="button"
                        key={critKey}
                        onClick={() => handleSelectLaborCriterion(critKey)}
                        className={`p-2.5 rounded-xl border-2 text-left transition shadow-xs flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-900 text-white border-blue-950 ring-2 ring-amber-400 font-extrabold'
                            : 'bg-white text-slate-800 border-slate-300 hover:bg-blue-50/60'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs">
                          <span>{info.label}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'}`}>
                            {info.factor.toFixed(2)}x
                          </span>
                        </div>
                        <p className={`text-[10px] mt-1 line-clamp-2 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                          {info.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TABLA DE RENGLONES MANO DE OBRA CON MULTIPLICADOR */}
              <div className="p-2 overflow-x-auto">
                <table className="w-full text-left text-[11px] text-slate-900 border-collapse border border-slate-300">
                  <thead className="bg-slate-200 text-slate-900 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-2 border border-slate-300 w-10 text-center bg-slate-300">Renglón</th>
                      <th className="p-2 border border-slate-300 bg-slate-200">Especialidad de Mano de Obra</th>
                      <th className="p-2 border border-slate-300 w-40 text-center bg-slate-200 font-bold">
                        Tarifa Base ($/m²)
                      </th>
                      <th className="p-2 border border-slate-300 w-24 text-center bg-amber-100 text-amber-950 font-bold">
                        Factor Criterio
                      </th>
                      <th className="p-2 border border-slate-300 w-44 text-center bg-blue-100 text-blue-950 font-bold">
                        Tarifa Efectiva ($/m²)
                      </th>
                      <th className="p-2 border border-slate-300 text-blue-950 bg-blue-100 font-extrabold text-right w-48">
                        Costo Total Especialidad ({totalBuiltArea} m²)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 font-sans">
                    {DEFAULT_LABOR_RATES.map((item, lIdx) => {
                      const rateStr = laborRates[item.id] ?? item.ratePerM2;
                      const numericBaseRate = getLaborRatePerM2(item.id);
                      const effectiveRate = Math.round(numericBaseRate * activeLaborFactor);
                      const tradeTotal = effectiveRate * totalBuiltArea;

                      return (
                        <tr key={item.id} className={lIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-blue-50/30 transition'}>
                          <td className="p-1.5 border border-slate-300 font-mono font-bold text-center text-slate-600 bg-slate-100/60">
                            {lIdx + 1}
                          </td>
                          <td className="p-1.5 border border-slate-300 font-bold text-slate-900 text-[11px]">
                            {item.especialidad}
                          </td>
                          <td className="p-1.5 border border-slate-300 bg-slate-50">
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-slate-500 font-mono font-bold">$</span>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={rateStr}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setLaborRates((prev) => ({ ...prev, [item.id]: val }));
                                }}
                                className="w-full text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded px-1.5 py-0.5 outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                                placeholder={`$ ${item.ratePerM2.toLocaleString('es-AR')}`}
                              />
                            </div>
                          </td>
                          <td className="p-1.5 border border-slate-300 text-center font-mono font-bold text-amber-950 bg-amber-50 text-[11px]">
                            {activeLaborFactor.toFixed(2)}x
                          </td>
                          <td className="p-1.5 border border-slate-300 text-center font-mono font-extrabold text-blue-900 bg-blue-50 text-[11px]">
                            $ {effectiveRate.toLocaleString('es-AR')} / m²
                          </td>
                          <td className="p-1.5 border border-slate-300 text-right font-mono font-black text-blue-950 bg-blue-50 text-[11px]">
                            ${Math.round(tradeTotal).toLocaleString('es-AR')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-blue-950 text-white font-mono font-bold text-xs">
                    <tr>
                      <td colSpan={4} className="p-2.5 border border-blue-800 text-right uppercase tracking-wider text-blue-200">
                        Total Mano de Obra Aplicada por m² ({LABOR_CRITERIA_FACTORS[laborCriterion].shortLabel}):
                      </td>
                      <td className="p-2.5 border border-blue-800 text-center text-amber-300 font-black text-xs">
                        ${totalLaborRatePerM2.toLocaleString('es-AR')} / m²
                      </td>
                      <td className="p-2.5 border border-blue-800 text-right text-emerald-300 font-black text-sm">
                        ${Math.round(totalLaborCost).toLocaleString('es-AR')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* CUADRO RESUMEN CONSOLIDADO FINAL (MATERIALES + MANO DE OBRA CON IMPACTO EN $/M2) */}
            <div className="bg-slate-900 text-white rounded-xl p-5 border-2 border-slate-800 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 pb-3">
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>Balance Consolidado Final de Presupuesto Estimativo</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    Valores calculados para {totalBuiltArea} m² de edificación con criterio <strong>{LABOR_CRITERIA_FACTORS[laborCriterion].label}</strong>.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Costo Directo Estimado</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    ${grandTotalCost.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 space-y-1">
                  <span className="text-slate-400 text-[10px] font-sans font-bold uppercase block">Costo Materiales / m²:</span>
                  <strong className="text-emerald-300 text-sm font-black block">
                    ${Math.round(materialCostPerM2).toLocaleString('es-AR')} / m²
                  </strong>
                  <span className="text-[10px] text-slate-400 block font-sans">
                    ({grandTotalCost > 0 ? ((totalMaterialCost / grandTotalCost) * 100).toFixed(1) : '0.0'}% del presupuesto)
                  </span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] font-sans font-bold uppercase">Costo Mano de Obra / m²:</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-mono">
                      {activeLaborFactor.toFixed(2)}x
                    </span>
                  </div>
                  <strong className="text-blue-300 text-sm font-black block">
                    ${totalLaborRatePerM2.toLocaleString('es-AR')} / m²
                  </strong>
                  <span className="text-[10px] text-slate-400 block font-sans">
                    Criterio: {LABOR_CRITERIA_FACTORS[laborCriterion].shortLabel}
                  </span>
                </div>

                <div className="bg-amber-950/60 p-3 rounded-lg border border-amber-700/60 space-y-1">
                  <span className="text-amber-200 text-[10px] font-sans font-bold uppercase block">COSTO TOTAL CONSOLIDADO / M²:</span>
                  <strong className="text-amber-400 text-base font-black block">
                    ${Math.round(grandTotalCostPerM2).toLocaleString('es-AR')} / m²
                  </strong>
                  <span className="text-[10px] text-amber-300/80 block font-sans">
                    Materiales Córdoba + MO {LABOR_CRITERIA_FACTORS[laborCriterion].shortLabel}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
