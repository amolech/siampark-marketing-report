'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Printer,
  Edit3,
  Save,
  CheckCircle2,
  Globe,
  Trophy,
  Download,
  Upload,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Compass,
  CheckSquare,
  HelpCircle,
  Users,
  Eye,
  MousePointerClick,
  Zap,
  Plus,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  Building2,
  Target,
  AlertTriangle,
  ShieldCheck,
  Filter,
  CalendarRange,
  BarChart3,
  Briefcase,
  Clock,
  Scale,
  Info,
  Calculator,
  Layers,
  ClipboardCheck,
} from 'lucide-react';

export type ObjectiveCategory =
  | 'Reconocimiento / Alcance'
  | 'Tráfico Web / Visitas'
  | 'Interacción / Comunidad'
  | 'Contactos / Mensajes (Leads)'
  | 'Ventas / Conversiones';

type FunnelLevel = 'A. VISIBILIDAD' | 'B. CAPTACIÓN' | 'C. CONVERSIÓN';
type StrategicDecision = 'ESCALAR' | 'MANTENER' | 'OPTIMIZAR' | 'REDUCIR / PAUSAR' | 'SIN COSTE';

interface ObjectiveDefinition {
  unit: string;
  funnelLevel: FunnelLevel;
  shortLabel: string;
  conceptDefinition: string;
  ceoExplanation: string;
  businessPriority: number;
}

const OBJECTIVE_DICTIONARY: Record<ObjectiveCategory, ObjectiveDefinition> = {
  'Reconocimiento / Alcance': {
    unit: 'impactos',
    funnelLevel: 'A. VISIBILIDAD',
    shortLabel: 'Cobertura y recuerdo de marca',
    conceptDefinition:
      'Maximiza el número de personas únicas impactadas en un mercado o zona, priorizando notoriedad frente a la acción inmediata.',
    ceoExplanation:
      'Nivel A (Visibilidad): amplía el alcance de marca al menor coste por impacto; no mide cierre comercial directo.',
    businessPriority: 1,
  },
  'Interacción / Comunidad': {
    unit: 'interacciones',
    funnelLevel: 'A. VISIBILIDAD',
    shortLabel: 'Participación y audiencia propia',
    conceptDefinition:
      'Fomenta seguidores, guardados, comentarios y reproducciones para construir audiencia propia y reducir dependencia futura de pago.',
    ceoExplanation:
      'Nivel A (Visibilidad): consolida comunidad activa en redes sociales; requiere posterior conversión hacia canales propios.',
    businessPriority: 2,
  },
  'Tráfico Web / Visitas': {
    unit: 'clics',
    funnelLevel: 'A. VISIBILIDAD',
    shortLabel: 'Atracción de visitas externas',
    conceptDefinition:
      'Dirige usuarios interesados desde el anuncio hacia la web, catálogo o portal de reservas externo. Un clic no equivale a una venta.',
    ceoExplanation:
      'Nivel A (Visibilidad): mide atracción de visitas hacia la web o sistema de reservas; su rentabilidad depende del cierre posterior.',
    businessPriority: 3,
  },
  'Contactos / Mensajes (Leads)': {
    unit: 'mensajes',
    funnelLevel: 'B. CAPTACIÓN',
    shortLabel: 'Generación de oportunidades comerciales',
    conceptDefinition:
      'Capta solicitudes comerciales, formularios, llamadas o conversaciones directas (WhatsApp/DM) con potenciales clientes.',
    ceoExplanation:
      'Nivel B (Captación): genera oportunidades comerciales activas (CPL). Su calidad depende de la tasa de cierre comercial.',
    businessPriority: 4,
  },
  'Ventas / Conversiones': {
    unit: 'ventas',
    funnelLevel: 'C. CONVERSIÓN',
    shortLabel: 'Transacciones y cierre verificado',
    conceptDefinition:
      'Optimiza la entrega hacia usuarios con alta probabilidad de completar una compra o reserva verificada con valor económico atribuido.',
    ceoExplanation:
      'Nivel C (Conversión): mide transacciones verificadas y ROAS atribuido real sobre la inversión publicitaria.',
    businessPriority: 5,
  },
};

const ALL_OBJECTIVES: ObjectiveCategory[] = [
  'Reconocimiento / Alcance',
  'Tráfico Web / Visitas',
  'Interacción / Comunidad',
  'Contactos / Mensajes (Leads)',
  'Ventas / Conversiones',
];

function normalizeObjectiveCategory(raw: string): ObjectiveCategory {
  if (raw === 'Tráfico Web' || raw === 'Tráfico Web / Visitas') return 'Tráfico Web / Visitas';
  if (raw === 'Mensajes / Leads' || raw === 'Contactos / Mensajes (Leads)')
    return 'Contactos / Mensajes (Leads)';
  if (raw === 'Ventas / Compras' || raw === 'Ventas / Conversiones')
    return 'Ventas / Conversiones';
  if (raw === 'Alcance / Branding' || raw === 'Reconocimiento / Alcance')
    return 'Reconocimiento / Alcance';
  if (raw === 'Interacción / Comunidad') return 'Interacción / Comunidad';
  return 'Tráfico Web / Visitas';
}

interface OrganicChannelRow {
  id: string;
  name: string;
  color: string;
  followers_total: number;
  organic_growth_net: number;
  organic_reach: number;
  web_visits: number;
}

interface PaidCampaignRow {
  id: string;
  platform: string;
  campaign_label: string;
  color: string;
  objective_type: ObjectiveCategory;
  result_unit_label: string;
  paid_reach: number;
  ad_spend: number;
  results_count: number;
  revenue: number;
}

interface MarketSegment {
  id: string;
  group_label: string;
  market_a_name: string;
  market_a_pct: number;
  market_a_color: string;
  market_b_name: string;
  market_b_pct: number;
  market_b_color: string;
}

interface CeoDirective {
  id: string;
  area: string;
  status: 'ESCALAR' | 'MANTENER' | 'OPTIMIZAR' | 'REDUCIR / PAUSAR';
  decision: string;
  rationale_kpi: string;
  control_kpi: string;
  expected_impact: string;
}

interface ClientTemplateReport {
  client_name: string;
  client_subtitle: string;
  logo_data_url: string;
  web_kpi_subtitle: string;
  report_month: string;
  period_label: string;
  target_max_cpa: number;
  target_min_roas: number;
  total_business_revenue: number;
  new_customers_acquired: number;
  customer_ltv: number;
  gross_margin_pct: number;
  avg_monthly_margin_per_customer: number;
  prev_year_web_visits: number;
  prev_year_revenue: number;
  auto_diagnosis: boolean;
  custom_headline: string;
  show_financial_section: boolean;
  show_paid_section: boolean;
  organic_channels: OrganicChannelRow[];
  paid_campaigns: PaidCampaignRow[];
  markets: MarketSegment[];
  competitive_note_title: string;
  competitive_note_text: string;
  directives: CeoDirective[];
}

const STORAGE_KEY = 'agency_ceo_universal_template_v22_master';

const PRESET_COLORS = [
  '#0f172a',
  '#e1306c',
  '#1877f2',
  '#0a66c2',
  '#dc2626',
  '#16a34a',
  '#d97706',
  '#7c3aed',
  '#0891b2',
];

const FIELD_CALCULATION_GUIDE = [
  {
    field: 'Coste Máx. por Resultado (€)',
    block: 'Bloque 1A',
    howToCalculate:
      'Umbral máximo aceptable por acción según el nivel de objetivo: 0,08 € – 0,20 € para clics/mensajes; 5 € – 25 € para ventas verificadas.',
    example: 'Ej: 0.15 (mensajes/clics) o 15 (ventas)',
  },
  {
    field: 'Retorno Mínimo Venta (x)',
    block: 'Bloque 1A',
    howToCalculate:
      'ROAS atribuido mínimo exigido para escalar una campaña de ventas directas (100 ÷ Margen Bruto % × 1,5).',
    example: 'Ej: 4 (exige 4 € atribuidos por cada 1 € invertido)',
  },
  {
    field: 'Facturación Total Caja (€)',
    block: 'Bloque 1B',
    howToCalculate:
      'Ingresos brutos confirmados en el sistema de facturación o CRM del mes (sin puntos de millar; punto solo para céntimos).',
    example: 'Ej: 13208.31 (NO 13.20831)',
  },
  {
    field: 'Clientes Nuevos Captados',
    block: 'Bloque 1B',
    howToCalculate:
      'Compradores o altas nuevas reales registradas por primera vez entre el día 1 y el 31 del mes.',
    example: 'Ej: 175 altas nuevas confirmadas',
  },
  {
    field: 'Valor Total por Cliente (€) [LTV]',
    block: 'Bloque 1B',
    howToCalculate:
      'Ticket medio mensual × Meses medios de permanencia (dato histórico de CRM/TIMP o ticket medio en compra única).',
    example: 'Ej: 125.95 (dato real CRM/TIMP)',
  },
  {
    field: 'Margen Bruto Negocio (%)',
    block: 'Bloque 1B',
    howToCalculate:
      '[(Ingresos − Costes directos del servicio/producto) ÷ Ingresos] × 100. No incluye gastos fijos de estructura ni alquiler.',
    example: 'Ej: 65 (estimación margen bruto 65%)',
  },
  {
    field: 'Margen Bruto Mensual/Cliente (€)',
    block: 'Bloque 1B',
    howToCalculate:
      'Ingreso medio mensual por cliente × (Margen Bruto % ÷ 100). Permite estimar el plazo de recuperación (payback).',
    example: 'Ej: 25,63 € × 0,65 = 16.66',
  },
];

const KPI_LEGEND_ITEMS = [
  {
    category: '1. Rigor Financiero (CFO)',
    color: '#015b9d',
    items: [
      {
        name: 'ROAS Atribuido vs. Ratio Caja / Inv. Ads',
        formula: 'Atribuido: Ventas Ads ÷ Inv. Ads | Descriptivo: Caja Total ÷ Inv. Ads',
        meaning:
          'Nunca se presenta la facturación total de la empresa como ROAS publicitario. Si no hay atribución directa por campaña, se reporta como ratio descriptivo global.',
      },
      {
        name: 'Coste Medio Inv. Ads / Alta',
        formula: 'Inversión Publicitaria Total ÷ Clientes Nuevos Captados',
        meaning:
          'Mide exclusivamente la inversión en medios pagados dividida entre altas nuevas. El CAC global completo requeriría sumar honorarios y costes comerciales.',
      },
      {
        name: 'Margen Bruto Estimado y Payback',
        formula: 'Caja × Margen Bruto % | Payback: Coste Inv./Alta ÷ Margen Mensual/Cliente',
        meaning:
          'Diferencia ingresos brutos de margen bruto estimado (antes de estructura fija) y calcula los meses estimados para amortizar la inversión por alta.',
      },
    ],
  },
  {
    category: '2. Separación por Nivel de Objetivo (CMO)',
    color: '#16a34a',
    items: [
      {
        name: 'Nivel A · Visibilidad',
        formula: 'Alcance, Impresiones, Crecimiento Seguidores, Clics y Sesiones Web',
        meaning:
          'Mide notoriedad y atracción hacia activos digitales. Un clic o visualización nunca se contabiliza como venta ni contacto comercial.',
      },
      {
        name: 'Nivel B · Captación',
        formula: 'Conversaciones WhatsApp, Formularios, Leads y CPL (Inversión ÷ Leads)',
        meaning:
          'Mide oportunidades comerciales iniciadas. Su éxito real depende de la tasa de cierre posterior en recepción o CRM.',
      },
      {
        name: 'Nivel C · Conversión y Rentabilidad',
        formula: 'Compras Verificadas, Altas Nuevas, Ventas Atribuidas y ROAS Real',
        meaning:
          'Mide cierre económico verificado y retorno atribuible demostrable.',
      },
    ],
  },
  {
    category: '3. Gobernanza y Decisiones (CEO)',
    color: '#d97706',
    items: [
      {
        name: 'ESCALAR / MANTENER',
        formula: 'Evidencia comercial demostrada o continuidad controlada',
        meaning:
          'ESCALAR: resultados sólidos con margen de crecimiento. MANTENER: rendimiento estable que requiere continuidad o mayor observación.',
      },
      {
        name: 'OPTIMIZAR / REDUCIR O PAUSAR',
        formula: 'Evaluación por calidad e intención, no solo por CPC bajo',
        meaning:
          'OPTIMIZAR: resultados mejorables con ajustes de segmentación/atribución. REDUCIR/PAUSAR: ineficiencia demostrada o tráfico de baja calidad.',
      },
      {
        name: 'Confirmado vs. Estimación vs. Pendiente',
        formula: 'Auditoría interna de trazabilidad',
        meaning:
          'Identifica expresamente qué cifras provienen de registros verificados, cuáles usan supuestos (ej. margen %) y qué métricas requieren medición.',
      },
    ],
  },
];

const createBlankClientTemplate = (month: string): ClientTemplateReport => ({
  client_name: 'NOMBRE DE LA EMPRESA',
  client_subtitle: 'INFORME EJECUTIVO DE MARKETING, RESULTADOS Y CRECIMIENTO',
  logo_data_url: '',
  web_kpi_subtitle: 'Tráfico web y derivación a canales de reserva',
  report_month: month,
  period_label: `Cierre Mensual · ${month}`,
  target_max_cpa: 1.5,
  target_min_roas: 4.0,
  total_business_revenue: 25000,
  new_customers_acquired: 150,
  customer_ltv: 180,
  gross_margin_pct: 65,
  avg_monthly_margin_per_customer: 40,
  prev_year_web_visits: 0,
  prev_year_revenue: 0,
  auto_diagnosis: true,
  custom_headline: '',
  show_financial_section: true,
  show_paid_section: true,
  organic_channels: [
    {
      id: 'org-ig',
      name: 'Instagram (Orgánico)',
      color: '#e1306c',
      followers_total: 4500,
      organic_growth_net: 210,
      organic_reach: 48000,
      web_visits: 320,
    },
    {
      id: 'org-fb',
      name: 'Facebook (Orgánico)',
      color: '#1877f2',
      followers_total: 2800,
      organic_growth_net: 65,
      organic_reach: 22000,
      web_visits: 180,
    },
    {
      id: 'org-seo',
      name: 'Buscadores / Web Directa (GA4)',
      color: '#16a34a',
      followers_total: 0,
      organic_growth_net: 0,
      organic_reach: 15000,
      web_visits: 950,
    },
  ],
  paid_campaigns: [
    {
      id: 'paid-ventas',
      platform: 'Google Ads',
      campaign_label: 'Búsquedas de Compra Directa',
      color: '#16a34a',
      objective_type: 'Ventas / Conversiones',
      result_unit_label: 'ventas',
      paid_reach: 18500,
      ad_spend: 650,
      results_count: 85,
      revenue: 9800,
    },
    {
      id: 'paid-leads',
      platform: 'Meta Ads (FB/IG)',
      campaign_label: 'Captación de Consultas y Mensajes',
      color: '#1877f2',
      objective_type: 'Contactos / Mensajes (Leads)',
      result_unit_label: 'mensajes',
      paid_reach: 32000,
      ad_spend: 420,
      results_count: 340,
      revenue: 0,
    },
    {
      id: 'paid-trafico',
      platform: 'Meta Ads (FB/IG)',
      campaign_label: 'Visitas a Catálogo / Landing',
      color: '#e1306c',
      objective_type: 'Tráfico Web / Visitas',
      result_unit_label: 'clics',
      paid_reach: 45000,
      ad_spend: 280,
      results_count: 2400,
      revenue: 0,
    },
  ],
  markets: [
    {
      id: 'mkt-1',
      group_label: 'Distribución por Línea de Negocio / Sede',
      market_a_name: 'Línea Principal',
      market_a_pct: 65,
      market_a_color: '#015b9d',
      market_b_name: 'Segunda Línea',
      market_b_pct: 35,
      market_b_color: '#f5b514',
    },
    {
      id: 'mkt-2',
      group_label: 'Perfil de Demanda / Canal de Cierre',
      market_a_name: 'Cierre Digital / Online',
      market_a_pct: 78,
      market_a_color: '#16a34a',
      market_b_name: 'Atención Directa / Presencial',
      market_b_pct: 22,
      market_b_color: '#0f172a',
    },
  ],
  competitive_note_title: 'Auditoría de Atribución y Calidad de Datos',
  competitive_note_text:
    'Separación estricta entre clics publicitarios, sesiones web (GA4) y altas confirmadas en CRM. Los ratios globales sin etiquetado individual se reportan como indicadores descriptivos.',
  directives: [
    {
      id: 'dir-1',
      area: '1. Escalar Captación de Alta Intención',
      status: 'ESCALAR',
      decision:
        'Incrementar presupuesto de forma gradual en las campañas de captación con CPL validado y capacidad operativa de cierre.',
      rationale_kpi: 'CPL eficiente y volumen constante de oportunidades comerciales.',
      control_kpi: 'CPL (€) y tasa de conversión de lead a cliente en CRM.',
      expected_impact: '+20% oportunidades comerciales cualificadas (objetivo propuesto).',
    },
    {
      id: 'dir-2',
      area: '2. Implementar Trazabilidad en CRM / Web',
      status: 'OPTIMIZAR',
      decision:
        'Registrar el canal de procedencia en cada alta nueva y configurar conversiones offline para medir ROAS atribuido real.',
      rationale_kpi: 'Actualmente el retorno de caja es descriptivo global sin atribución por anuncio.',
      control_kpi: '% de altas nuevas con canal atribuido verificado.',
      expected_impact: '>90% de trazabilidad en altas del próximo período.',
    },
    {
      id: 'dir-3',
      area: '3. Consolidar Posicionamiento Orgánico',
      status: 'MANTENER',
      decision:
        'Sostener la cadencia editorial y optimización SEO local para proteger la captación recurrente sin coste por clic.',
      rationale_kpi: 'Aporte estable de visitas orgánicas gratuitas.',
      control_kpi: 'Sesiones orgánicas (GA4) y posición media en Search Console.',
      expected_impact: 'Mantener >50% de tráfico gratuito sobre el total web.',
    },
  ],
});

const EXTRACTION_PLATFORM_GUIDE = [
  {
    platform: '1. Redes Sociales (Nivel A · Orgánico)',
    color: '#e1306c',
    steps: [
      'Extrae seguidores totales, saldo neto del mes (altas − bajas) e impresiones orgánicas sin promoción.',
      'En clics al enlace, separa los clics orgánicos de los clics procedentes de campañas de pago para no duplicar métricas.',
    ],
  },
  {
    platform: '2. Publicidad de Pago (Niveles A, B y C)',
    color: '#1877f2',
    steps: [
      'Clasifica cada campaña según su objetivo real: Visibilidad (Alcance/Tráfico), Captación (Mensajes/Leads) o Conversión (Ventas).',
      'Solo rellena la columna Ventas (€) cuando existan compras verificadas atribuidas directamente a esa campaña.',
    ],
  },
  {
    platform: '3. Analítica Web (GA4 y Search Console)',
    color: '#16a34a',
    steps: [
      'GA4 → Adquisición de tráfico: suma Organic Search + Direct para medir sesiones web gratuitas reales.',
      'Search Console: extrae impresiones orgánicas, clics y posición media en Google.',
    ],
  },
  {
    platform: '4. Caja y CRM (Rigor Financiero)',
    color: '#0f172a',
    steps: [
      'Facturación Total Caja (€) y Clientes Nuevos: datos confirmados de cierre mensual en CRM/TIMP.',
      'Margen Bruto (%): estimación sobre costes directos (no confundir con beneficio neto final tras gastos fijos).',
    ],
  },
];

function sanitizeLoadedReport(raw: ClientTemplateReport, fallbackMonth: string): ClientTemplateReport {
  const base = createBlankClientTemplate(fallbackMonth);
  return {
    ...base,
    ...raw,
    show_financial_section:
      typeof raw.show_financial_section === 'boolean' ? raw.show_financial_section : true,
    paid_campaigns: (raw.paid_campaigns || base.paid_campaigns).map((c) => {
      const normalizedObj = normalizeObjectiveCategory(String(c.objective_type || ''));
      return {
        ...c,
        objective_type: normalizedObj,
        result_unit_label: c.result_unit_label || OBJECTIVE_DICTIONARY[normalizedObj].unit,
      };
    }),
    directives: (raw.directives || base.directives).map((d) => {
      const rawStatus = String(d.status || 'MANTENER');
      const validStatus: CeoDirective['status'] =
        rawStatus === 'ESCALAR' ||
        rawStatus === 'MANTENER' ||
        rawStatus === 'OPTIMIZAR' ||
        rawStatus === 'REDUCIR / PAUSAR'
          ? rawStatus
          : rawStatus === 'CORREGIR'
            ? 'OPTIMIZAR'
            : 'MANTENER';
      return {
        ...d,
        status: validStatus,
        rationale_kpi: d.rationale_kpi || 'Respaldado por indicadores de eficiencia del período.',
        control_kpi: d.control_kpi || 'Seguimiento semanal en cuadro de mando.',
      };
    }),
  };
}

function formatCompact(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 10_000) return `${(val / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat('es-ES').format(Math.round(val));
}

function formatEur(val: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: val > 0 && val < 100 ? 2 : 0,
  }).format(val);
}

function calcYoY(current: number, previous: number): number | null {
  if (!previous || previous <= 0) return null;
  return ((current - previous) / previous) * 100;
}

export default function CeoExecutiveCleanReportPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-10');
  const [reportsMap, setReportsMap] = useState<Record<string, ClientTemplateReport>>({
    '2026-10': createBlankClientTemplate('2026-10'),
  });
  const [draft, setDraft] = useState<ClientTemplateReport>(createBlankClientTemplate('2026-10'));
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showKpiLegend, setShowKpiLegend] = useState<boolean>(false);
  const [showFieldFormulaLegend, setShowFieldFormulaLegend] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const jsonInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, ClientTemplateReport>;
        const sanitizedMap: Record<string, ClientTemplateReport> = {};
        Object.keys(parsed).forEach((k) => {
          sanitizedMap[k] = sanitizeLoadedReport(parsed[k], k);
        });
        if (Object.keys(sanitizedMap).length > 0) {
          setReportsMap(sanitizedMap);
          const firstKey = sanitizedMap['2026-10'] ? '2026-10' : Object.keys(sanitizedMap)[0];
          setSelectedMonth(firstKey);
          setDraft(sanitizedMap[firstKey]);
        }
      }
    } catch {
      // Ignorar
    }
  }, []);

  const handleSelectMonth = (m: string) => {
    setSelectedMonth(m);
    setLogoError(false);
    setDraft(
      reportsMap[m]
        ? reportsMap[m]
        : {
            ...draft,
            report_month: m,
            period_label: `Cierre Mensual · ${m}`,
          }
    );
  };

  const handleNewBlankClient = () => {
    setLogoError(false);
    setDraft(createBlankClientTemplate(selectedMonth));
    setEditMode(true);
    setToast('Plantilla ejecutiva en blanco lista');
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogoError(false);
      setDraft((prev) => ({
        ...prev,
        logo_data_url: String(reader.result || ''),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...reportsMap, [selectedMonth]: draft };
    setReportsMap(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignorar
    }
    setEditMode(false);
    setToast('Informe Ejecutivo auditado y guardado');
    setTimeout(() => setToast(null), 3000);
  };

  const handleExportJson = () => {
    const safeClient = draft.client_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const blob = new Blob([JSON.stringify({ [selectedMonth]: draft }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Informe-Ejecutivo-${safeClient || 'cliente'}-${selectedMonth}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result)) as Record<string, ClientTemplateReport>;
        const firstKey = Object.keys(imported)[0];
        if (firstKey && imported[firstKey]) {
          setLogoError(false);
          setSelectedMonth(firstKey);
          const loaded = sanitizeLoadedReport(imported[firstKey], firstKey);
          setDraft(loaded);
          const merged = { ...reportsMap, [firstKey]: loaded };
          setReportsMap(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          setToast('Datos del cliente cargados y validados');
          setTimeout(() => setToast(null), 3000);
        }
      } catch {
        alert('El archivo JSON no es válido.');
      }
    };
    reader.readAsText(file);
  };

  // CRUD Bloque A
  const handleAddOrganic = () => {
    const nextColor = PRESET_COLORS[draft.organic_channels.length % PRESET_COLORS.length];
    setDraft((prev) => ({
      ...prev,
      organic_channels: [
        ...prev.organic_channels,
        {
          id: `org-${Date.now()}`,
          name: 'Nuevo Canal',
          color: nextColor,
          followers_total: 0,
          organic_growth_net: 0,
          organic_reach: 0,
          web_visits: 0,
        },
      ],
    }));
  };

  const handleRemoveOrganic = (id: string) => {
    if (draft.organic_channels.length <= 1) return;
    setDraft((prev) => ({
      ...prev,
      organic_channels: prev.organic_channels.filter((c) => c.id !== id),
    }));
  };

  const updateOrganicField = <K extends keyof OrganicChannelRow>(
    id: string,
    field: K,
    value: OrganicChannelRow[K]
  ) => {
    setDraft((prev) => ({
      ...prev,
      organic_channels: prev.organic_channels.map((ch) =>
        ch.id === id ? { ...ch, [field]: value } : ch
      ),
    }));
  };

  // CRUD Bloque B
  const handleAddPaid = () => {
    const nextColor = PRESET_COLORS[draft.paid_campaigns.length % PRESET_COLORS.length];
    const defaultObj: ObjectiveCategory = 'Contactos / Mensajes (Leads)';
    setDraft((prev) => ({
      ...prev,
      paid_campaigns: [
        ...prev.paid_campaigns,
        {
          id: `paid-${Date.now()}`,
          platform: 'Plataforma Ads',
          campaign_label: 'Nueva Campaña',
          color: nextColor,
          objective_type: defaultObj,
          result_unit_label: OBJECTIVE_DICTIONARY[defaultObj].unit,
          paid_reach: 0,
          ad_spend: 0,
          results_count: 0,
          revenue: 0,
        },
      ],
    }));
  };

  const handleRemovePaid = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      paid_campaigns: prev.paid_campaigns.filter((c) => c.id !== id),
    }));
  };

  const updatePaidField = <K extends keyof PaidCampaignRow>(
    id: string,
    field: K,
    value: PaidCampaignRow[K]
  ) => {
    setDraft((prev) => ({
      ...prev,
      paid_campaigns: prev.paid_campaigns.map((camp) => {
        if (camp.id !== id) return camp;
        if (field === 'objective_type') {
          const objCat = normalizeObjectiveCategory(String(value));
          return {
            ...camp,
            objective_type: objCat,
            result_unit_label: OBJECTIVE_DICTIONARY[objCat].unit,
          };
        }
        return { ...camp, [field]: value };
      }),
    }));
  };

  // CRUD Mercados
  const handleAddMarket = () => {
    setDraft((prev) => ({
      ...prev,
      markets: [
        ...prev.markets,
        {
          id: `mkt-${Date.now()}`,
          group_label: 'Nuevo Segmento / Canal',
          market_a_name: 'Segmento A',
          market_a_pct: 60,
          market_a_color: '#015b9d',
          market_b_name: 'Segmento B',
          market_b_pct: 40,
          market_b_color: '#f5b514',
        },
      ],
    }));
  };

  const handleRemoveMarket = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      markets: prev.markets.filter((m) => m.id !== id),
    }));
  };

  const updateMarketField = <K extends keyof MarketSegment>(
    id: string,
    field: K,
    value: MarketSegment[K]
  ) => {
    setDraft((prev) => ({
      ...prev,
      markets: prev.markets.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    }));
  };

  // CRUD Directivas
  const handleAddDirective = () => {
    const num = draft.directives.length + 1;
    setDraft((prev) => ({
      ...prev,
      directives: [
        ...prev.directives,
        {
          id: `dir-${Date.now()}`,
          area: `${num}. Nueva Acción Estratégica`,
          status: 'OPTIMIZAR',
          decision: 'Acción concreta recomendada para el siguiente período.',
          rationale_kpi: 'Indicador del período que justifica la medida.',
          control_kpi: 'KPI de seguimiento para validar impacto.',
          expected_impact: 'Objetivo propuesto (no garantizado).',
        },
      ],
    }));
  };

  const handleRemoveDirective = (id: string) => {
    if (draft.directives.length <= 1) return;
    setDraft((prev) => ({
      ...prev,
      directives: prev.directives.filter((d) => d.id !== id),
    }));
  };

  const updateDirective = (id: string, field: keyof CeoDirective, val: string) => {
    setDraft((prev) => ({
      ...prev,
      directives: prev.directives.map((d) =>
        d.id === id ? ({ ...d, [field]: val } as CeoDirective) : d
      ),
    }));
  };

  // =========================================================================
  // MOTOR DE AUDITORÍA FINANCIERA Y CLASIFICACIÓN POR NIVELES (CFO/CMO/CEO)
  // =========================================================================
  const summary = useMemo(() => {
    const orgList = draft.organic_channels;
    const paidList = draft.paid_campaigns;

    // Nivel A: Visibilidad Orgánica
    const totalFollowers = orgList.reduce((s, n) => s + Number(n.followers_total || 0), 0);
    const totalOrganicGrowth = orgList.reduce((s, n) => s + Number(n.organic_growth_net || 0), 0);
    const totalOrganicReach = orgList.reduce((s, n) => s + Number(n.organic_reach || 0), 0);
    const totalOrganicWebVisits = orgList.reduce((s, n) => s + Number(n.web_visits || 0), 0);

    // Publicidad de Pago
    const totalPaidReach = draft.show_paid_section
      ? paidList.reduce((s, n) => s + Number(n.paid_reach || 0), 0)
      : 0;
    const totalAdSpend = draft.show_paid_section
      ? paidList.reduce((s, n) => s + Number(n.ad_spend || 0), 0)
      : 0;
    const totalAttributedRevenue = draft.show_paid_section
      ? paidList.reduce((s, n) => s + Number(n.revenue || 0), 0)
      : 0;

    const totalPaidTrafficClicks = draft.show_paid_section
      ? paidList
          .filter((p) => p.objective_type === 'Tráfico Web / Visitas')
          .reduce((s, p) => s + Number(p.results_count || 0), 0)
      : 0;

    // Nivel B: Captación Comercial (Leads / Mensajes)
    const totalLeadsCaptured = draft.show_paid_section
      ? paidList
          .filter((p) => p.objective_type === 'Contactos / Mensajes (Leads)')
          .reduce((s, p) => s + Number(p.results_count || 0), 0)
      : 0;
    const totalLeadsSpend = draft.show_paid_section
      ? paidList
          .filter((p) => p.objective_type === 'Contactos / Mensajes (Leads)')
          .reduce((s, p) => s + Number(p.ad_spend || 0), 0)
      : 0;
    const avgCostPerLead =
      totalLeadsCaptured > 0 && totalLeadsSpend > 0 ? totalLeadsSpend / totalLeadsCaptured : 0;

    // Nivel C: Conversión Verificada
    const totalVerifiedSalesCount = draft.show_paid_section
      ? paidList
          .filter((p) => p.objective_type === 'Ventas / Conversiones')
          .reduce((s, p) => s + Number(p.results_count || 0), 0)
      : 0;

    const totalAllWebTraffic = totalOrganicWebVisits + totalPaidTrafficClicks;

    // Rigor Financiero CFO: Distinción entre ROAS Atribuido vs. Ratio Descriptivo Caja/Inversión
    const bizRevenue = Number(draft.total_business_revenue || 0);
    const hasAttributedRevenue = totalAttributedRevenue > 0;
    const attributedRoas =
      totalAdSpend > 0 && hasAttributedRevenue ? totalAttributedRevenue / totalAdSpend : 0;
    const descriptiveCashRatio =
      totalAdSpend > 0 && bizRevenue > 0 ? bizRevenue / totalAdSpend : 0;

    const newCustomers = Number(draft.new_customers_acquired || 0);
    const ltv = Number(draft.customer_ltv || 0);
    const marginPct = Number(draft.gross_margin_pct || 0);
    const monthlyMarginPerCust = Number(draft.avg_monthly_margin_per_customer || 0);

    // Coste medio de inversión publicitaria por nuevo cliente (no confundir con CAC global con estructura)
    const adSpendPerNewCustomer =
      totalAdSpend > 0 && newCustomers > 0 ? totalAdSpend / newCustomers : 0;
    const ltvToAdSpendRatio =
      adSpendPerNewCustomer > 0 && ltv > 0 ? ltv / adSpendPerNewCustomer : 0;

    // Margen bruto estimado (nunca llamado beneficio neto final sin descontar estructura)
    const estimatedGrossMarginEur = bizRevenue * (marginPct / 100);
    const estimatedPaybackMonths =
      adSpendPerNewCustomer > 0 && monthlyMarginPerCust > 0
        ? adSpendPerNewCustomer / monthlyMarginPerCust
        : 0;

    const freeTrafficSharePct =
      totalAllWebTraffic > 0 ? (totalOrganicWebVisits / totalAllWebTraffic) * 100 : 100;

    const webVisitsYoY = calcYoY(totalAllWebTraffic, Number(draft.prev_year_web_visits || 0));
    const revenueYoY = calcYoY(bizRevenue, Number(draft.prev_year_revenue || 0));

    // Canales orgánicos enriquecidos
    const enrichedOrgList = [...orgList]
      .map((ch) => ({
        ...ch,
        webSharePct:
          totalOrganicWebVisits > 0
            ? (Number(ch.web_visits || 0) / totalOrganicWebVisits) * 100
            : 0,
      }))
      .sort((a, b) => b.web_visits - a.web_visits);

    // Entradas web / derivaciones por canal (Orgánico vs. Pago)
    const unifiedTrafficSources = [
      ...orgList
        .filter((n) => Number(n.web_visits || 0) > 0)
        .map((n) => ({
          id: n.id,
          name: n.name,
          type: 'ORGÁNICO' as const,
          color: n.color,
          visits: Number(n.web_visits || 0),
          spend: 0,
        })),
      ...(draft.show_paid_section
        ? paidList
            .filter(
              (p) => p.objective_type === 'Tráfico Web / Visitas' && Number(p.results_count || 0) > 0
            )
            .map((p) => ({
              id: p.id,
              name: `${p.platform} · ${p.campaign_label}`,
              type: 'PAGO' as const,
              color: p.color,
              visits: Number(p.results_count || 0),
              spend: Number(p.ad_spend || 0),
            }))
        : []),
    ]
      .map((item) => ({
        ...item,
        sharePct: totalAllWebTraffic > 0 ? (item.visits / totalAllWebTraffic) * 100 : 0,
      }))
      .sort((a, b) => b.visits - a.visits);

    // Auditoría de campañas con las 4 decisiones del Prompt Maestro
    const evaluatedPaid = paidList.map((camp) => {
      const spend = Number(camp.ad_spend || 0);
      const results = Number(camp.results_count || 0);
      const rev = Number(camp.revenue || 0);
      const def = OBJECTIVE_DICTIONARY[camp.objective_type];

      const unitCost = spend > 0 && results > 0 ? spend / results : 0;
      const campaignRoas = spend > 0 && rev > 0 ? rev / spend : 0;
      const avgTicket = rev > 0 && results > 0 ? rev / results : 0;

      const isLowQualityPlacement =
        camp.platform.toLowerCase().includes('audience network') ||
        camp.campaign_label.toLowerCase().includes('audience network');

      let verdict: StrategicDecision = 'SIN COSTE';
      let reason = 'Sin inversión asignada en el período.';

      if (spend > 0) {
        if (results === 0 && rev === 0) {
          verdict = 'REDUCIR / PAUSAR';
          reason = `Gasto de ${formatEur(spend)} sin conversiones ni resultados verificados.`;
        } else if (rev > 0 && campaignRoas < 1) {
          verdict = 'REDUCIR / PAUSAR';
          reason = `ROAS atribuido insuficiente (${campaignRoas.toFixed(2)}x < 1,0x).`;
        } else if (isLowQualityPlacement) {
          verdict = 'REDUCIR / PAUSAR';
          reason = `Ubicación externa (${unitCost.toFixed(3)} €/clic) con menor intención comercial que Feed/Reels.`;
        } else if (
          camp.objective_type === 'Ventas / Conversiones' &&
          rev > 0 &&
          campaignRoas >= draft.target_min_roas
        ) {
          verdict = 'ESCALAR';
          reason = `ROAS atribuido ${campaignRoas.toFixed(2)}x (≥ ${draft.target_min_roas}x) · Ticket medio ${formatEur(avgTicket)}.`;
        } else if (
          camp.objective_type === 'Contactos / Mensajes (Leads)' &&
          draft.target_max_cpa > 0 &&
          unitCost <= draft.target_max_cpa
        ) {
          verdict = 'ESCALAR';
          reason = `Captación directa eficiente (${unitCost.toFixed(2)} € por ${camp.result_unit_label.replace(/s$/, '')}); validar cierre en CRM.`;
        } else if (
          camp.objective_type === 'Contactos / Mensajes (Leads)' &&
          unitCost > draft.target_max_cpa
        ) {
          verdict = 'OPTIMIZAR';
          reason = `CPL de ${unitCost.toFixed(2)} € superior al umbral general (${draft.target_max_cpa} €); revisar intención comercial antes de penalizar.`;
        } else if (
          camp.objective_type === 'Tráfico Web / Visitas' ||
          camp.objective_type === 'Interacción / Comunidad' ||
          camp.objective_type === 'Reconocimiento / Alcance'
        ) {
          verdict = 'MANTENER';
          reason = `Visibilidad/atracción a ${unitCost > 0 ? `${unitCost.toFixed(3)} €/ud` : 'bajo coste'}; no confundir clics con ventas.`;
        } else {
          verdict = 'OPTIMIZAR';
          reason = 'Rendimiento intermedio; requiere mejorar trazabilidad o página de destino.';
        }
      }

      return {
        ...camp,
        funnelLevel: def.funnelLevel,
        priority: def.businessPriority,
        unitCost,
        campaignRoas,
        avgTicket,
        verdict,
        reason,
      };
    });

    // Agrupación por los 3 Niveles de Objetivo (A. Visibilidad, B. Captación, C. Conversión)
    const funnelLevelsSummary = (['A. VISIBILIDAD', 'B. CAPTACIÓN', 'C. CONVERSIÓN'] as FunnelLevel[]).map(
      (lvl) => {
        const camps = draft.show_paid_section
          ? evaluatedPaid.filter((c) => c.funnelLevel === lvl && (c.ad_spend > 0 || c.results_count > 0))
          : [];
        const spend = camps.reduce((s, c) => s + c.ad_spend, 0);
        const results = camps.reduce((s, c) => s + c.results_count, 0);
        const rev = camps.reduce((s, c) => s + c.revenue, 0);
        return {
          level: lvl,
          campaignsCount: camps.length,
          spend,
          results,
          rev,
          avgCost: spend > 0 && results > 0 ? spend / results : 0,
        };
      }
    );

    // Respuestas a las 3 Preguntas del Resumen Ejecutivo (Prompt Maestro §2)
    const activeSpendCampaigns = draft.show_paid_section
      ? evaluatedPaid.filter((c) => c.ad_spend > 0)
      : [];
    const reduceCampaigns = activeSpendCampaigns.filter((c) => c.verdict === 'REDUCIR / PAUSAR');
    const optimizeCampaigns = activeSpendCampaigns.filter((c) => c.verdict === 'OPTIMIZAR');
    const scaleCampaigns = [...activeSpendCampaigns]
      .filter((c) => c.verdict === 'ESCALAR')
      .sort((a, b) => b.priority - a.priority);

    // 1. ¿Qué hemos conseguido?
    const achievedText =
      draft.show_financial_section && bizRevenue > 0
        ? `Facturación confirmada de ${formatEur(bizRevenue)} y ${formatCompact(
            newCustomers
          )} clientes nuevos con ${formatEur(totalAdSpend)} invertidos en publicidad${
            hasAttributedRevenue
              ? ` (ROAS atribuido de ${attributedRoas.toFixed(2)}x sobre ${formatEur(
                  totalAttributedRevenue
                )} atribuidos)`
              : totalAdSpend > 0
                ? ` (ratio descriptivo de ${descriptiveCashRatio.toFixed(
                    2
                  )}x caja/inversión; coste medio de inversión de ${formatEur(
                    adSpendPerNewCustomer
                  )}/alta)`
                : ''
          }, además de ${formatCompact(totalLeadsCaptured)} contactos/mensajes y ${formatCompact(
            totalOrganicReach
          )} visualizaciones orgánicas.`
        : `Comunidad de ${formatCompact(totalFollowers)} seguidores (+${formatCompact(
            totalOrganicGrowth
          )} netos), ${formatCompact(totalOrganicReach)} visualizaciones gratuitas y ${formatCompact(
            totalAllWebTraffic
          )} visitas/derivaciones web${
            totalLeadsCaptured > 0 ? ` más ${formatCompact(totalLeadsCaptured)} consultas captadas` : ''
          }.`;

    // 2. ¿Qué está funcionando?
    let workingText = '';
    if (scaleCampaigns.length > 0) {
      const top = scaleCampaigns[0];
      workingText = `${top.platform} (${top.campaign_label}) lidera en ${top.funnelLevel} con ${formatCompact(
        top.results_count
      )} ${top.result_unit_label} a ${top.unitCost.toFixed(2)} €/ud. `;
    }
    if (enrichedOrgList[0] && enrichedOrgList[0].web_visits > 0) {
      workingText += `En orgánico, ${enrichedOrgList[0].name} aporta ${formatCompact(
        enrichedOrgList[0].web_visits
      )} visitas gratuitas (${enrichedOrgList[0].webSharePct.toFixed(1)}% del orgánico).`;
    }

    // 3. ¿Qué debemos mejorar?
    const improveList: string[] = [];
    if (!hasAttributedRevenue && draft.show_financial_section && totalAdSpend > 0) {
      improveList.push(
        'Implementar atribución de origen en CRM/TIMP para vincular cada alta nueva con su campaña (ROAS atribuido pendiente).'
      );
    }
    if (reduceCampaigns.length > 0) {
      const wasted = reduceCampaigns.reduce((s, c) => s + c.ad_spend, 0);
      improveList.push(
        `Pausar o reducir ${reduceCampaigns.map((c) => c.platform).join(', ')} (${formatEur(
          wasted
        )} con baja eficiencia o intención).`
      );
    }
    if (optimizeCampaigns.length > 0) {
      improveList.push(
        `Optimizar ${optimizeCampaigns.map((c) => `${c.platform} (${c.campaign_label})`).join(', ')}.`
      );
    }
    const improveText =
      improveList.length > 0
        ? improveList.join(' ')
        : 'Mantener disciplina de medición y validar calidad comercial de los contactos captados.';

    // Donut balance web
    let startPct = 0;
    const webTrafficDonut = [
      {
        id: 'donut-paid',
        name: 'Clics Tráfico Pago (Anuncios)',
        color: '#015b9d',
        visits: totalPaidTrafficClicks,
        pct: totalAllWebTraffic > 0 ? (totalPaidTrafficClicks / totalAllWebTraffic) * 100 : 0,
      },
      {
        id: 'donut-org',
        name: 'Visitas Orgánicas (Gratuitas)',
        color: '#16a34a',
        visits: totalOrganicWebVisits,
        pct: totalAllWebTraffic > 0 ? (totalOrganicWebVisits / totalAllWebTraffic) * 100 : 0,
      },
    ]
      .filter((d) => d.visits > 0)
      .map((d) => {
        const seg = { ...d, start: startPct };
        startPct += d.pct;
        return seg;
      });

    // Cuadro de Mando Final para Dirección (Separando Confirmados, Estimaciones y Pendientes)
    const executiveScorecard = [
      ...(draft.show_financial_section
        ? [
            {
              area: 'Negocio · Caja',
              kpi: 'Facturación Total Caja',
              value: bizRevenue > 0 ? formatEur(bizRevenue) : 'No disponible',
              category: 'CONFIRMADO' as const,
              status: bizRevenue > 0 ? 'Favorable' : 'Pendiente',
              note: 'Ingresos brutos cerrados en CRM/facturación.',
            },
            {
              area: 'Negocio · Altas',
              kpi: 'Nuevos Clientes Compradores',
              value: newCustomers > 0 ? `${formatCompact(newCustomers)} altas` : 'No disponible',
              category: 'CONFIRMADO' as const,
              status: newCustomers > 0 ? 'Favorable' : 'Pendiente',
              note: 'Altas únicas verificadas en el período.',
            },
            {
              area: 'Finanzas · Margen',
              kpi: `Margen Bruto Estimado (${marginPct}%)`,
              value: bizRevenue > 0 ? formatEur(estimatedGrossMarginEur) : 'No disponible',
              category: 'ESTIMACIÓN' as const,
              status: 'Referencia operativa',
              note: 'Descuenta costes directos; no incluye estructura fija.',
            },
            {
              area: 'Finanzas · Payback',
              kpi: 'Plazo Recuperación Inv. Ads',
              value:
                estimatedPaybackMonths > 0
                  ? `${estimatedPaybackMonths.toFixed(2)} meses`
                  : 'Pendiente',
              category: 'ESTIMACIÓN' as const,
              status: estimatedPaybackMonths > 0 && estimatedPaybackMonths <= 1 ? 'Óptimo (<1 mes)' : 'Controlado',
              note: 'Coste Inv./Alta ÷ Margen bruto mensual por cliente.',
            },
          ]
        : []),
      ...(draft.show_paid_section
        ? [
            {
              area: 'Publicidad · Gasto',
              kpi: 'Inversión Publicitaria Total',
              value: formatEur(totalAdSpend),
              category: 'CONFIRMADO' as const,
              status: 'Controlado',
              note: 'Suma auditada de plataformas publicitarias activas.',
            },
            {
              area: 'Publicidad · Retorno',
              kpi: hasAttributedRevenue
                ? 'ROAS Atribuido Real'
                : 'Ratio Caja Total / Inversión Ads',
              value: hasAttributedRevenue
                ? `${attributedRoas.toFixed(2)}x`
                : descriptiveCashRatio > 0
                  ? `${descriptiveCashRatio.toFixed(2)}x (Descriptivo)`
                  : 'No disponible',
              category: hasAttributedRevenue ? ('CONFIRMADO' as const) : ('PENDIENTE MEDICIÓN' as const),
              status: hasAttributedRevenue ? 'Demostrado' : 'Sin atribución directa',
              note: hasAttributedRevenue
                ? 'Ventas atribuidas a anuncios ÷ Inversión.'
                : 'Indicador descriptivo global; falta etiquetado de cierre por anuncio.',
            },
            {
              area: 'Captación · Leads',
              kpi: 'Oportunidades Comerciales (Nivel B)',
              value:
                totalLeadsCaptured > 0
                  ? `${formatCompact(totalLeadsCaptured)} leads (${avgCostPerLead.toFixed(2)} € CPL)`
                  : '0 leads directos',
              category: 'CONFIRMADO' as const,
              status: totalLeadsCaptured > 0 ? 'Favorable' : 'En observación',
              note: 'Conversaciones WhatsApp, formularios y contactos verificados.',
            },
          ]
        : []),
      {
        area: 'Orgánico · Comunidad',
        kpi: 'Comunidad Propia y Crecimiento',
        value: `${formatCompact(totalFollowers)} (+${formatCompact(totalOrganicGrowth)}/mes)`,
        category: 'CONFIRMADO' as const,
        status: totalOrganicGrowth > 0 ? 'Crecimiento positivo' : 'Estable',
        note: 'Saldo neto (altas − bajas) en canales propios.',
      },
      {
        area: 'Orgánico · Tráfico',
        kpi: 'Visitas / Derivaciones Gratuitas',
        value: `${formatCompact(totalOrganicWebVisits)} (${freeTrafficSharePct.toFixed(1)}% del total)`,
        category: 'CONFIRMADO' as const,
        status: 'Favorable',
        note: 'Tráfico orgánico social, buscadores y directo sin coste CPC.',
      },
    ];

    return {
      orgList,
      enrichedOrgList,
      unifiedTrafficSources,
      evaluatedPaid,
      activeSpendCampaigns,
      funnelLevelsSummary,
      totalFollowers,
      totalOrganicGrowth,
      totalOrganicReach,
      totalOrganicWebVisits,
      totalPaidTrafficClicks,
      totalLeadsCaptured,
      avgCostPerLead,
      totalVerifiedSalesCount,
      totalAllWebTraffic,
      webVisitsYoY,
      totalPaidReach,
      totalAdSpend,
      totalAttributedRevenue,
      hasAttributedRevenue,
      attributedRoas,
      descriptiveCashRatio,
      bizRevenue,
      revenueYoY,
      newCustomers,
      adSpendPerNewCustomer,
      ltvToAdSpendRatio,
      estimatedGrossMarginEur,
      estimatedPaybackMonths,
      freeTrafficSharePct,
      achievedText,
      workingText,
      improveText,
      hasAlert: reduceCampaigns.length > 0 || !hasAttributedRevenue,
      webTrafficDonut,
      executiveScorecard,
    };
  }, [draft]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#0f172a] p-3 sm:p-6">
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          #ceo-visual-report {
            box-shadow: none !important;
            border: none !important;
            max-width: 100% !important;
            padding: 0 !important;
          }
          .print-keep {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .print-page-break {
            break-before: page !important;
            page-break-before: always !important;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-4">
        {/* BARRA SUPERIOR DE GESTIÓN (Oculta al imprimir) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-2.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase text-slate-700">Mes:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => handleSelectMonth(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-extrabold text-slate-900"
            />

            <button
              type="button"
              onClick={handleNewBlankClient}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#015b9d]" />
              <span>Nuevo Cliente en Blanco</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowKpiLegend((p) => !p);
                setShowGuide(false);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold cursor-pointer ${
                showKpiLegend
                  ? 'bg-slate-900 text-[#f5b514] border-slate-900'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Leyenda de KPIs y Metodología</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowGuide((p) => !p);
                setShowKpiLegend(false);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold cursor-pointer ${
                showGuide
                  ? 'bg-[#015b9d] text-white border-[#015b9d]'
                  : 'bg-sky-50 hover:bg-sky-100 text-[#015b9d] border-sky-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Cómo Sacar los Datos</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  show_financial_section: !prev.show_financial_section,
                }))
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
            >
              {draft.show_financial_section ? (
                <ToggleRight className="w-4 h-4 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-slate-400" />
              )}
              <span>Datos de Caja {draft.show_financial_section ? 'Visibles' : 'Ocultos'}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setDraft((prev) => ({ ...prev, show_paid_section: !prev.show_paid_section }))
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
            >
              {draft.show_paid_section ? (
                <ToggleRight className="w-4 h-4 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-slate-400" />
              )}
              <span>Publicidad de Pago {draft.show_paid_section ? 'Visible' : 'Oculta'}</span>
            </button>

            {toast && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> {toast}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setEditMode((p) => !p)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f5b514] hover:bg-[#ffcd02] text-slate-950 text-xs font-black cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editMode ? 'Cerrar Editor' : 'Editar Datos y Finanzas'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Guardar JSON</span>
            </button>

            <button
              type="button"
              onClick={() => jsonInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Cargar JSON</span>
            </button>
            <input
              ref={jsonInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportJson}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-extrabold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#f5b514]" />
              <span>Exportar PDF (3 Páginas)</span>
            </button>
          </div>
        </div>

        {/* PANEL DESPLEGABLE: LEYENDA DE KPIs Y RIGOR FINANCIERO */}
        {showKpiLegend && (
          <div className="no-print bg-white p-5 rounded-3xl border-2 border-[#f5b514] shadow-md space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#ed6723]" />
                <h2 className="text-sm font-black text-slate-900">
                  Metodología Ejecutiva: Rigor Financiero, Niveles de Objetivo y Criterios de Decisión
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowKpiLegend(false)}
                className="text-xs font-bold text-slate-500 hover:text-black cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {KPI_LEGEND_ITEMS.map((group) => (
                <div
                  key={group.category}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div
                    className="text-xs font-black uppercase tracking-wider"
                    style={{ color: group.color }}
                  >
                    {group.category}
                  </div>
                  <div className="space-y-2.5">
                    {group.items.map((kpi) => (
                      <div
                        key={kpi.name}
                        className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1"
                      >
                        <div className="font-black text-slate-950 text-[11px]">{kpi.name}</div>
                        <div className="text-[10px] font-bold text-[#015b9d] bg-sky-50 px-2 py-0.5 rounded inline-block">
                          {kpi.formula}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">{kpi.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GUÍA PRÁCTICA DE EXTRACCIÓN */}
        {showGuide && (
          <div className="no-print bg-white p-5 rounded-3xl border-2 border-[#015b9d] shadow-md space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-black text-slate-900">
                Guía de Auditoría: Cómo Extraer y Validar cada Fuente de Datos
              </h2>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="text-xs font-bold text-slate-500 hover:text-black cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {EXTRACTION_PLATFORM_GUIDE.map((item) => (
                <div
                  key={item.platform}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="font-black text-xs" style={{ color: item.color }}>
                    {item.platform}
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 list-disc pl-4">
                    {item.steps.map((step, idx) => (
                      <li key={idx} className="leading-snug">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* EDITOR DE DATOS Y FINANZAS                                        */}
        {/* ================================================================= */}
        {editMode && (
          <form
            onSubmit={handleSave}
            className="no-print bg-white p-5 rounded-3xl border-2 border-[#f5b514] shadow-lg space-y-5 text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Auditoría y Carga de Datos · {selectedMonth}
                </h2>
                <p className="text-[11px] text-slate-500">
                  Escribe cifras sin puntos de millar (usa punto solo para céntimos, ej. 13208.31). Nunca se inventan cifras ausentes.
                </p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-slate-900 text-white font-black px-5 py-2.5 rounded-full cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#f5b514]" />
                <span>Guardar y Generar Informe 3 Páginas</span>
              </button>
            </div>

            {/* 1A Y 1B */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-black uppercase text-[#015b9d]">
                  1A. Datos de la Empresa y Umbrales de Control
                </span>
                <button
                  type="button"
                  onClick={() => setShowFieldFormulaLegend((p) => !p)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-sky-200 hover:bg-sky-50 text-[#015b9d] text-[11px] font-black cursor-pointer shadow-2xs"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>
                    {showFieldFormulaLegend
                      ? 'Ocultar Fórmulas de Cálculo'
                      : '¿Cómo calcular estos datos?'}
                  </span>
                </button>
              </div>

              {showFieldFormulaLegend && (
                <div className="p-3.5 rounded-2xl bg-white border border-sky-200 space-y-2.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {FIELD_CALCULATION_GUIDE.map((item) => (
                      <div
                        key={item.field}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-black text-[11px] text-slate-900">
                            {item.field}
                          </span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-sky-100 text-[#015b9d] shrink-0">
                            {item.block}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 leading-snug">
                          {item.howToCalculate}
                        </p>
                        <div className="text-[10px] font-bold text-emerald-700">{item.example}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nombre de la Empresa</label>
                  <input
                    type="text"
                    value={draft.client_name}
                    onChange={(e) => setDraft({ ...draft, client_name: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Periodo del Informe</label>
                  <input
                    type="text"
                    value={draft.period_label}
                    onChange={(e) => setDraft({ ...draft, period_label: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-rose-700 mb-1">
                    Umbral Coste/Lead (€)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={draft.target_max_cpa}
                    onChange={(e) =>
                      setDraft({ ...draft, target_max_cpa: Number(e.target.value) })
                    }
                    className="w-full px-2.5 py-2 rounded-xl border border-rose-300 bg-white font-black text-right"
                  />
                </div>
                <div>
                  <label className="block font-bold text-emerald-700 mb-1">
                    ROAS Atribuido Meta (x)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={draft.target_min_roas}
                    onChange={(e) =>
                      setDraft({ ...draft, target_min_roas: Number(e.target.value) })
                    }
                    className="w-full px-2.5 py-2 rounded-xl border border-emerald-300 bg-white font-black text-right"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Logotipo</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 font-extrabold text-slate-900 cursor-pointer w-full justify-center"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#015b9d]" />
                      <span>Subir</span>
                    </button>
                    {draft.logo_data_url && (
                      <button
                        type="button"
                        onClick={() => setDraft({ ...draft, logo_data_url: '' })}
                        className="px-2 py-2 rounded-xl bg-rose-50 text-rose-600 font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {draft.show_financial_section && (
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black uppercase text-emerald-800">
                      1B. Cifras de Caja y Clientes Confirmados (CRM / Facturación)
                    </span>
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, show_financial_section: false })}
                      className="text-[11px] font-bold text-slate-500 hover:text-rose-600 cursor-pointer"
                    >
                      Ocultar sección caja ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Facturación Total Caja (€)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={draft.total_business_revenue}
                        onChange={(e) =>
                          setDraft({ ...draft, total_business_revenue: Number(e.target.value) })
                        }
                        className="w-full px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-white font-black text-right"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Clientes Nuevos Captados
                      </label>
                      <input
                        type="number"
                        value={draft.new_customers_acquired}
                        onChange={(e) =>
                          setDraft({ ...draft, new_customers_acquired: Number(e.target.value) })
                        }
                        className="w-full px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-white font-black text-right"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        LTV / Valor Cliente (€)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={draft.customer_ltv}
                        onChange={(e) =>
                          setDraft({ ...draft, customer_ltv: Number(e.target.value) })
                        }
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-right"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Margen Bruto Est. (%)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={draft.gross_margin_pct}
                        onChange={(e) =>
                          setDraft({ ...draft, gross_margin_pct: Number(e.target.value) })
                        }
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-right"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Margen Mensual/Cliente (€)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={draft.avg_monthly_margin_per_customer}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            avg_monthly_margin_per_customer: Number(e.target.value),
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-right"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2A. CANALES ORGÁNICOS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black uppercase text-slate-900">
                  2A. Nivel A · Visibilidad y Tráfico Orgánico (Sin inversión publicitaria)
                </span>
                <button
                  type="button"
                  onClick={handleAddOrganic}
                  className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-black px-3.5 py-1.5 rounded-full cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Canal</span>
                </button>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-white text-[10px] font-extrabold uppercase">
                      <th className="p-2">Color</th>
                      <th className="p-2">Canal / Fuente</th>
                      <th className="p-2 text-right">Seguidores Totales</th>
                      <th className="p-2 text-right">Saldo Neto Mes</th>
                      <th className="p-2 text-right">Impresiones</th>
                      <th className="p-2 text-right">Visitas / Clics Orgánicos</th>
                      <th className="p-2 text-center">Quitar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {draft.organic_channels.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50">
                        <td className="p-1.5 text-center">
                          <input
                            type="color"
                            value={row.color}
                            onChange={(e) => updateOrganicField(row.id, 'color', e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                          />
                        </td>
                        <td className="p-1.5">
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => updateOrganicField(row.id, 'name', e.target.value)}
                            className="w-44 px-2 py-1 rounded border border-slate-300 font-black"
                          />
                        </td>
                        <td className="p-1.5 text-right">
                          <input
                            type="number"
                            value={row.followers_total}
                            onChange={(e) =>
                              updateOrganicField(row.id, 'followers_total', Number(e.target.value))
                            }
                            className="w-24 px-2 py-1 rounded border border-slate-300 text-right font-bold"
                          />
                        </td>
                        <td className="p-1.5 text-right">
                          <input
                            type="number"
                            value={row.organic_growth_net}
                            onChange={(e) =>
                              updateOrganicField(
                                row.id,
                                'organic_growth_net',
                                Number(e.target.value)
                              )
                            }
                            className="w-20 px-2 py-1 rounded border border-slate-300 text-right font-bold"
                          />
                        </td>
                        <td className="p-1.5 text-right">
                          <input
                            type="number"
                            value={row.organic_reach}
                            onChange={(e) =>
                              updateOrganicField(row.id, 'organic_reach', Number(e.target.value))
                            }
                            className="w-24 px-2 py-1 rounded border border-slate-300 text-right font-bold"
                          />
                        </td>
                        <td className="p-1.5 text-right">
                          <input
                            type="number"
                            value={row.web_visits}
                            onChange={(e) =>
                              updateOrganicField(row.id, 'web_visits', Number(e.target.value))
                            }
                            className="w-24 px-2 py-1 rounded border border-slate-300 text-right font-bold"
                          />
                        </td>
                        <td className="p-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveOrganic(row.id)}
                            disabled={draft.organic_channels.length <= 1}
                            className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2B. CAMPAÑAS DE PAGO */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black uppercase text-[#015b9d]">
                  2B. Campañas de Pago (Clasificadas por Nivel: Visibilidad / Captación / Conversión)
                </span>
                <button
                  type="button"
                  onClick={handleAddPaid}
                  className="inline-flex items-center gap-1 bg-sky-50 hover:bg-sky-100 text-[#015b9d] border border-sky-200 font-black px-3.5 py-1.5 rounded-full cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Campaña</span>
                </button>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[10px] font-extrabold uppercase">
                      <th className="p-2">Color</th>
                      <th className="p-2">Plataforma</th>
                      <th className="p-2">Campaña</th>
                      <th className="p-2">Objetivo</th>
                      <th className="p-2 text-right">Alcance</th>
                      <th className="p-2 text-right">Inversión (€)</th>
                      <th className="p-2 text-right">Resultados</th>
                      <th className="p-2">Unidad</th>
                      <th className="p-2 text-right">Ventas Atribuidas (€)</th>
                      <th className="p-2 text-center">Quitar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {draft.paid_campaigns.map((camp) => (
                      <tr key={camp.id} className="hover:bg-slate-50">
                        <td className="p-1.5 text-center">
                          <input
                            type="color"
                            value={camp.color}
                            onChange={(e) => updatePaidField(camp.id, 'color', e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                          />
                        </td>
                        <td className="p-1.5">
                          <input
                            type="text"
                            value={camp.platform}
                            onChange={(e) => updatePaidField(camp.id, 'platform', e.target.value)}
                            className="w-28 px-2 py-1 rounded border border-slate-300 font-black"
                          />
                        </td>
                        <td className="p-1.5">
                          <input
                            type="text"
                            value={camp.campaign_label}
                            onChange={(e) =>
                              updatePaidField(camp.id, 'campaign_label', e.target.value)
                            }
                            className="w-36 px-2 py-1 rounded border border-slate-300 text-[11px] font-semibold"
                          />
                        </td>
                        <td className="p-1.5">
                          <select
                            value={camp.objective_type}
                            onChange={(e) =>
                              updatePaidField(
                                camp.id,
                                'objective_type',
                                e.target.value as ObjectiveCategory
                              )
                            }
                            className="w-48 px-2 py-1 rounded border border-sky-300 bg-sky-50/60 text-[11px] font-extrabold text-slate-900"
                          >
                            {ALL_OBJECTIVES.map((obj) => (
                              <option key={obj} value={obj}>
                                {obj}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-1.5 text-right">
                          <input
                            type="number"
                            value={camp.paid_reach}
                            onChange={(e) =>
                              updatePaidField(camp.id, 'paid_reach', Number(e.target.value))
                            }
                            className="w-20 px-1.5 py-1 rounded border border-slate-300 text-right font-bold"
                          />
                        </td>
                        <td className="p-1.5 text-right">
                          <input
                            type="number"
                            step="any"
                            value={camp.ad_spend}
                            onChange={(e) =>
                              updatePaidField(camp.id, 'ad_spend', Number(e.target.value))
                            }
                            className="w-20 px-1.5 py-1 rounded border border-emerald-300 bg-emerald-50/50 text-right font-bold"
                          />
                        </td>
                        <td className="p-1.5 text-right">
                          <input
                            type="number"
                            value={camp.results_count}
                            onChange={(e) =>
                              updatePaidField(camp.id, 'results_count', Number(e.target.value))
                            }
                            className="w-20 px-1.5 py-1 rounded border border-emerald-300 bg-emerald-50/50 text-right font-bold"
                          />
                        </td>
                        <td className="p-1.5">
                          <input
                            type="text"
                            value={camp.result_unit_label}
                            onChange={(e) =>
                              updatePaidField(camp.id, 'result_unit_label', e.target.value)
                            }
                            className="w-20 px-1.5 py-1 rounded border border-slate-300 text-[11px] font-semibold"
                          />
                        </td>
                        <td className="p-1.5 text-right">
                          <input
                            type="number"
                            step="any"
                            value={camp.revenue}
                            onChange={(e) =>
                              updatePaidField(camp.id, 'revenue', Number(e.target.value))
                            }
                            className="w-20 px-1.5 py-1 rounded border border-slate-300 bg-white text-right font-bold"
                          />
                        </td>
                        <td className="p-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemovePaid(camp.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. SEGMENTACIÓN Y NOTA DE AUDITORÍA */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black uppercase text-[#015b9d]">
                  3. Unidades de Negocio / Sedes y Nota Metodológica
                </span>
                <button
                  type="button"
                  onClick={handleAddMarket}
                  className="inline-flex items-center gap-1 text-[11px] font-black text-[#015b9d] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir Comparativa
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {draft.markets.map((mkt) => (
                  <div
                    key={mkt.id}
                    className="p-3 rounded-xl bg-white border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={mkt.group_label}
                        onChange={(e) => updateMarketField(mkt.id, 'group_label', e.target.value)}
                        className="font-black text-xs px-2 py-1 rounded border border-slate-300 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMarket(mkt.id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={mkt.market_a_name}
                          onChange={(e) =>
                            updateMarketField(mkt.id, 'market_a_name', e.target.value)
                          }
                          className="w-full px-2 py-1 rounded border border-slate-300 text-[11px] font-bold"
                        />
                        <input
                          type="number"
                          step="any"
                          value={mkt.market_a_pct}
                          onChange={(e) =>
                            updateMarketField(mkt.id, 'market_a_pct', Number(e.target.value))
                          }
                          className="w-16 px-1.5 py-1 rounded border border-slate-300 text-right text-[11px] font-black"
                        />
                        <span>%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={mkt.market_b_name}
                          onChange={(e) =>
                            updateMarketField(mkt.id, 'market_b_name', e.target.value)
                          }
                          className="w-full px-2 py-1 rounded border border-slate-300 text-[11px] font-bold"
                        />
                        <input
                          type="number"
                          step="any"
                          value={mkt.market_b_pct}
                          onChange={(e) =>
                            updateMarketField(mkt.id, 'market_b_pct', Number(e.target.value))
                          }
                          className="w-16 px-1.5 py-1 rounded border border-slate-300 text-right text-[11px] font-black"
                        />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                <input
                  type="text"
                  value={draft.competitive_note_title}
                  onChange={(e) =>
                    setDraft({ ...draft, competitive_note_title: e.target.value })
                  }
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-black text-xs"
                />
                <input
                  type="text"
                  value={draft.competitive_note_text}
                  onChange={(e) =>
                    setDraft({ ...draft, competitive_note_text: e.target.value })
                  }
                  className="md:col-span-2 px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs"
                />
              </div>
            </div>

            {/* 4. PLAN DE ACCIÓN PRIORIZADO */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 uppercase">
                  4. Plan de Acción Priorizado (Qué, Por qué, Indicador, KPI y Objetivo Propuesto)
                </span>
                <button
                  type="button"
                  onClick={handleAddDirective}
                  className="inline-flex items-center gap-1 text-[11px] font-black text-[#015b9d] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir Acción
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {draft.directives.map((dir) => (
                  <div
                    key={dir.id}
                    className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <input
                        type="text"
                        value={dir.area}
                        onChange={(e) => updateDirective(dir.id, 'area', e.target.value)}
                        className="font-bold text-xs bg-white px-2 py-1 rounded border border-slate-300 w-full"
                      />
                      <select
                        value={dir.status}
                        onChange={(e) => updateDirective(dir.id, 'status', e.target.value)}
                        className="text-[10px] font-black px-2 py-1 rounded bg-slate-900 text-[#f5b514]"
                      >
                        <option value="ESCALAR">ESCALAR</option>
                        <option value="MANTENER">MANTENER</option>
                        <option value="OPTIMIZAR">OPTIMIZAR</option>
                        <option value="REDUCIR / PAUSAR">REDUCIR / PAUSAR</option>
                      </select>
                      {draft.directives.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDirective(dir.id)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Qué se recomienda hacer..."
                      value={dir.decision}
                      onChange={(e) => updateDirective(dir.id, 'decision', e.target.value)}
                      className="w-full p-2 rounded bg-white border border-slate-300 text-[11px]"
                    />
                    <input
                      type="text"
                      placeholder="Por qué / Indicador que lo justifica"
                      value={dir.rationale_kpi}
                      onChange={(e) => updateDirective(dir.id, 'rationale_kpi', e.target.value)}
                      className="w-full px-2 py-1 rounded bg-white border border-slate-300 text-[10px]"
                    />
                    <input
                      type="text"
                      placeholder="KPI de control"
                      value={dir.control_kpi}
                      onChange={(e) => updateDirective(dir.id, 'control_kpi', e.target.value)}
                      className="w-full px-2 py-1 rounded bg-white border border-slate-300 text-[10px]"
                    />
                    <input
                      type="text"
                      placeholder="Objetivo propuesto"
                      value={dir.expected_impact}
                      onChange={(e) =>
                        updateDirective(dir.id, 'expected_impact', e.target.value)
                      }
                      className="w-full px-2 py-1 rounded bg-white border border-slate-300 text-[10px] font-bold"
                    />
                  </div>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* ===================================================================== */}
        {/* DOCUMENTO EJECUTIVO DE 3 PÁGINAS (CFO / CMO / CEO)                    */}
        {/* ===================================================================== */}
        <div
          id="ceo-visual-report"
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* ================================================================= */}
          {/* PÁGINA 1 — RESUMEN EJECUTIVO                                      */}
          {/* ================================================================= */}
          <div className="bg-gradient-to-b from-slate-50 to-white pt-6 pb-4 px-6 flex flex-col items-center text-center border-b border-slate-100">
            {draft.logo_data_url && !logoError ? (
              <img
                src={draft.logo_data_url}
                alt={draft.client_name}
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
                className="h-16 sm:h-20 object-contain mb-1"
              />
            ) : (
              <div>
                <div className="text-[11px] font-extrabold tracking-[0.22em] text-[#ed6723] uppercase">
                  {draft.client_subtitle}
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 mt-0.5">
                  {draft.client_name}
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-950 text-white px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-xs sm:text-sm font-black tracking-wider uppercase">
              PÁGINA 1 · RESUMEN EJECUTIVO DE RESULTADOS Y CRECIMIENTO
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {(summary.webVisitsYoY !== null ||
                (draft.show_financial_section && summary.revenueYoY !== null)) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold">
                  <CalendarRange className="w-3.5 h-3.5 text-[#f5b514]" />
                  {draft.show_financial_section && summary.revenueYoY !== null
                    ? `Ventas vs. Año Pasado: ${summary.revenueYoY >= 0 ? '+' : ''}${summary.revenueYoY.toFixed(1)}%`
                    : `Visitas vs. Año Pasado: ${summary.webVisitsYoY! >= 0 ? '+' : ''}${summary.webVisitsYoY!.toFixed(1)}%`}
                </span>
              )}
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#f5b514] text-slate-950 text-xs font-black">
                {draft.period_label}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* LAS 3 PREGUNTAS CLAVE DEL RESUMEN EJECUTIVO */}
            <div className="print-keep grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 border-t-4 border-[#f5b514] space-y-1.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-[#f5b514]">
                  1. ¿Qué hemos conseguido?
                </div>
                <p className="text-xs leading-relaxed text-slate-200">{summary.achievedText}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 border-t-4 border-t-emerald-600 space-y-1.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>2. ¿Qué está funcionando?</span>
                </div>
                <p className="text-xs leading-relaxed text-emerald-950">{summary.workingText}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 border-t-4 border-t-[#ed6723] space-y-1.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#ed6723]" />
                  <span>3. ¿Qué debemos mejorar?</span>
                </div>
                <p className="text-xs leading-relaxed text-amber-950">{summary.improveText}</p>
              </div>
            </div>

            {/* INDICADORES FINANCIEROS AUDITADOS */}
            {draft.show_financial_section && (
              <div className="print-keep space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900">
                    <Briefcase className="w-4 h-4 text-[#015b9d]" />
                    <span>Indicadores Económicos y Rigor de Atribución</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {summary.hasAttributedRevenue
                      ? 'Atribución directa verificada en campañas'
                      : 'Nota CFO: Sin atribución directa por anuncio, los ratios globales son descriptivos'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-500">
                        Caja Total
                      </span>
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        CONFIRMADO
                      </span>
                    </div>
                    <div className="text-xl font-black text-slate-950 mt-1">
                      {formatEur(summary.bizRevenue)}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Ingresos brutos cierre</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-500">
                        {summary.hasAttributedRevenue ? 'ROAS Atribuido' : 'Ratio Caja/Ads'}
                      </span>
                      <span
                        className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                          summary.hasAttributedRevenue
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-sky-100 text-[#015b9d]'
                        }`}
                      >
                        {summary.hasAttributedRevenue ? 'ATRIBUIDO' : 'DESCRIPTIVO'}
                      </span>
                    </div>
                    <div className="text-xl font-black text-slate-950 mt-1">
                      {summary.hasAttributedRevenue
                        ? `${summary.attributedRoas.toFixed(2)}x`
                        : summary.descriptiveCashRatio > 0
                          ? `${summary.descriptiveCashRatio.toFixed(2)}x`
                          : '—'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {summary.hasAttributedRevenue
                        ? 'Ventas Ads ÷ Inv. Ads'
                        : 'Caja total ÷ Inv. Ads'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-500">
                        Inv. Ads / Alta
                      </span>
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-sky-100 text-[#015b9d]">
                        GLOBAL
                      </span>
                    </div>
                    <div className="text-xl font-black text-slate-950 mt-1">
                      {summary.adSpendPerNewCustomer > 0
                        ? formatEur(summary.adSpendPerNewCustomer)
                        : '—'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {formatCompact(summary.newCustomers)} altas confirmadas
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-500">
                        LTV Cliente
                      </span>
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        CRM
                      </span>
                    </div>
                    <div className="text-xl font-black text-slate-950 mt-1">
                      {draft.customer_ltv > 0 ? formatEur(draft.customer_ltv) : '—'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {summary.ltvToAdSpendRatio > 0
                        ? `x${summary.ltvToAdSpendRatio.toFixed(1)} sobre inv. ads/alta`
                        : 'Valor histórico cliente'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-500">
                        Margen Bruto
                      </span>
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                        ESTIMACIÓN
                      </span>
                    </div>
                    <div className="text-xl font-black text-slate-950 mt-1">
                      {summary.bizRevenue > 0 ? formatEur(summary.estimatedGrossMarginEur) : '—'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Al {draft.gross_margin_pct}% (antes estructura)
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-500">
                        Payback Est.
                      </span>
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                        ESTIMACIÓN
                      </span>
                    </div>
                    <div className="text-xl font-black text-slate-950 mt-1">
                      {summary.estimatedPaybackMonths > 0
                        ? `${summary.estimatedPaybackMonths.toFixed(2)} m`
                        : '—'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Amortización inv. captación
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TARJETAS DE TRACCIÓN POR NIVEL (VISIBILIDAD, CAPTACIÓN Y TRÁFICO) */}
            <div className="print-keep grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">
                    Nivel A · Comunidad
                  </div>
                  <div className="text-2xl font-black text-slate-950 mt-0.5">
                    {formatCompact(summary.totalFollowers)}
                  </div>
                  <div className="text-[11px] font-extrabold text-emerald-700 mt-0.5">
                    +{formatCompact(summary.totalOrganicGrowth)} netos/mes
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">
                    Nivel A · Impresiones Org.
                  </div>
                  <div className="text-2xl font-black text-slate-950 mt-0.5">
                    {formatCompact(summary.totalOrganicReach)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Visibilidad sin coste CPC
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#e1306c] flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">
                    Nivel B · Captación Leads
                  </div>
                  <div className="text-2xl font-black text-slate-950 mt-0.5">
                    {formatCompact(summary.totalLeadsCaptured)}
                  </div>
                  <div className="text-[11px] font-bold text-[#015b9d] mt-0.5">
                    {summary.avgCostPerLead > 0
                      ? `CPL Medio: ${summary.avgCostPerLead.toFixed(2)} €`
                      : `Inversión Ads: ${formatEur(summary.totalAdSpend)}`}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#015b9d] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">
                    Nivel A · Tráfico / Clics
                  </div>
                  <div className="text-2xl font-black text-slate-950 mt-0.5">
                    {formatCompact(summary.totalAllWebTraffic)}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                    {summary.freeTrafficSharePct.toFixed(1)}% orgánico ({formatCompact(summary.totalOrganicWebVisits)})
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#ed6723] flex items-center justify-center shrink-0">
                  <MousePointerClick className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* PÁGINA 2 — ANÁLISIS DE MARKETING (ORGÁNICO, PAGO Y TRÁFICO)       */}
          {/* ================================================================= */}
          <div className="print-page-break bg-slate-900 text-white px-6 py-2.5 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider">
              PÁGINA 2 · ANÁLISIS DE MARKETING POR NIVELES DE OBJETIVO Y CANALES
            </h2>
            <span className="text-[10px] font-bold text-[#f5b514]">
              Separación estricta: Visibilidad vs. Captación vs. Conversión
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* RESUMEN POR LOS 3 NIVELES DE OBJETIVO */}
            {draft.show_paid_section && (
              <div className="print-keep grid grid-cols-1 md:grid-cols-3 gap-3">
                {summary.funnelLevelsSummary.map((lvl) => (
                  <div
                    key={lvl.level}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-black uppercase text-[#015b9d] flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>{lvl.level}</span>
                      </div>
                      <div className="text-base font-black text-slate-950 mt-0.5">
                        {formatCompact(lvl.results)} resultados
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Inversión: <strong>{formatEur(lvl.spend)}</strong>
                        {lvl.avgCost > 0 ? ` · Coste medio: ${lvl.avgCost.toFixed(2)} €` : ''}
                      </div>
                    </div>
                    <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                      {lvl.campaignsCount} {lvl.campaignsCount === 1 ? 'línea' : 'líneas'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* TABLA ORGÁNICA */}
            <div className="print-keep">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                1. Rendimiento de Canales Orgánicos (Nivel A · Visibilidad y Tráfico Gratuito)
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-[11px] font-black border-b border-slate-200">
                      <th className="py-2.5 px-4">Canal / Fuente</th>
                      <th className="py-2.5 px-3 text-center">Comunidad Total</th>
                      <th className="py-2.5 px-3 text-center">Crecimiento Neto</th>
                      <th className="py-2.5 px-3 text-center">Impresiones</th>
                      <th className="py-2.5 px-3 text-center">Visitas / Clics Orgánicos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {summary.orgList.map((net) => {
                      const orgPositive = net.organic_growth_net > 0;
                      return (
                        <tr key={net.id} className="hover:bg-slate-50/80">
                          <td className="py-2.5 px-4 font-black text-slate-900 flex items-center gap-2.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: net.color }}
                            />
                            <span>{net.name}</span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                            {net.followers_total > 0 ? formatCompact(net.followers_total) : 'No aplica'}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {net.followers_total > 0 ? (
                              <span
                                className={`inline-flex items-center gap-1 font-extrabold ${
                                  orgPositive ? 'text-emerald-600' : 'text-slate-600'
                                }`}
                              >
                                {orgPositive ? (
                                  <TrendingUp className="w-3.5 h-3.5" />
                                ) : (
                                  <TrendingDown className="w-3.5 h-3.5" />
                                )}
                                {net.organic_growth_net >= 0
                                  ? `+${formatCompact(net.organic_growth_net)}`
                                  : formatCompact(net.organic_growth_net)}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center font-semibold text-slate-700">
                            {formatCompact(net.organic_reach)}
                          </td>
                          <td className="py-2.5 px-3 text-center font-black text-[#015b9d]">
                            {formatCompact(net.web_visits)}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-slate-900 text-white font-black">
                      <td className="py-2.5 px-4 uppercase">TOTAL ORGÁNICO VERIFICADO</td>
                      <td className="py-2.5 px-3 text-center text-[#f5b514]">
                        {formatCompact(summary.totalFollowers)}
                      </td>
                      <td className="py-2.5 px-3 text-center text-emerald-400">
                        +{formatCompact(summary.totalOrganicGrowth)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {formatCompact(summary.totalOrganicReach)}
                      </td>
                      <td className="py-2.5 px-3 text-center text-[#f5b514]">
                        {formatCompact(summary.totalOrganicWebVisits)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLA AUDITORÍA CAMPAÑAS PUBLICITARIAS */}
            {draft.show_paid_section && summary.evaluatedPaid.length > 0 && (
              <div className="print-keep space-y-2.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  2. Auditoría de Campañas Publicitarias (Evaluación por Nivel y Calidad)
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-[11px] font-black border-b border-slate-200">
                        <th className="py-2.5 px-4">Plataforma · Campaña</th>
                        <th className="py-2.5 px-3">Nivel · Objetivo</th>
                        <th className="py-2.5 px-3 text-center">Inversión</th>
                        <th className="py-2.5 px-3 text-center">Alcance</th>
                        <th className="py-2.5 px-3 text-center">Resultados</th>
                        <th className="py-2.5 px-3 text-center">Coste / Ud.</th>
                        <th className="py-2.5 px-3 text-center">Rentabilidad</th>
                        <th className="py-2.5 px-4 text-center">Decisión</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {summary.evaluatedPaid.map((camp) => {
                        const badgeStyle =
                          camp.verdict === 'ESCALAR'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : camp.verdict === 'REDUCIR / PAUSAR'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : camp.verdict === 'OPTIMIZAR'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300';
                        return (
                          <tr key={camp.id} className="hover:bg-slate-50/80">
                            <td className="py-2.5 px-4 text-slate-900">
                              <div className="flex items-center gap-2 font-black">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: camp.color }}
                                />
                                <span>{camp.platform}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 pl-4.5">
                                {camp.campaign_label}
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="text-[9px] font-black uppercase text-[#015b9d] block">
                                {camp.funnelLevel}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-700">
                                {camp.objective_type}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center font-black text-slate-900">
                              {formatEur(camp.ad_spend)}
                            </td>
                            <td className="py-2.5 px-3 text-center font-semibold text-slate-700">
                              {camp.paid_reach > 0 ? formatCompact(camp.paid_reach) : 'N/D'}
                            </td>
                            <td className="py-2.5 px-3 text-center font-black text-slate-900">
                              {formatCompact(camp.results_count)}{' '}
                              <span className="text-[10px] font-semibold text-slate-500">
                                {camp.result_unit_label}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center font-black text-slate-800">
                              {camp.unitCost > 0 ? `${camp.unitCost.toFixed(2)} €` : '—'}
                            </td>
                            <td className="py-2.5 px-3 text-center text-[10px]">
                              {camp.revenue > 0 ? (
                                <span className="font-black text-emerald-700">
                                  ROAS {camp.campaignRoas.toFixed(2)}x ({formatEur(camp.revenue)})
                                </span>
                              ) : (
                                <span className="text-slate-400 font-semibold">Sin atribución</span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 text-center">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black border ${badgeStyle}`}
                              >
                                {camp.verdict}
                              </span>
                              <div className="text-[9px] text-slate-500 mt-1 max-w-[175px] mx-auto leading-tight">
                                {camp.reason}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DISTRIBUCIÓN DE TRÁFICO Y UNIDADES DE NEGOCIO */}
            <div className="print-keep grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#015b9d]" />
                    <h3 className="text-xs font-black uppercase text-slate-900">
                      3. Procedencia de Visitas y Clics Externos (Orgánico vs. Pago)
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">
                    Total: {formatCompact(summary.totalAllWebTraffic)}
                  </span>
                </div>
                <div className="space-y-2">
                  {summary.unifiedTrafficSources.map((src) => (
                    <div
                      key={src.id}
                      className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: src.color }}
                          />
                          <span className="font-black text-slate-900">{src.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[8px] font-black ${
                              src.type === 'ORGÁNICO'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-sky-100 text-[#015b9d]'
                            }`}
                          >
                            {src.type}
                          </span>
                        </div>
                        <div>
                          <strong className="font-black">{formatCompact(src.visits)}</strong>{' '}
                          <span className="text-slate-400 font-bold">
                            ({src.sharePct.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(src.sharePct, src.visits > 0 ? 3 : 0)}%`,
                            backgroundColor: src.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-3">
                {draft.markets.length > 0 && (
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2.5 text-[11px]">
                    <div className="font-black text-slate-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#015b9d]" />
                      <span>Distribución por Sedes / Modelo de Negocio</span>
                    </div>
                    {draft.markets.map((mkt) => (
                      <div key={mkt.id} className="space-y-1">
                        <div className="font-extrabold text-slate-900">{mkt.group_label}</div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
                          <div
                            style={{
                              width: `${Math.min(100, mkt.market_a_pct)}%`,
                              backgroundColor: mkt.market_a_color,
                            }}
                          />
                          <div
                            style={{
                              width: `${Math.min(100, mkt.market_b_pct)}%`,
                              backgroundColor: mkt.market_b_color,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                          <span>
                            {mkt.market_a_name}: <strong>{mkt.market_a_pct}%</strong>
                          </span>
                          <span>
                            {mkt.market_b_name}: <strong>{mkt.market_b_pct}%</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-sky-50/90 p-3.5 rounded-xl border border-sky-200 text-[11px] text-slate-800 flex items-start gap-2">
                  <Trophy className="w-4 h-4 text-[#015b9d] shrink-0 mt-0.5" />
                  <div>
                    <strong>{draft.competitive_note_title}:</strong> {draft.competitive_note_text}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* PÁGINA 3 — ESTRATEGIA, PLAN DE ACCIÓN Y CUADRO DE MANDO CEO       */}
          {/* ================================================================= */}
          <div className="print-page-break bg-slate-950 text-white px-6 py-2.5 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider">
              PÁGINA 3 · ESTRATEGIA, PLAN DE ACCIÓN Y CUADRO DE MANDO PARA DIRECCIÓN
            </h2>
            <span className="text-[10px] font-bold text-[#f5b514]">
              Gobernanza y Objetivos Propuestos Próximo Período
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* PLAN DE ACCIÓN PRIORIZADO */}
            <div className="print-keep rounded-2xl bg-amber-50/80 border-2 border-[#f5b514] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#ed6723]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">
                    1. Plan de Acción Priorizado para el Siguiente Período
                  </h3>
                </div>
                <span className="text-[10px] font-black uppercase text-amber-900">
                  Objetivos Propuestos (Sujetos a Validación)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {draft.directives.map((dir) => {
                  const pill =
                    dir.status === 'ESCALAR'
                      ? 'bg-emerald-700 text-white'
                      : dir.status === 'REDUCIR / PAUSAR'
                        ? 'bg-rose-700 text-white'
                        : dir.status === 'OPTIMIZAR'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-900 text-[#f5b514]';
                  return (
                    <div
                      key={dir.id}
                      className="bg-white p-3.5 rounded-xl border border-amber-200 flex flex-col justify-between gap-2"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-black text-xs text-slate-950">{dir.area}</span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${pill}`}>
                            {dir.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-800 leading-snug">
                          <strong>Acción:</strong> {dir.decision}
                        </p>
                        <p className="text-[10px] text-slate-600 leading-snug">
                          <strong>Justificación:</strong> {dir.rationale_kpi}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px]">
                        <div className="text-slate-600">
                          <strong>KPI Control:</strong> {dir.control_kpi}
                        </div>
                        <div className="flex items-center gap-1 font-extrabold text-[#015b9d]">
                          <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                          <span>Objetivo: {dir.expected_impact}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CUADRO DE MANDO FINAL PARA DIRECCIÓN GENERAL */}
            <div className="print-keep space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-[#015b9d]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">
                    2. Cuadro de Mando Ejecutivo (Separación por Naturaleza del Dato)
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Confirmado
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    Estimación
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    Pendiente Medición
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[10px] font-extrabold uppercase">
                      <th className="py-2.5 px-4">Área</th>
                      <th className="py-2.5 px-3">Indicador</th>
                      <th className="py-2.5 px-3 text-right">Resultado {draft.report_month}</th>
                      <th className="py-2.5 px-3 text-center">Naturaleza</th>
                      <th className="py-2.5 px-3 text-center">Estado</th>
                      <th className="py-2.5 px-4">Nota de Auditoría</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {summary.executiveScorecard.map((row, i) => {
                      const catStyle =
                        row.category === 'CONFIRMADO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.category === 'ESTIMACIÓN'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-800';
                      return (
                        <tr key={i} className="hover:bg-slate-50/80">
                          <td className="py-2 px-4 font-bold text-slate-600 text-[11px]">
                            {row.area}
                          </td>
                          <td className="py-2 px-3 font-black text-slate-950">{row.kpi}</td>
                          <td className="py-2 px-3 text-right font-black text-slate-900">
                            {row.value}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-black ${catStyle}`}
                            >
                              {row.category}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center font-extrabold text-[11px] text-[#015b9d]">
                            {row.status}
                          </td>
                          <td className="py-2 px-4 text-[10px] text-slate-500">{row.note}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}