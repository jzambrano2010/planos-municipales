import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, BorderStyle, WidthType } from 'docx';

export async function generatePliegoWord(projectTitle: string, propietario: string, profesional: string, catastro: string) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'PLIEGO DE ESPECIFICACIONES TÉCNICAS Y CÓMPUTO DE OBRA',
                bold: true,
                size: 32,
                color: '1E3A8A' // Blue
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `Proyecto: ${projectTitle} | Propietario: ${propietario}`,
                italics: true,
                size: 20,
                color: '475569'
              })
            ]
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Obra / Ubicación:', bold: true })] })],
                    width: { size: 30, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: projectTitle })] })],
                    width: { size: 70, type: WidthType.PERCENTAGE }
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Propietario:', bold: true })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: propietario })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Dirección Técnica:', bold: true })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: profesional })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Nomenclatura Catastral:', bold: true })] })]
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: catastro })] })]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { after: 300 }, children: [] }),

          // CAPÍTULO 1: MOVIMIENTO DE SUELOS
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: 'CAPÍTULO 1: TRABAJOS PRELIMINARES Y MOVIMIENTO DE SUELOS',
                bold: true,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '1.1 REPLANTEO Y NIVELACIÓN (Unidad: m²): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Trazado general de la obra con escuadras y nivel óptico de precisión, verificando los ejes de edificación y las líneas medianeras oficiales.' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Se colocarán caballetes de madera con alambre galvanizado tensado. Se marcarán los ejes de columnas y muros con plomada. Inspección visual previa antes de excavar.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '1.2 EXCAVACIÓN DE ZANJAS Y FOSAS (Unidad: m³): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Excavación manual o mecánica para zapatas corridas Z1 (0.80x0.20m), Z2 (0.60x0.40m) y bases aisladas B1 hasta estrato de suelo firme.' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Se nivelará el fondo de la zanja apisonando el terreno desnudo. Se retirará la tierra vegetal sobrante a contenedor. Inspección de suelo según norma CIRSOC 103.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({ text: '1.3 RELLENO Y NIVELACIÓN DE TERRENO (Unidad: m³): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Relleno, aportación de sub-base de tierra seleccionada / suelo-tosca y nivelación en espesor h=0.30 m sobre la superficie del lote/unidad habitacional (250 m² x 0.30 m = 75 m³).' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Aporte de tierra de relleno libre de materia orgánica. Extendido en capas de 15 cm de espesor, humectación previa y compactación con pisón neumático o rodillo vibratorio hasta alcanzar el 95% del ensayo Proctor Normal.' })
            ]
          }),

          // CAPÍTULO 2: ESTRUCTURA RESISTENTE
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: 'CAPÍTULO 2: ESTRUCTURA RESISTENTE Y FUNDACIONES H°A° (CIRSOC 201 / CIRSOC 103)',
                bold: true,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '2.1 HORMIGÓN ESTRUCTURAL H-21 (Unidad: m³): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Dosaje Chandías 1:2:3 (320kg cemento Portland, 0.45m³ arena gruesa, 0.85m³ piedra partida h=10-20mm por m³). Aplicable a Zapatas, 52 Columnas C1 (28 PB + 24 PA), Vigas V1-V5 y capa de compresión h=5cm en Losas L1 a L8 (236.89 m²).' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Encofrados de madera cepillada estancos y rigidizados con tirantes. Colocación de separadores plásticos (recubrimiento mínimo 2.5cm). Colado continuo con vibrador mecánico de inmersión para evitar aireatrapado y nidos de abeja. Curado húmedo por 7 días seguidos (Norma CIRSOC 201).' })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '2.2 ARMADURAS DE ACERO ADN 420 (Unidad: Tn / kg): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Barras de acero nervurado ø10mm y ø8mm en armadura principal + Estribos ø6mm c/15cm (IRAM IAS U500-207). Cuantía promedio de 80 kg/m³ conforme a la Ley Antisísmica N° 10575/2018.' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Corte y doblado en frío sobre banco con mandriles estandarizados. Atado de armaduras con alambre negro recocido N° 18. Refuerzo de estribado cerrado en zona de nudos viga-columna (CIRSOC 103).' })
            ]
          }),
          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({ text: '2.3 LOSAS DE VIGUETAS PREFABRICADAS Y BOVEDILLAS (Unidad: m² / m.l. / Unid.): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Sistema de losas unidireccionales en L1 a L8 (236.89 m²). Compuesto por 80 Viguetas Pretensadas T180 (320 m.l. total, largos L=3.20m a 4.50m) + 1,250 Bovedillas de Telgopor EPS h=12cm + Malla Electrosoldada SIMA Q92 (ø4.2mm 15x15cm, 18 panales 2.40x6.00m) + Armadura de refuerzo negativo ø8mm/ø10mm (80 barras L=1.50m).' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Apuntalamiento de viguetas cada 1.50m con tirantes y puntales regulables (contraflecha de 1.5mm por metro de luz). Colocación de bovedillas EPS a presión sin luces interlineales, armado de Malla SIMA elevada con separadores de 2cm y colocación de armadura de caballete en apoyos. Colado de capa de compresión H-21 h=5cm de espesor uniforme.' })
            ]
          }),

          // CAPÍTULO 3: CONTRAPISOS Y CARPETAS
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: 'CAPÍTULO 3: CONTRAPISOS, CARPETAS Y SOLADOS',
                bold: true,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '3.1 CONTRAPISO DE HORMIGÓN DE CASCOTE EN PB (Unidad: m³ / m²): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Espesor h=10cm sobre suelo natural compactado en Planta Baja (Total: 134.43 m²). Dosaje Chandías 1:1/4:4:8 (105kg cemento, 45kg cal hidráulica, 0.45m³ arena, 0.90m³ cascote molido limpio).' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Compactación previa de subrasante con pisaón mecánico. Colocación de film de polietileno de 200 micrones como barrera de vapor. Ejecución de fajas maestras a nivel, vertido del pastón y apisonado con pisón de mano hasta aflorar lechada superficial.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '3.2 CARPETA CEMENTICIA EN PLANTA ALTA (Unidad: m³ / m²): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Carpeta de nivelación cementicia 1:3 h=3cm sobre losas L1-L8 previa a cerámicos (Total: 102.46 m²). Dosaje Chandías 1:3 (450kg cemento, 1.05m³ arena fina zarandeada).' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Limpieza e hidrolavado de losa base, aplicación de puente de adherencia cementicio con aditivo sintético (Tacuru/Sika). Trazo de maestras, regla de aluminio y fratasado fino manual.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '3.3 SOLADOS CERÁMICOS (Unidad: m²): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Pisos cerámicos/porcellanatos 50x50 cm pegados con mortero impermeable (Rendimiento 6kg/m²) y pastina IRAM de junta.' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Colocación con llana dentada de 8mm, doble encolado en piezas grandes, uso de niveladores plásticos de cuña y junta mínima de 3mm. Empastinado completo a las 24 horas.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({ text: '3.4 REVESTIMIENTOS CERÁMICOS DE PARED (Unidad: m²): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Cerámico de pared 30x45 cm tipo Cortines / primera calidad pegado con mortero adhesivo impermeable (6kg/m²) y pastina impermeable de junta.\n' }),
              new TextRun({ text: 'a) Paredes de Baños (Total 50.40 m²): ', bold: true }),
              new TextRun({ text: 'Fórmula de Cómputo: (Perímetro de baño - Ancho de puerta 0.70m) x 2.00 m de altura. Aplicado a los 4 baños (2 PB + 2 PA).\n' }),
              new TextRun({ text: 'b) Sobre Mesada en Cocina (Total 2.88 m²): ', bold: true }),
              new TextRun({ text: 'Fórmula de Cómputo: Largo de mesada (4.80 m.l.) x 0.60 m (60 cm) de altura.\n' }),
              new TextRun({ text: 'c) Baños Zonificados / Antebaños Lavabo (Total 4.00 m²): ', bold: true }),
              new TextRun({ text: 'Fórmula de Cómputo: (Ancho vanitorio/lavabo 0.80m + 1.20m) x 1.00 m de altura = 2.00 m² por antebaño (2 Unid PA).\n' }),
              new TextRun({ text: 'Procedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Preparación de mampostería con jarrado/revoque grueso fratasado plano a plomo. Nivelación de primera hilada con regla de aluminio fija. Colocación con llana dentada de 6mm y crucetas plásticas de 2mm. Empastinado sellador impermeable a las 24 horas.' })
            ]
          }),

          // CAPÍTULO 4: MAMPOSTERÍA Y CUBIERTAS
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: 'CAPÍTULO 4: MAMPOSTERÍA, CUBIERTAS Y AISLACIONES (CIRSOC 501)',
                bold: true,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '4.1 MUROS PORTANTES EXTERIORES (Unidad: m²): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Ladrillo cerámico portante 18x19x33 cm. Dosaje mortero Chandías 1:1/2:4 (16 unid/m², 4.2kg cemento, 9.5kg cal, 0.035m³ arena). Total: 230 m².' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Mojado previo de bloques cerámicos. Levantado de Muros a plomada y nivel con hilo guía. Traba de hiladas a media junta. Ejecución de azotado impermeable Ceresita 1:2 h=1cm en cara exterior previa al revoque grueso.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '4.2 TABIQUES INTERIORES (Unidad: m²): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Ladrillo hueco 12x19x33 cm. Dosaje mortero 1:1/2:4 (16 unid/m²). Total: 130 m².' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Asentado con mortero aéreo, encuentros con columnas trancados con conectores de acero ø6mm cada 3 hiladas. Tomado de juntas y calado para cañerías eléctricas con amoladora.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '4.3 CUBIERTA E IMPERMEABILIZACIÓN (Unidad: m²): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Pendiente con hormigón alivianado EPS h=8cm + Membrana poliuritánica líquida + Malla geotextil 70g/m².' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Carga de pendiente mínima 2% hacia embudos pluviales. Aplicación de 3 manos cruzadas de membrana líquida poliuritánica intercalando geotextil 70g/m² sellado en babetas perimetrales.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({ text: '4.4 CAPA AISLADORA DOBLE HORIZONTAL Y VERTICAL (Unidad: m²): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Cajón hidrófugo ejecutado sobre muros de Planta Baja a partir de los 81.24 m.l. de zócalos PB por desarrollo transversal (2 × espesor de muro + 2 × 0.20 m = 0.76 m para muro 0.18 m), totalizando 61.74 m². Ejecutada en 2.5 cm de espesor con mortero cementicio 1:3 con aditivo hidrófugo, pintura asfáltica base acuosa en 2 manos y film agrotileno 200 micras a razón de 1.10 m²/m² (67.92 m² netos).' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Limpieza e hidratación de mampostería de cimiento. Ejecución de doble faja horizontal y sus retornos verticales de 0.20 m en ambas caras con mortero cementicio 1:3 e hidrófugo al 10% en agua de empaste (e=2.5 cm) fratasado liso. Una vez seco, aplicación de dos manos cruzadas de pintura asfáltica base acuosa y colocación de barrera física de agrotileno 200 micras con solape mínimo del 10%.' })
            ]
          }),

          // CAPÍTULO 5: INSTALACIONES SANITARIAS Y AGUA
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: 'CAPÍTULO 5: INSTALACIONES SANITARIAS, AGUA FRÍA/CALIENTE Y ARTEFACTOS (MANUAL ACQUA SYSTEM & AWADUCT / IRAM 13470 - IRAM 13476)',
                bold: true,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '5.1 AGUA FRÍA Y CALIENTE ACQUA SYSTEM (Unidad: m.l.): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Cañerías Polipropileno Copolímero Random PP-R Acqua System PN20 Termofusión ø25 mm (48 m.l.) y ø20 mm (72 m.l.) según norma IRAM 13470/13471.' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Canaleteado de muros con roza-muros. Corte de tubos con tijera, biselado y limpieza con alcohol. Termofusión a 260°C en boquillas teflonadas manteniendo tiempos de calentamiento según tabla Acqua System. Prueba hidráulica a 15 kg/cm² durante 2 horas.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '5.2 DESAGÜES CLOACALES Y PLUVIALES AWADUCT (Unidad: m.l.): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Sistema Awaduct PP con O\'Ring de doble labio M.O.L. ø110 mm (64 m.l. cloacal + 56 m.l. pluvial) y ø63 mm (48 m.l. secundario) según norma IRAM 13476. Cámaras de inspección 60x60 cm con mortero hidrófugo Ceresita 1:2.' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Zanjeo en tierra con lecho de arena de 10cm. Limpieza de espigas y campanas, lubricación uniforme con solución deslizante en spray/pasta Awaduct y acople manual con pendiente mínima del 1.5% al 2%.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '5.3 ARTEFACTOS SANITARIOS (Unidad: Unid.): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: '4 Inodoros con mochila, 2 Bidets, 4 Lavatorios/Vanitorys, 2 Piletas de cocina bacha doble acero inox, 2 Mesadas granito Gris Mara (L=2.40m c/u, Total 4.80m).' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Fijación de inodoros y bidets al solado con tarugos de bronce y sellado de silicona neutra en base. Montaje de mesada sobre mampostería fijada con mortero e inserto de grapas metálicas.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({ text: '5.4 GRIFERÍAS (Unidad: Juego): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Monocomando cocina (2 unid), monocomando lavatorio (4 unid), bidet 3 elementos (2 unid) y ducha monocomando con flor lluvia ø20cm (2 unid).' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Colocación con excéntricos ajustados con cinta teflón. Verificación de caudales y estanqueidad en conectores flexibles trenzados de acero inoxidable.' })
            ]
          }),

          // CAPÍTULO 6: CARPINTERÍAS
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: 'CAPÍTULO 6: CARPINTERÍAS Y ABERTURAS (NORMA CODIFICACIÓN Px, PVx, Vx, OTROS / IRAM 11506)',
                bold: true,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '6.1 PUERTAS - CODIFICACIÓN Px (Unidad: Unid.): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Clasificación norma Px: Incluye 2 Puertas P1 de Ingreso Principal chapa/aluminio inyectado (90x205 cm) + 10 Puertas P2 placa MDF 70x200 cm con marco de chapa B.W.G N° 18 (4 PB + 6 PA). Total: 12 Puertas.' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Amurado a plomo con grapas galvanizadas rellenando interior del marco con mortero 1:3. Calibración de luz perimetral (3mm) y colocación de cerraduras doble paleta / bronce.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '6.2 PUERTAS VENTANAS - CODIFICACIÓN PVx (Unidad: Unid.): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Clasificación norma PVx: Incluye 4 Puertas Ventana PV1 de Aluminio Modena DVH 4/12/4 mm (200x205 cm) para acceso a patio en PB y salida a balcón en PA.' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Premarcos de aluminio amurados previa colocación de umbral impermeabilizado. Fijación de marco con tornillos de acero inox, felpas dobles y sellado elastomérico neutro.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '6.3 VENTANAS - CODIFICACIÓN Vx (Unidad: Unid.): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Clasificación norma Vx: Incluye 4 Ventanas V1 Dormitorios (140x120 cm), 2 Ventanas V2 Cocina (120x90 cm) y 4 Banderitas/Paños Fijos V3 Baños (60x40 cm). Total: 10 Ventanas.' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Montaje sobre premarco nivelado, nivelación con nivel óptico, sellado perimetral con espuma de poliuretano y mastic neutro. Hojas con rodamientos regulables y felpas de hermeticidad.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({ text: '6.4 OTRAS CARPINTERÍAS - CUALQUIER OTRO CÓDIGO (Unidad: Unid.): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Clasificación norma CUALQUIER OTRO CÓDIGO (Bx, Cx, Mx, Ox): Incluye 2 Portones O1 de Garaje Levadizos Automatizados (260x210 cm) de chapa/aluminio con motor eléctrico compensado.' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Fijación de guías laterales de elevación amuradas con tacos expansivos mecánicos, ajuste de resortes de torsión de compensación y programación de central receptora de automatismo.' })
            ]
          }),

          // CAPÍTULO 7: ELECTROMECÁNICA Y DOMÓTICA
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: 'CAPÍTULO 7: INSTALACIONES ELÉCTRICAS, BAJA TENSIÓN Y DOMÓTICA (AEA 90364 / IRAM 2183)',
                bold: true,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({ text: '7.1 BOCAS Y LÍNEAS DE ENERGÍA (Unidad: Boca): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: 'Conductores de cobre antinflama IRAM 2183 (2.5mm² para tomas TUG, 4mm² para TUE y 1.5mm² para retornos). Conteo: 36 Bocas iluminación, 48 Tomas TUG 10A, 8 Tomas TUE 16A para Aire Acondicionado.' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Canaleteado de muros y amurado de caños corrugados ignífugos / hierro semipesado con mortero de yeso/cal. Cableado por tracción manual con lubricante sintético. Empalmes soldados o con bornera en cajas octogonales aislados con cinta autofundente.' })
            ]
          }),
          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({ text: '7.2 BAJA TENSIÓN Y DOMÓTICA (Unidad: Boca / Sistema): ', bold: true, color: '1E3A8A' }),
              new TextRun({ text: '6 Bocas datos UTP Cat6, 4 Sensores PIR alarma, 2 Porteros eléctricos y 2 Módulos inteligentes Wi-Fi para domótica en tableros seccionales.' }),
              new TextRun({ text: '\nProcedimiento Ejecutivo: ', bold: true, italics: true }),
              new TextRun({ text: 'Canalización independiente separada a más de 20cm de líneas de potencia. Montaje de tableros con interruptores termomagnéticos y disyuntor diferencial de 30mA (IRAM 2038).' })
            ]
          }),

          // CAPÍTULO 8: NOTA Y DESPERDICIO
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: 'CAPÍTULO 8: NOTA DE CÓMPUTO COMERCIAL Y DESPERDICIO (5%)',
                bold: true,
                color: '1E3A8A'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'NOTA IMPORTANTE: El Resumen Consolidado de Compras Comerciales ha sido elaborado aplicando un coeficiente de desperdicio y solapes del 5% sobre las cantidades teóricas físicas (basadas en dosajes del Manual de Cómputo y Presupuesto de M. Chandías). Cómputo estimativo previo, sujeto a elaboración pormenorizada posterior por parte de Instalador.'
              })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Pliego_Especificaciones_Tecnicas_${projectTitle.replace(/\s+/g, '_')}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
