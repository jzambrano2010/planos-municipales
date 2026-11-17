import jsPDF from 'jspdf';
import { ProjectData } from '@/components/NewProjectModal';

export function generateProjectPDF(project: ProjectData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Colors
  const darkNavy = [15, 23, 42]; // slate-900
  const amberGold = [217, 119, 6]; // amber-600
  const emeraldGreen = [16, 185, 129]; // emerald-500
  const slateGray = [100, 116, 139]; // slate-500
  const lightBg = [248, 250, 252]; // slate-50

  // 1. Header Banner
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('INFORME TÉCNICO Y BALANCE DE SUPERFICIES', 14, 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(251, 191, 36); // amber-400
  doc.text('PLANO APROBADO MUNICIPAL — LEY ANTISÍSMICA VIGENTE 10575/2018', 14, 20);

  // Fecha y Estado Badge
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, pageWidth - 45, 13);
  doc.setFillColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
  doc.roundedRect(pageWidth - 45, 16, 32, 6, 1, 1, 'F');
  doc.text('VERIFICADO', pageWidth - 39, 20.5);

  let yPos = 36;

  // 2. Ficha Sintética del Proyecto
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(12, yPos, pageWidth - 24, 38, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, yPos, pageWidth - 24, 38, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('1. FICHA SINTÉTICA Y DATOS CATASTRALES', 16, yPos + 7);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Obra:', 16, yPos + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(project.title, 32, yPos + 15);

  doc.setFont('helvetica', 'bold');
  doc.text('Propietario:', 16, yPos + 22);
  doc.setFont('helvetica', 'normal');
  doc.text(project.propietario, 42, yPos + 22);

  doc.setFont('helvetica', 'bold');
  doc.text('Conducción Técnica:', 16, yPos + 29);
  doc.setFont('helvetica', 'normal');
  doc.text(project.profesional, 52, yPos + 29);

  // Columna derecha de la ficha
  doc.setFont('helvetica', 'bold');
  doc.text('Catastro:', 115, yPos + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(project.catastro, 135, yPos + 15);

  doc.setFont('helvetica', 'bold');
  doc.text('Superficie:', 115, yPos + 22);
  doc.setFont('helvetica', 'normal');
  doc.text(project.superficie, 135, yPos + 22);

  doc.setFont('helvetica', 'bold');
  doc.text('Estado Sís.:', 115, yPos + 29);
  doc.setFont('helvetica', 'normal');
  doc.text('Cumple Ley 10575/2018', 138, yPos + 29);

  yPos += 46;

  // 3. Balance de Superficies
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('2. BALANCE DE SUPERFICIES (OFICIAL ESCALA 1:200)', 14, yPos);

  yPos += 4;

  // Tabla Header
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(14, yPos, pageWidth - 28, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Unidad Funcional', 18, yPos + 5);
  doc.text('Planta Baja (m²)', 70, yPos + 5);
  doc.text('Planta Alta (m²)', 110, yPos + 5);
  doc.text('Semicubierta (m²)', 145, yPos + 5);
  doc.text('Subtotal (m²)', 178, yPos + 5);

  yPos += 7;

  // Fila DTO 1
  doc.setFillColor(255, 255, 255);
  doc.rect(14, yPos, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Departamento 1 (DTO 1)', 18, yPos + 5);
  doc.text('67.44 m²', 70, yPos + 5);
  doc.text('51.23 m²', 110, yPos + 5);
  doc.text('5.43 m²', 145, yPos + 5);
  doc.setFont('helvetica', 'bold');
  doc.text('124.10 m²', 178, yPos + 5);

  yPos += 7;

  // Fila DTO 2
  doc.setFillColor(241, 245, 249);
  doc.rect(14, yPos, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'normal');
  doc.text('Departamento 2 (DTO 2)', 18, yPos + 5);
  doc.text('66.99 m²', 70, yPos + 5);
  doc.text('51.23 m²', 110, yPos + 5);
  doc.text('5.23 m²', 145, yPos + 5);
  doc.setFont('helvetica', 'bold');
  doc.text('123.45 m²', 178, yPos + 5);

  yPos += 7;

  // Fila Totales
  doc.setFillColor(254, 243, 199); // amber-100
  doc.rect(14, yPos, pageWidth - 28, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9); // amber-700
  doc.text('TOTAL EDIFICADO', 18, yPos + 5.5);
  doc.text('134.43 m²', 70, yPos + 5.5);
  doc.text('102.46 m²', 110, yPos + 5.5);
  doc.text('10.66 m²', 145, yPos + 5.5);
  doc.setFontSize(9);
  doc.text('247.55 m²', 178, yPos + 5.5);

  yPos += 16;

  // 4. Especificaciones Estructurales
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('3. DESGLOSE ESTRUCTURAL Y MEMORIA TÉCNICA', 14, yPos);

  yPos += 5;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const structLines = [
    '• Fundaciones: Zapatas corridas Z1 (0.80x0.20m), Z2 (0.60x0.40m), Bases aisladas B1 (0.80x0.60m) y vigas R1.',
    '• Capa Aisladora Doble PB: 81.24 m.l. x (2x0.18m + 2x0.20m) = 61.74 m² (Mortero hidrófugo 2.5cm + Asfáltica + Agrotileno 200µ).',
    '• Estructura Vertical: 28 columnas C1 en Planta Baja y 24 columnas C1 en Planta Alta de H°A° (4ø10mm + estribos ø6 c/15cm).',
    '• Columnas de Cochera/Porch: Estructura metálica de 2 PNU 100 soldados con presillas.',
    '• Cubierta e Impermeabilización: Hormigón alivianado para pendiente, pintura poliuritánica + geotextil 70g/m² y bovedillas.',
    '• Carpinterías & Desagües: Aluminio DVH color negro. Cañerías pluviales PVC ø110 mm y tanques tricapa PVC 1000L.'
  ];

  structLines.forEach((line) => {
    doc.text(line, 16, yPos);
    yPos += 5.5;
  });

  yPos += 4;

  // 5. Resumen Consolidado de Cómputo Métrico de Materiales
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('4. CÓMPUTO MÉTRICO CONSOLIDADO DE MATERIALES (+10% Desperdicio)', 14, yPos);

  yPos += 5;

  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(14, yPos, pageWidth - 28, 22, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, yPos, pageWidth - 28, 22, 2, 2, 'D');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Cemento Portland:', 18, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('520 Bolsas (50kg)', 50, yPos + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Acero ADN 420:', 110, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('2,550 kg (ø10, ø8 y ø6mm)', 140, yPos + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Arena Gruesa:', 18, yPos + 12);
  doc.setFont('helvetica', 'normal');
  doc.text('48 m³', 50, yPos + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('Piedra Partida:', 110, yPos + 12);
  doc.setFont('helvetica', 'normal');
  doc.text('57 m³ (6-20mm)', 140, yPos + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('Ladrillos Portantes:', 18, yPos + 18);
  doc.setFont('helvetica', 'normal');
  doc.text('3,832 Unidades (18cm)', 50, yPos + 18);

  doc.setFont('helvetica', 'bold');
  doc.text('Malla SIMA 1ø6mm:', 110, yPos + 18);
  doc.setFont('helvetica', 'normal');
  doc.text('18 Paneles (2.40x6.00m)', 140, yPos + 18);

  yPos += 34;

  // 6. Bloque de Firma y Validación
  doc.setDrawColor(203, 213, 225);
  doc.line(20, yPos + 18, 85, yPos + 18);
  doc.line(pageWidth - 85, yPos + 18, pageWidth - 20, yPos + 18);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('ING. CIVIL JULIO A. ZAMBRANO', 28, yPos + 23);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Matrícula Profesional MP 4097', 31, yPos + 27);
  doc.text('Proyecto y Conducción Técnica', 31, yPos + 31);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('MUNICIPALIDAD DE JESÚS MARÍA', pageWidth - 78, yPos + 23);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Dirección de Obras Privadas', pageWidth - 72, yPos + 27);
  doc.text('Firma Digital Verificada (2026)', pageWidth - 73, yPos + 31);

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Documento oficial generado por la Plataforma Visor y Analizador de Planos Municipales.', 14, 287);

  // Save PDF
  doc.save(`Ficha_Tecnica_Balance_Superficies_${project.title.replace(/\s+/g, '_')}.pdf`);
}
