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
} from 'lucide-react';

export type ObjectiveCategory =
  | 'Tráfico Web'
  | 'Mensajes / Leads'
  | 'Ventas / Compras'
  | 'Alcance / Branding';

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
  status: 'ESCALAR' | 'CORREGIR' | 'MANTENER';
  decision: string;
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
  show_paid_section: boolean;
  organic_channels: OrganicChannelRow[];
  paid_campaigns: PaidCampaignRow[];
  markets: MarketSegment[];
  competitive_note_title: string;
  competitive_note_text: string;
  directives: CeoDirective[];
}

const SIAM_LOGO_URL =
  'https://siampark.net/templates/yootheme/cache/d1/siam-park-tenerife-main-logo-d1ab9a93.webp';

const STORAGE_KEY = 'agency_ceo_clean_spanish_v13';

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

const OBJECTIVE_UNIT_DEFAULTS: Record<ObjectiveCategory, string> = {
  'Tráfico Web': 'clics',
  'Mensajes / Leads': 'mensajes',
  'Ventas / Compras': 'ventas',
  'Alcance / Branding': 'impactos',
};

const DEFAULT_SIAM_TEMPLATE: ClientTemplateReport = {
  client_name: 'SIAM PARK TENERIFE',
  client_subtitle: 'THE WATER KINGDOM · INFORME DE DIRECCIÓN GENERAL',
  logo_data_url: SIAM_LOGO_URL,
  web_kpi_subtitle: 'Tráfico directo hacia web y taquilla',
  report_month: '2026-10',
  period_label: 'Octubre 2026 (01 – 31 Oct)',
  target_max_cpa: 15,
  target_min_roas: 4.0,
  total_business_revenue: 68500,
  new_customers_acquired: 735,
  customer_ltv: 95,
  gross_margin_pct: 72,
  avg_monthly_margin_per_customer: 42,
  prev_year_web_visits: 4210,
  prev_year_revenue: 34500,
  auto_diagnosis: true,
  custom_headline: '',
  show_paid_section: true,
  organic_channels: [
    {
      id: 'org-tiktok',
      name: 'TikTok',
      color: '#0f172a',
      followers_total: 20350,
      organic_growth_net: 1250,
      organic_reach: 163620,
      web_visits: 640,
    },
    {
      id: 'org-ig',
      name: 'Instagram',
      color: '#e1306c',
      followers_total: 218770,
      organic_growth_net: 441,
      organic_reach: 1690000,
      web_visits: 1120,
    },
    {
      id: 'org-fb',
      name: 'Facebook',
      color: '#1877f2',
      followers_total: 352290,
      organic_growth_net: 424,
      organic_reach: 736800,
      web_visits: 2453,
    },
    {
      id: 'org-li',
      name: 'LinkedIn',
      color: '#0a66c2',
      followers_total: 3200,
      organic_growth_net: 85,
      organic_reach: 14200,
      web_visits: 190,
    },
    {
      id: 'org-yt',
      name: 'YouTube',
      color: '#dc2626',
      followers_total: 9610,
      organic_growth_net: 48,
      organic_reach: 46850,
      web_visits: 520,
    },
  ],
  paid_campaigns: [
    {
      id: 'paid-google-search',
      platform: 'Google Ads',
      campaign_label: 'Búsquedas Marca + Entradas UK/ES',
      color: '#16a34a',
      objective_type: 'Ventas / Compras',
      result_unit_label: 'entradas',
      paid_reach: 42000,
      ad_spend: 2800,
      results_count: 540,
      revenue: 29700,
    },
    {
      id: 'paid-meta-sales',
      platform: 'Meta Ads (FB/IG)',
      campaign_label: 'Venta Directa Taquilla + VIP',
      color: '#1877f2',
      objective_type: 'Ventas / Compras',
      result_unit_label: 'entradas',
      paid_reach: 64000,
      ad_spend: 1450,
      results_count: 195,
      revenue: 11850,
    },
  ],
  markets: [
    {
      id: 'mkt-1',
      group_label: 'Facebook (Turismo Internacional)',
      market_a_name: 'Reino Unido',
      market_a_pct: 30.8,
      market_a_color: '#1877f2',
      market_b_name: 'España',
      market_b_pct: 27.52,
      market_b_color: '#f5b514',
    },
    {
      id: 'mkt-2',
      group_label: 'Instagram (Nacional / Local)',
      market_a_name: 'España',
      market_a_pct: 44.58,
      market_a_color: '#e1306c',
      market_b_name: 'Reino Unido',
      market_b_pct: 19.48,
      market_b_color: '#015b9d',
    },
  ],
  competitive_note_title: 'Posicionamiento frente a Competencia',
  competitive_note_text:
    'Superamos a Waterbom Bali en Facebook (352,3K vs. 334,1K) y multiplicamos x41 la audiencia YouTube de Aqualand Costa Adeje.',
  directives: [
    {
      id: 'dir-1',
      area: '1. Alianzas Talento VIP',
      status: 'ESCALAR',
      decision:
        'Programar 2 colaboraciones mensuales con creadores de España y Reino Unido tras el pico de alcance orgánico.',
      expected_impact: '+250K impactos gratuitos al mes.',
    },
    {
      id: 'dir-2',
      area: '2. Mercado Británico Invierno',
      status: 'ESCALAR',
      decision:
        'Reforzar campañas de Facebook y YouTube segmentadas a Reino Unido (30,8% de audiencia FB) para temporada de invierno.',
      expected_impact: 'Aumento de reservas internacionales.',
    },
    {
      id: 'dir-3',
      area: '3. Enlaces Directos a Taquilla',
      status: 'CORREGIR',
      decision:
        'Activar enlaces directos con seguimiento en Instagram, TikTok y LinkedIn para igualar la tracción de Facebook (2.453 visitas).',
      expected_impact: '+60% tráfico web desde redes sociales.',
    },
  ],
};

const createBlankClientTemplate = (month: string): ClientTemplateReport => ({
  client_name: 'NUEVO CLIENTE',
  client_subtitle: 'INFORME DE DIRECCIÓN GENERAL · RENTABILIDAD Y CRECIMIENTO',
  logo_data_url: '',
  web_kpi_subtitle: 'Visitas hacia web y reservas',
  report_month: month,
  period_label: `Cierre Mensual · ${month}`,
  target_max_cpa: 10,
  target_min_roas: 3.0,
  total_business_revenue: 8461.26,
  new_customers_acquired: 48,
  customer_ltv: 240,
  gross_margin_pct: 65,
  avg_monthly_margin_per_customer: 55,
  prev_year_web_visits: 0,
  prev_year_revenue: 0,
  auto_diagnosis: true,
  custom_headline: '',
  show_paid_section: true,
  organic_channels: [
    {
      id: 'org-ig',
      name: 'Instagram',
      color: '#e1306c',
      followers_total: 0,
      organic_growth_net: 0,
      organic_reach: 0,
      web_visits: 0,
    },
    {
      id: 'org-fb',
      name: 'Facebook',
      color: '#1877f2',
      followers_total: 0,
      organic_growth_net: 0,
      organic_reach: 0,
      web_visits: 0,
    },
  ],
  paid_campaigns: [
    {
      id: 'paid-fb-msg',
      platform: 'Facebook',
      campaign_label: 'Campaña Mensajes',
      color: '#1877f2',
      objective_type: 'Mensajes / Leads',
      result_unit_label: 'mensajes',
      paid_reach: 0,
      ad_spend: 0,
      results_count: 0,
      revenue: 0,
    },
    {
      id: 'paid-ig-traf',
      platform: 'Instagram',
      campaign_label: 'Campaña Tráfico Web',
      color: '#e1306c',
      objective_type: 'Tráfico Web',
      result_unit_label: 'clics',
      paid_reach: 0,
      ad_spend: 0,
      results_count: 0,
      revenue: 0,
    },
  ],
  markets: [
    {
      id: 'mkt-local',
      group_label: 'Distribución Geográfica / Público',
      market_a_name: 'Mercado Local / Principal',
      market_a_pct: 65,
      market_a_color: '#015b9d',
      market_b_name: 'Mercado Secundario',
      market_b_pct: 35,
      market_b_color: '#f5b514',
    },
  ],
  competitive_note_title: 'Observación Estratégica del Sector',
  competitive_note_text:
    'Escribe aquí la comparativa frente a competidores locales o el benchmark del sector del cliente.',
  directives: [
    {
      id: 'dir-new-1',
      area: '1. Escalar Canal Más Rentable',
      status: 'ESCALAR',
      decision: 'Reasignar presupuesto hacia las campañas con menor coste por cliente o contacto.',
      expected_impact: '+25% conversiones manteniendo gasto.',
    },
    {
      id: 'dir-new-2',
      area: '2. Trazabilidad en Sistema de Reservas',
      status: 'CORREGIR',
      decision: 'Etiquetar el origen de cada venta (Instagram, Facebook, Google, WhatsApp) en el software de gestión.',
      expected_impact: '100% control de ingresos por canal.',
    },
    {
      id: 'dir-new-3',
      area: '3. Crecimiento Orgánico',
      status: 'MANTENER',
      decision: 'Mantener publicaciones de prueba social y casos reales para reducir dependencia de anuncios.',
      expected_impact: 'Menor coste de captación global.',
    },
  ],
});

// DICCIONARIO PRÁCTICO: CÓMO SACAR CADA MÉTRICA EN CADA PLATAFORMA
const EXTRACTION_PLATFORM_GUIDE = [
  {
    platform: '1. Meta Business Suite (Orgánico IG y FB)',
    color: '#e1306c',
    steps: [
      'Entra en Meta Business Suite → menú izquierdo "Estadísticas" → pestaña "Resultados".',
      'Comunidad Total: Ve a "Público" → mira el total de seguidores actuales de Facebook e Instagram (pon 1 fila por red).',
      'Crecimiento Orgánico: En "Resultados" → bloque "Seguidores" → anota los nuevos seguidores netos del mes.',
      'Alcance / Impresiones: En "Resultados" → bloque "Visualizaciones" (o Alcance) del periodo.',
      'Visitas a la Web: En "Resultados" → bloque "Clics en el enlace" (total de clics hacia tu web).',
    ],
  },
  {
    platform: '2. Meta Ads Manager (Anuncios de Pago)',
    color: '#1877f2',
    steps: [
      'Abre Administrador de Anuncios → selecciona el mes exacto arriba a la derecha.',
      'Haz clic en "Desglose" → "Por entrega" → "Plataforma" (para separar Facebook, Instagram, Audience Network).',
      'Ordena o filtra por Objetivo de Campaña (Tráfico, Mensajes/WhatsApp o Ventas) para no mezclar clics con contactos.',
      'Copia por cada fila: Alcance, Importe gastado (€) y Resultados (nunca pongas puntos de millar al escribirlo aquí).',
    ],
  },
  {
    platform: '3. Google (Analytics 4, Search Console y Ads)',
    color: '#16a34a',
    steps: [
      'Google Search (SEO): Entra en Google Search Console → "Rendimiento" → copia "Impresiones totales" (Alcance) y "Clics totales" (Visitas Web).',
      'Tráfico Directo / Referidos: Entra en Google Analytics 4 → "Informes" → "Adquisición de tráfico" → copia las sesiones de Direct y Referral.',
      'Google Ads: Entra en Campañas → copia Impresiones, Coste (€), Conversiones (ventas/leads) y Valor de conversión (€).',
    ],
  },
  {
    platform: '4. TikTok, YouTube y Caja Real (CRM / TIMP)',
    color: '#0f172a',
    steps: [
      'TikTok Studio / YouTube Studio: Estadísticas → selecciona los últimos 28/30 días → copia Suscriptores/Seguidores netos, Visualizaciones y Clics en perfil.',
      'Facturación Total del Negocio (€): Saca el cierre mensual bruto de tu TPV, Taquilla o software de gestión (ej. TIMP).',
      'Nuevos Clientes Reales: Filtra en tu CRM/TIMP cuántos clientes se dieron de alta por primera vez este mes (sin contar renovaciones).',
    ],
  },
];

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
    '2026-10': DEFAULT_SIAM_TEMPLATE,
  });
  const [draft, setDraft] = useState<ClientTemplateReport>(DEFAULT_SIAM_TEMPLATE);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const jsonInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, ClientTemplateReport>;
        const merged = { '2026-10': DEFAULT_SIAM_TEMPLATE, ...parsed };
        setReportsMap(merged);
        if (merged['2026-10']) setDraft(merged['2026-10']);
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
    setToast('Plantilla en blanco lista');
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
    setToast('Informe de Dirección guardado');
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
    a.download = `Informe-Direccion-${safeClient || 'cliente'}-${selectedMonth}.json`;
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
          const loaded = {
            ...createBlankClientTemplate(firstKey),
            ...imported[firstKey],
          };
          setDraft(loaded);
          const merged = { ...reportsMap, [firstKey]: loaded };
          setReportsMap(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          setToast('Datos del cliente cargados');
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
    setDraft((prev) => ({
      ...prev,
      paid_campaigns: [
        ...prev.paid_campaigns,
        {
          id: `paid-${Date.now()}`,
          platform: 'Meta Ads',
          campaign_label: 'Nueva Campaña',
          color: nextColor,
          objective_type: 'Ventas / Compras',
          result_unit_label: 'ventas',
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
          const objCat = value as ObjectiveCategory;
          return {
            ...camp,
            objective_type: objCat,
            result_unit_label: OBJECTIVE_UNIT_DEFAULTS[objCat],
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
          area: `${num}. Nueva Acción`,
          status: 'ESCALAR',
          decision: 'Acción estratégica recomendada para el siguiente periodo.',
          expected_impact: 'Objetivo esperado.',
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
  // CÁLCULO FINANCIERO EN LENGUAJE EJECUTIVO CLARO (SIN JERGA TÉCNICA)
  // =========================================================================
  const summary = useMemo(() => {
    const orgList = draft.organic_channels;
    const paidList = draft.paid_campaigns;

    const totalFollowers = orgList.reduce((s, n) => s + Number(n.followers_total || 0), 0);
    const totalOrganicGrowth = orgList.reduce((s, n) => s + Number(n.organic_growth_net || 0), 0);
    const totalOrganicReach = orgList.reduce((s, n) => s + Number(n.organic_reach || 0), 0);
    const totalWebVisits = orgList.reduce((s, n) => s + Number(n.web_visits || 0), 0);

    const totalPaidReach = paidList.reduce((s, n) => s + Number(n.paid_reach || 0), 0);
    const totalAdSpend = paidList.reduce((s, n) => s + Number(n.ad_spend || 0), 0);
    const totalAttributedRevenue = paidList.reduce((s, n) => s + Number(n.revenue || 0), 0);

    // Indicadores Financieros de Dirección General
    const bizRevenue = Number(draft.total_business_revenue || 0) || totalAttributedRevenue;
    const newCustomers = Number(draft.new_customers_acquired || 0);
    const ltv = Number(draft.customer_ltv || 0);
    const marginPct = Number(draft.gross_margin_pct || 0);
    const monthlyMarginPerCust = Number(draft.avg_monthly_margin_per_customer || 0);

    const costPerNewCustomer =
      totalAdSpend > 0 && newCustomers > 0 ? totalAdSpend / newCustomers : 0;
    const customerProfitMultiplier =
      costPerNewCustomer > 0 && ltv > 0 ? ltv / costPerNewCustomer : 0;
    const totalCashMultiplier =
      totalAdSpend > 0 && bizRevenue > 0 ? bizRevenue / totalAdSpend : 0;

    const baseRevForMargin = totalAttributedRevenue > 0 ? totalAttributedRevenue : bizRevenue;
    const netContribution = baseRevForMargin * (marginPct / 100);
    const netProfitPerEuro =
      totalAdSpend > 0 && netContribution > 0 ? netContribution / totalAdSpend : 0;

    const paybackMonths =
      costPerNewCustomer > 0 && monthlyMarginPerCust > 0
        ? costPerNewCustomer / monthlyMarginPerCust
        : 0;

    const funnelConvRate =
      totalWebVisits > 0 && newCustomers > 0 ? (newCustomers / totalWebVisits) * 100 : 0;

    const totalPaidTrafficClicks = paidList
      .filter((p) => p.objective_type === 'Tráfico Web')
      .reduce((s, p) => s + Number(p.results_count || 0), 0);
    const freeTrafficSharePct =
      totalWebVisits > 0
        ? Math.max(
            0,
            Math.min(100, ((totalWebVisits - totalPaidTrafficClicks) / totalWebVisits) * 100)
          )
        : 100;

    const webVisitsYoY = calcYoY(totalWebVisits, Number(draft.prev_year_web_visits || 0));
    const revenueYoY = calcYoY(bizRevenue, Number(draft.prev_year_revenue || 0));

    // Enriquecer canales orgánicos con cuota web y % de clic
    const enrichedOrgList = [...orgList]
      .map((ch) => {
        const webSharePct =
          totalWebVisits > 0 ? (Number(ch.web_visits || 0) / totalWebVisits) * 100 : 0;
        const clickRatePct =
          Number(ch.organic_reach || 0) > 0
            ? (Number(ch.web_visits || 0) / Number(ch.organic_reach || 0)) * 100
            : 0;
        return {
          ...ch,
          webSharePct,
          clickRatePct,
        };
      })
      .sort((a, b) => b.web_visits - a.web_visits);

    // Auditoría de cada campaña Paid en lenguaje claro
    const evaluatedPaid = paidList.map((camp) => {
      const spend = Number(camp.ad_spend || 0);
      const results = Number(camp.results_count || 0);
      const rev = Number(camp.revenue || 0);

      const unitCost = spend > 0 && results > 0 ? spend / results : 0;
      const salesMultiplier = spend > 0 && rev > 0 ? rev / spend : 0;
      const avgTicket = rev > 0 && results > 0 ? rev / results : 0;

      let verdict: 'ESCALAR' | 'OPTIMIZAR' | 'FUGA / CORTAR' | 'SIN COSTE' = 'SIN COSTE';
      let reason = 'Impulso sin coste asignado en esta línea.';

      if (spend > 0) {
        if (results === 0 && rev === 0) {
          verdict = 'FUGA / CORTAR';
          reason = `Gasto de ${formatEur(spend)} sin ventas ni contactos registrados.`;
        } else if (rev > 0 && salesMultiplier < 1) {
          verdict = 'FUGA / CORTAR';
          reason = `Pérdida directa: retorna ${salesMultiplier.toFixed(2)} € por cada 1 € invertido.`;
        } else if (
          (camp.objective_type === 'Mensajes / Leads' ||
            camp.objective_type === 'Ventas / Compras') &&
          draft.target_max_cpa > 0 &&
          unitCost > draft.target_max_cpa
        ) {
          verdict = 'FUGA / CORTAR';
          reason = `Coste de ${unitCost.toFixed(2)} € supera el máximo rentable (${draft.target_max_cpa} €).`;
        } else if (
          camp.objective_type === 'Tráfico Web' &&
          draft.target_max_cpa > 0 &&
          unitCost > draft.target_max_cpa
        ) {
          verdict = 'FUGA / CORTAR';
          reason = `Coste por visita (${unitCost.toFixed(2)} €) supera el umbral (${draft.target_max_cpa} €).`;
        } else if (
          (rev > 0 && salesMultiplier >= draft.target_min_roas) ||
          (unitCost > 0 && unitCost <= draft.target_max_cpa)
        ) {
          verdict = 'ESCALAR';
          reason =
            rev > 0
              ? `Alta rentabilidad: ${salesMultiplier.toFixed(2)} € por euro · Compra media ${formatEur(avgTicket)}.`
              : `Captación eficiente: ${unitCost.toFixed(2)} € por ${camp.result_unit_label.replace(/s$/, '')}.`;
        } else {
          verdict = 'OPTIMIZAR';
          reason = 'Rentabilidad media; margen de mejora en anuncio o página.';
        }
      }

      return {
        ...camp,
        unitCost,
        salesMultiplier,
        avgTicket,
        verdict,
        reason,
      };
    });

    // Agrupación por Objetivo
    const byObjectiveMap = new Map<
      ObjectiveCategory,
      {
        objective: ObjectiveCategory;
        unit: string;
        totalResults: number;
        totalSpend: number;
        totalRevenue: number;
      }
    >();

    paidList.forEach((ch) => {
      const hasActivity = ch.results_count > 0 || ch.ad_spend > 0 || ch.revenue > 0;
      if (!hasActivity) return;
      const existing = byObjectiveMap.get(ch.objective_type);
      if (existing) {
        existing.totalResults += Number(ch.results_count || 0);
        existing.totalSpend += Number(ch.ad_spend || 0);
        existing.totalRevenue += Number(ch.revenue || 0);
      } else {
        byObjectiveMap.set(ch.objective_type, {
          objective: ch.objective_type,
          unit: ch.result_unit_label || OBJECTIVE_UNIT_DEFAULTS[ch.objective_type],
          totalResults: Number(ch.results_count || 0),
          totalSpend: Number(ch.ad_spend || 0),
          totalRevenue: Number(ch.revenue || 0),
        });
      }
    });

    const objectiveGroups = Array.from(byObjectiveMap.values()).map((grp) => ({
      ...grp,
      avgUnitCost: grp.totalResults > 0 && grp.totalSpend > 0 ? grp.totalSpend / grp.totalResults : 0,
      avgTicket:
        grp.totalRevenue > 0 && grp.totalResults > 0 ? grp.totalRevenue / grp.totalResults : 0,
    }));

    // Tarjetas de Diagnóstico Directivo
    const activeSpendCampaigns = evaluatedPaid.filter((c) => c.ad_spend > 0);
    const leakingCampaigns = evaluatedPaid.filter((c) => c.verdict === 'FUGA / CORTAR');
    const wastedSpend = leakingCampaigns.reduce((s, c) => s + Number(c.ad_spend || 0), 0);

    const bestPaid = [...activeSpendCampaigns]
      .filter((c) => c.verdict === 'ESCALAR')
      .sort(
        (a, b) =>
          (b.salesMultiplier || 1 / (b.unitCost || 999)) -
          (a.salesMultiplier || 1 / (a.unitCost || 999))
      )[0];

    const bestOrganic = enrichedOrgList[0];

    let profitableTitle = 'Sin datos suficientes';
    let profitableWhy = 'Carga campañas o canales para detectar el motor principal.';
    if (bestPaid) {
      profitableTitle = `${bestPaid.platform} (${bestPaid.campaign_label})`;
      profitableWhy = bestPaid.reason;
    } else if (bestOrganic) {
      profitableTitle = `${bestOrganic.name} (Canal Gratuito)`;
      profitableWhy = `Aporta ${formatCompact(bestOrganic.web_visits)} visitas web (${bestOrganic.webSharePct.toFixed(
        1
      )}% del total) con 0 € de gasto.`;
    }

    let leakTitle = 'Sin fugas de presupuesto';
    let leakWhy =
      activeSpendCampaigns.length > 0
        ? `Todas las campañas operan dentro del límite rentable (${draft.target_max_cpa} € máx.).`
        : 'Sin inversión publicitaria activa en este periodo.';
    if (leakingCampaigns.length > 0) {
      const worst = [...leakingCampaigns].sort((a, b) => b.ad_spend - a.ad_spend)[0];
      leakTitle = `${worst.platform} · ${worst.campaign_label} (${formatEur(wastedSpend)} en riesgo)`;
      leakWhy = worst.reason;
    }

    let funnelTitle = `Conversión a Cliente: ${funnelConvRate.toFixed(2)}%`;
    let funnelWhy =
      newCustomers > 0
        ? `De ${formatCompact(totalWebVisits)} visitas web se cerraron ${formatCompact(
            newCustomers
          )} clientes nuevos (a ${formatEur(costPerNewCustomer)} cada uno).`
        : 'Indica los nuevos clientes captados en el editor para calcular la conversión real.';
    if (totalWebVisits >= 2000 && funnelConvRate > 0 && funnelConvRate < 0.8) {
      funnelTitle = `Freno en el Cierre Web (${funnelConvRate.toFixed(2)}%)`;
      funnelWhy = `Llegan ${formatCompact(
        totalWebVisits
      )} visitas pero convierten pocas: revisar velocidad web móvil o atención comercial.`;
    }

    // Donut de Cuota de Tráfico Web
    let startPct = 0;
    const webTrafficDonut = enrichedOrgList
      .filter((n) => n.web_visits > 0)
      .map((n) => {
        const pct = totalWebVisits > 0 ? (Number(n.web_visits || 0) / totalWebVisits) * 100 : 0;
        const item = { ...n, pct, start: startPct };
        startPct += pct;
        return item;
      });

    const maxFinancialBar = Math.max(
      ...activeSpendCampaigns.map((c) => Math.max(c.ad_spend, c.revenue)),
      1
    );

    // Resumen Ejecutivo en español claro para Dirección General
    let generatedHeadline = `${draft.client_name}: `;
    if (totalAdSpend > 0 && bizRevenue > 0) {
      generatedHeadline += `Ingresos totales de ${formatEur(bizRevenue)} frente a ${formatEur(
        totalAdSpend
      )} invertidos en publicidad (entran ${totalCashMultiplier.toFixed(2)} € en caja por cada 1 € invertido; beneficio neto de ${netProfitPerEuro.toFixed(
        2
      )} € por euro). `;
      if (costPerNewCustomer > 0) {
        generatedHeadline += `Se captaron ${formatCompact(
          newCustomers
        )} clientes nuevos a un coste de ${formatEur(costPerNewCustomer)} por cliente${
          customerProfitMultiplier > 0
            ? `, multiplicando x${customerProfitMultiplier.toFixed(1)} su valor a lo largo de su estancia`
            : ''
        }${paybackMonths > 0 ? ` (inversión recuperada en ${paybackMonths.toFixed(1)} meses)` : ''}. `;
      }
    } else {
      generatedHeadline += `Comunidad de ${formatCompact(
        totalFollowers
      )} seguidores (+${formatCompact(totalOrganicGrowth)} netos) y ${formatCompact(
        totalWebVisits
      )} visitas web (${freeTrafficSharePct.toFixed(0)}% tráfico gratuito sin anuncios). `;
    }

    if (leakingCampaigns.length > 0) {
      generatedHeadline += `PUNTO DE ATENCIÓN: ${leakingCampaigns
        .map((c) => `${c.platform} (${c.campaign_label})`)
        .join(', ')} concentra ${formatEur(wastedSpend)} con baja rentabilidad y requiere ajuste.`;
    }

    return {
      orgList,
      enrichedOrgList,
      evaluatedPaid,
      activeSpendCampaigns,
      totalFollowers,
      totalOrganicGrowth,
      totalOrganicReach,
      totalWebVisits,
      webVisitsYoY,
      totalPaidReach,
      totalAdSpend,
      totalAttributedRevenue,
      bizRevenue,
      revenueYoY,
      newCustomers,
      costPerNewCustomer,
      customerProfitMultiplier,
      totalCashMultiplier,
      netProfitPerEuro,
      paybackMonths,
      funnelConvRate,
      freeTrafficSharePct,
      objectiveGroups,
      profitableTitle,
      profitableWhy,
      leakTitle,
      leakWhy,
      hasLeak: leakingCampaigns.length > 0,
      funnelTitle,
      funnelWhy,
      webTrafficDonut,
      maxFinancialBar,
      generatedHeadline,
    };
  }, [draft]);

  const activeHeadline = draft.auto_diagnosis
    ? summary.generatedHeadline
    : draft.custom_headline || summary.generatedHeadline;

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
              onClick={() => setShowGuide((p) => !p)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#015b9d] border border-sky-200 text-xs font-extrabold cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Cómo Sacar los Datos en Plataformas</span>
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
              <span>Exportar PDF / Imprimir</span>
            </button>
          </div>
        </div>

        {/* GUÍA PRÁCTICA DE EXTRACCIÓN DE MÉTRICAS EN CADA PLATAFORMA */}
        {showGuide && (
          <div className="no-print bg-white p-5 rounded-3xl border-2 border-[#015b9d] shadow-md space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-black text-slate-900">
                Guía Práctica: Dónde y Cómo Extraer cada Dato en las Plataformas
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
        {/* EDITOR DE DATOS EN LENGUAJE CLARO                                 */}
        {/* ================================================================= */}
        {editMode && (
          <form
            onSubmit={handleSave}
            className="no-print bg-white p-5 rounded-3xl border-2 border-[#f5b514] shadow-lg space-y-5 text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Configuración del Informe Ejecutivo · {selectedMonth}
                </h2>
                <p className="text-[11px] text-slate-500">
                  Escribe los números sin puntos de millar (ej. 38689). Todos los cálculos financieros se generan automáticamente.
                </p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-slate-900 text-white font-black px-5 py-2.5 rounded-full cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#f5b514]" />
                <span>Guardar y Actualizar Informe</span>
              </button>
            </div>

            {/* 1. IDENTIDAD Y DATOS DE NEGOCIO */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-black uppercase text-[#015b9d]">
                1A. Datos de la Empresa y Límites de Rentabilidad
              </div>
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
                    Coste Máx. por Resultado (€)
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
                    Retorno Mínimo Venta (x)
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

              {/* Cifras de Caja y Clientes */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="font-black uppercase text-emerald-800">
                  1B. Cifras de Caja y Clientes del Mes (Para los Indicadores Financieros de Dirección)
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
                      Valor Total por Cliente (€)
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
                      Margen Bruto Negocio (%)
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
                      Beneficio Mensual/Cliente (€)
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

              {/* Comparativa Año Anterior */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-slate-200 items-end">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Visitas Web Mismo Mes Año Pasado
                  </label>
                  <input
                    type="number"
                    value={draft.prev_year_web_visits}
                    onChange={(e) =>
                      setDraft({ ...draft, prev_year_web_visits: Number(e.target.value) })
                    }
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-right"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Facturación Mismo Mes Año Pasado (€)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={draft.prev_year_revenue}
                    onChange={(e) =>
                      setDraft({ ...draft, prev_year_revenue: Number(e.target.value) })
                    }
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-right"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subtítulo Cabecera</label>
                  <input
                    type="text"
                    value={draft.client_subtitle}
                    onChange={(e) => setDraft({ ...draft, client_subtitle: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subtítulo Visitas Web</label>
                  <input
                    type="text"
                    value={draft.web_kpi_subtitle}
                    onChange={(e) => setDraft({ ...draft, web_kpi_subtitle: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <label className="inline-flex items-center gap-2 font-extrabold text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.auto_diagnosis}
                    onChange={(e) => setDraft({ ...draft, auto_diagnosis: e.target.checked })}
                  />
                  <Sparkles className="w-3.5 h-3.5 text-[#ed6723]" />
                  <span>Redactar Resumen Ejecutivo automáticamente en lenguaje directivo</span>
                </label>
              </div>
              {!draft.auto_diagnosis && (
                <textarea
                  rows={2}
                  value={draft.custom_headline}
                  onChange={(e) => setDraft({ ...draft, custom_headline: e.target.value })}
                  placeholder="Escribe el resumen ejecutivo personalizado..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs"
                />
              )}
            </div>

            {/* 2A. PRESENCIA ORGÁNICA POR CANAL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black uppercase text-slate-900">
                  2A. Canales Orgánicos y Tráfico Web Gratuito (1 fila por red o fuente)
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
                      <th className="p-2 text-right">Nuevos Seguidores</th>
                      <th className="p-2 text-right">Visualizaciones</th>
                      <th className="p-2 text-right">Visitas Web</th>
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
                            className="w-40 px-2 py-1 rounded border border-slate-300 font-black"
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

            {/* 2B. CAMPAÑAS DE PAGO POR OBJETIVO */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black uppercase text-[#015b9d]">
                  2B. Campañas de Publicidad de Pago (Separadas por Objetivo)
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
                      <th className="p-2 text-right">Personas Alcanzadas</th>
                      <th className="p-2 text-right">Inversión (€)</th>
                      <th className="p-2 text-right">Resultados</th>
                      <th className="p-2">Unidad</th>
                      <th className="p-2 text-right">Ventas (€)</th>
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
                            className="w-36 px-2 py-1 rounded border border-slate-300 bg-white text-[11px] font-extrabold text-slate-900"
                          >
                            <option value="Tráfico Web">Tráfico Web</option>
                            <option value="Mensajes / Leads">Mensajes / Leads</option>
                            <option value="Ventas / Compras">Ventas / Compras</option>
                            <option value="Alcance / Branding">Alcance / Branding</option>
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
                            className="w-20 px-1.5 py-1 rounded border border-emerald-300 bg-emerald-50/50 text-right font-bold"
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

            {/* 3. MERCADOS EMISORES */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black uppercase text-[#015b9d]">
                  3. Mercados Emisores / Segmentación de Clientes
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

            {/* 4. PLAN DE ACCIÓN */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 uppercase">
                  4. Plan de Acción Recomendado a Dirección
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
                        <option value="CORREGIR">CORREGIR</option>
                        <option value="MANTENER">MANTENER</option>
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
                      value={dir.decision}
                      onChange={(e) => updateDirective(dir.id, 'decision', e.target.value)}
                      className="w-full p-2 rounded bg-white border border-slate-300 text-[11px]"
                    />
                    <input
                      type="text"
                      value={dir.expected_impact}
                      onChange={(e) =>
                        updateDirective(dir.id, 'expected_impact', e.target.value)
                      }
                      className="w-full px-2 py-1 rounded bg-white border border-slate-300 text-[11px] font-semibold"
                    />
                  </div>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* ===================================================================== */}
        {/* DOCUMENTO EJECUTIVO VISUAL (LIMPIO Y ORDENADO PARA DIRECCIÓN)         */}
        {/* ===================================================================== */}
        <div
          id="ceo-visual-report"
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* CABECERA CON LOGO */}
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

          {/* BANDA DE TÍTULO Y PERIODO */}
          <div className="bg-slate-950 text-white px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-xs sm:text-sm font-black tracking-wider uppercase">
              INFORME EJECUTIVO DE RESULTADOS Y RENTABILIDAD · {draft.client_name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {(summary.webVisitsYoY !== null || summary.revenueYoY !== null) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold">
                  <CalendarRange className="w-3.5 h-3.5 text-[#f5b514]" />
                  {summary.revenueYoY !== null
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
            {/* SÍNTESIS EJECUTIVA */}
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs sm:text-sm leading-relaxed border-l-4 border-[#f5b514]">
              <strong className="text-[#f5b514] uppercase text-xs tracking-wider mr-2">
                Resumen Ejecutivo:
              </strong>
              {activeHeadline}
            </div>

            {/* BLOQUE 1: SALUD FINANCIERA DEL NEGOCIO (EN ESPAÑOL CLARO SIN SIGLAS) */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900">
                  <Briefcase className="w-4 h-4 text-[#015b9d]" />
                  <span>1. Salud Financiera y Rentabilidad de la Inversión</span>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Caja Total: <strong className="text-slate-950">{formatEur(summary.bizRevenue)}</strong> · Inversión Publicidad: <strong className="text-slate-950">{formatEur(summary.totalAdSpend)}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                  <div className="text-[10px] font-black uppercase text-slate-500 flex items-center justify-between">
                    <span>Retorno Caja Total</span>
                    <Scale className="w-3.5 h-3.5 text-[#015b9d]" />
                  </div>
                  <div className="text-xl font-black text-slate-950 mt-1">
                    {summary.totalCashMultiplier > 0
                      ? `${summary.totalCashMultiplier.toFixed(2)}x`
                      : '—'}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-1">
                    Euros en caja por 1 € invertido
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                  <div className="text-[10px] font-black uppercase text-slate-500">
                    Coste Cliente Nuevo
                  </div>
                  <div className="text-xl font-black text-slate-950 mt-1">
                    {summary.costPerNewCustomer > 0 ? formatEur(summary.costPerNewCustomer) : '—'}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-1">
                    {summary.newCustomers > 0
                      ? `${formatCompact(summary.newCustomers)} clientes captados`
                      : 'Sin altas registradas'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                  <div className="text-[10px] font-black uppercase text-slate-500">
                    Rentabilidad Cliente
                  </div>
                  <div
                    className={`text-xl font-black mt-1 ${
                      summary.customerProfitMultiplier >= 3
                        ? 'text-emerald-700'
                        : summary.customerProfitMultiplier > 0 &&
                            summary.customerProfitMultiplier < 1.5
                          ? 'text-rose-600'
                          : 'text-slate-950'
                    }`}
                  >
                    {summary.customerProfitMultiplier > 0
                      ? `x${summary.customerProfitMultiplier.toFixed(1)}`
                      : '—'}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-1">
                    {summary.customerProfitMultiplier >= 3
                      ? 'Muy saludable (Meta ≥ x3)'
                      : draft.customer_ltv > 0
                        ? `Valor cliente: ${formatEur(draft.customer_ltv)}`
                        : 'Definir valor cliente'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                  <div className="text-[10px] font-black uppercase text-slate-500">
                    Beneficio Neto / Euro
                  </div>
                  <div
                    className={`text-xl font-black mt-1 ${
                      summary.netProfitPerEuro >= 2
                        ? 'text-emerald-700'
                        : summary.netProfitPerEuro > 0 && summary.netProfitPerEuro < 1
                          ? 'text-rose-600'
                          : 'text-slate-950'
                    }`}
                  >
                    {summary.netProfitPerEuro > 0 ? `${summary.netProfitPerEuro.toFixed(2)} €` : '—'}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-1">
                    Tras margen bruto ({draft.gross_margin_pct}%)
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                  <div className="text-[10px] font-black uppercase text-slate-500 flex items-center justify-between">
                    <span>Plazo Recuperación</span>
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="text-xl font-black text-slate-950 mt-1">
                    {summary.paybackMonths > 0 ? `${summary.paybackMonths.toFixed(1)} meses` : '—'}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-1">
                    Tiempo en amortizar captación
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                  <div className="text-[10px] font-black uppercase text-slate-500">
                    Tráfico Gratuito
                  </div>
                  <div className="text-xl font-black text-[#015b9d] mt-1">
                    {summary.freeTrafficSharePct.toFixed(0)}%
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight mt-1">
                    Visitas sin pagar anuncios
                  </div>
                </div>
              </div>
            </div>

            {/* BLOQUE 2: DIAGNÓSTICO DIRECTIVO (3 TARJETAS DE DECISIÓN) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-black uppercase text-emerald-800">
                    Qué funciona y es más rentable
                  </div>
                  <div className="text-xs font-black text-emerald-950 mt-0.5">
                    {summary.profitableTitle}
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-snug mt-1">
                    {summary.profitableWhy}
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  summary.hasLeak
                    ? 'bg-rose-50 border-rose-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <AlertTriangle
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    summary.hasLeak ? 'text-rose-600' : 'text-slate-500'
                  }`}
                />
                <div>
                  <div
                    className={`text-[10px] font-black uppercase ${
                      summary.hasLeak ? 'text-rose-800' : 'text-slate-600'
                    }`}
                  >
                    Dónde se pierde dinero y por qué
                  </div>
                  <div
                    className={`text-xs font-black mt-0.5 ${
                      summary.hasLeak ? 'text-rose-950' : 'text-slate-900'
                    }`}
                  >
                    {summary.leakTitle}
                  </div>
                  <p
                    className={`text-[11px] leading-snug mt-1 ${
                      summary.hasLeak ? 'text-rose-900' : 'text-slate-600'
                    }`}
                  >
                    {summary.leakWhy}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                <Filter className="w-5 h-5 text-[#ed6723] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-black uppercase text-amber-900">
                    Conversión Web y Cierre Comercial
                  </div>
                  <div className="text-xs font-black text-amber-950 mt-0.5">
                    {summary.funnelTitle}
                  </div>
                  <p className="text-[11px] text-amber-900 leading-snug mt-1">
                    {summary.funnelWhy}
                  </p>
                </div>
              </div>
            </div>

            {/* BLOQUE 3: RESUMEN DE TRACCIÓN GLOBAL (4 TARJETAS LIMPIAS) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">
                    Comunidad Total
                  </div>
                  <div className="text-2xl font-black text-slate-950 mt-0.5">
                    {formatCompact(summary.totalFollowers)}
                  </div>
                  <div className="text-[11px] font-extrabold text-emerald-700 mt-0.5">
                    {summary.totalOrganicGrowth >= 0
                      ? `+${formatCompact(summary.totalOrganicGrowth)}`
                      : formatCompact(summary.totalOrganicGrowth)}{' '}
                    nuevos/mes
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">
                    Visualizaciones Gratuitas
                  </div>
                  <div className="text-2xl font-black text-slate-950 mt-0.5">
                    {formatCompact(summary.totalOrganicReach)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Sin inversión publicitaria
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#e1306c] flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">
                    Alcance Publicidad
                  </div>
                  <div className="text-2xl font-black text-slate-950 mt-0.5">
                    {formatCompact(summary.totalPaidReach)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Gasto: {formatEur(summary.totalAdSpend)}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#015b9d] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">
                    Visitas a la Web
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-black text-slate-950">
                      {formatCompact(summary.totalWebVisits)}
                    </span>
                    {summary.webVisitsYoY !== null && (
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                          summary.webVisitsYoY >= 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {summary.webVisitsYoY >= 0
                          ? `+${summary.webVisitsYoY.toFixed(0)}%`
                          : `${summary.webVisitsYoY.toFixed(0)}%`}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-[#015b9d] mt-0.5">
                    {draft.web_kpi_subtitle}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#ed6723] flex items-center justify-center shrink-0">
                  <MousePointerClick className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* BLOQUE 4: TABLAS DE RENDIMIENTO (ORGÁNICO Y PAGO) */}
            <div className="space-y-5">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                  2. Rendimiento de Canales Orgánicos ({summary.orgList.length} fuentes activas)
                </h2>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-[11px] font-black border-b border-slate-200">
                        <th className="py-2.5 px-4">Canal / Fuente</th>
                        <th className="py-2.5 px-3 text-center">Comunidad Total</th>
                        <th className="py-2.5 px-3 text-center">Crecimiento Mes</th>
                        <th className="py-2.5 px-3 text-center">Visualizaciones</th>
                        <th className="py-2.5 px-3 text-center">Visitas a la Web</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {summary.orgList.map((net) => {
                        const orgPositive = net.organic_growth_net >= 50;
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
                              {net.followers_total > 0 ? formatCompact(net.followers_total) : '—'}
                            </td>
                            <td className="py-2.5 px-3 text-center">
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
                        <td className="py-2.5 px-4 uppercase">TOTAL ORGÁNICO</td>
                        <td className="py-2.5 px-3 text-center text-[#f5b514]">
                          {formatCompact(summary.totalFollowers)}
                        </td>
                        <td className="py-2.5 px-3 text-center text-emerald-400">
                          {summary.totalOrganicGrowth >= 0
                            ? `+${formatCompact(summary.totalOrganicGrowth)}`
                            : formatCompact(summary.totalOrganicGrowth)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {formatCompact(summary.totalOrganicReach)}
                        </td>
                        <td className="py-2.5 px-3 text-center text-[#f5b514]">
                          {formatCompact(summary.totalWebVisits)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {draft.show_paid_section && summary.evaluatedPaid.length > 0 && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      3. Rendimiento de Campañas de Pago por Objetivo (Coste Máx:{' '}
                      {draft.target_max_cpa} € · Retorno Meta: {draft.target_min_roas}x)
                    </h2>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 text-[11px] font-black border-b border-slate-200">
                          <th className="py-2.5 px-4">Plataforma · Campaña</th>
                          <th className="py-2.5 px-3">Objetivo</th>
                          <th className="py-2.5 px-3 text-center">Alcance</th>
                          <th className="py-2.5 px-3 text-center">Inversión</th>
                          <th className="py-2.5 px-3 text-center">Resultados / Ventas</th>
                          <th className="py-2.5 px-3 text-center">Coste / Compra Media</th>
                          <th className="py-2.5 px-4 text-center">Decisión</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {summary.evaluatedPaid.map((camp) => {
                          const badgeStyle =
                            camp.verdict === 'ESCALAR'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : camp.verdict === 'FUGA / CORTAR'
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
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                  <Target className="w-2.5 h-2.5 text-[#015b9d]" />
                                  {camp.objective_type}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center font-semibold text-slate-700">
                                {formatCompact(camp.paid_reach)}
                              </td>
                              <td className="py-2.5 px-3 text-center font-black text-slate-900">
                                {formatEur(camp.ad_spend)}
                              </td>
                              <td className="py-2.5 px-3 text-center font-black text-slate-900">
                                {formatCompact(camp.results_count)}{' '}
                                <span className="text-[10px] font-semibold text-slate-500">
                                  {camp.result_unit_label}
                                </span>
                                {camp.revenue > 0 && (
                                  <div className="text-[10px] text-emerald-700">
                                    Ventas: {formatEur(camp.revenue)}
                                  </div>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                {camp.unitCost > 0 ? (
                                  <span
                                    className={`font-black ${
                                      camp.unitCost > draft.target_max_cpa
                                        ? 'text-rose-600'
                                        : 'text-emerald-700'
                                    }`}
                                  >
                                    {camp.unitCost.toFixed(2)} € / ud
                                  </span>
                                ) : (
                                  '—'
                                )}
                                {camp.avgTicket > 0 && (
                                  <div className="text-[10px] font-bold text-[#015b9d]">
                                    Compra media: {formatEur(camp.avgTicket)}
                                  </div>
                                )}
                                {camp.salesMultiplier > 0 && (
                                  <div className="text-[10px] font-semibold text-slate-500">
                                    Retorno: {camp.salesMultiplier.toFixed(2)}x
                                  </div>
                                )}
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black border ${badgeStyle}`}
                                >
                                  {camp.verdict}
                                </span>
                                <div className="text-[9px] text-slate-500 mt-1 max-w-[170px] mx-auto leading-tight">
                                  {camp.reason}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {summary.objectiveGroups.length > 0 && (
                    <div className="rounded-2xl bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-[#f5b514]">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          Resumen por Objetivo ({formatEur(summary.totalAdSpend)} invertidos
                          {summary.totalAttributedRevenue > 0
                            ? ` · ${formatEur(summary.totalAttributedRevenue)} en ventas`
                            : ''}
                          ):
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {summary.objectiveGroups.map((grp) => (
                          <div
                            key={grp.objective}
                            className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-xs flex items-center gap-3"
                          >
                            <div>
                              <span className="text-[10px] uppercase text-[#f5b514] font-black block">
                                {grp.objective}
                              </span>
                              <span className="font-black">
                                {formatCompact(grp.totalResults)} {grp.unit}
                              </span>{' '}
                              <span className="text-slate-300 text-[11px]">
                                ({formatEur(grp.totalSpend)})
                              </span>
                            </div>
                            {grp.avgUnitCost > 0 && (
                              <div className="text-right border-l border-white/20 pl-3">
                                <span className="text-[9px] uppercase text-slate-400 block">
                                  Coste Medio
                                </span>
                                <span className="font-black text-emerald-400">
                                  {grp.avgUnitCost.toFixed(2)} €
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BLOQUE 5: GRÁFICOS VISUALES CLAROS Y MERCADOS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#015b9d]" />
                      <h3 className="text-xs font-black uppercase text-slate-900">
                        4. Aporte de Visitas Web e Interés por Canal
                      </h3>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">
                      % de visitas sobre visualizaciones
                    </span>
                  </div>

                  <div className="space-y-2">
                    {summary.enrichedOrgList.map((net) => {
                      const highClickRate = net.clickRatePct >= 3.5;
                      return (
                        <div
                          key={net.id}
                          className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: net.color }}
                              />
                              <span className="font-black text-slate-900">{net.name}</span>
                              {net.organic_reach > 0 && (
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                    highClickRate
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  Interés: {net.clickRatePct.toFixed(2)}%
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <strong className="text-slate-950 font-black">
                                {formatCompact(net.web_visits)} visitas
                              </strong>{' '}
                              <span className="text-slate-400 font-bold">
                                ({net.webSharePct.toFixed(1)}%)
                              </span>
                            </div>
                          </div>

                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.max(net.webSharePct, net.web_visits > 0 ? 4 : 0)}%`,
                                backgroundColor: net.color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {draft.show_paid_section &&
                  summary.activeSpendCampaigns.some((c) => c.revenue > 0) && (
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase text-slate-900">
                          Comparativa Económica: Gasto en Anuncios vs. Ventas Generadas
                        </span>
                        <div className="flex items-center gap-3 text-[10px] font-bold">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" /> Gasto
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Ventas (€)
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {summary.activeSpendCampaigns.map((camp) => {
                          const spendPct = Math.max(
                            3,
                            Math.round((camp.ad_spend / summary.maxFinancialBar) * 100)
                          );
                          const revPct = Math.round(
                            (camp.revenue / summary.maxFinancialBar) * 100
                          );
                          return (
                            <div key={camp.id} className="space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="font-bold text-slate-800">
                                  {camp.platform} ({camp.campaign_label})
                                </span>
                                <span>
                                  <span className="text-rose-600 font-bold">
                                    -{formatEur(camp.ad_spend)}
                                  </span>{' '}
                                  →{' '}
                                  <strong className="text-emerald-700">
                                    +{formatEur(camp.revenue)}
                                  </strong>
                                </span>
                              </div>
                              <div className="space-y-0.5">
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="bg-rose-500 h-full rounded-full"
                                    style={{ width: `${spendPct}%` }}
                                  />
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="bg-emerald-500 h-full rounded-full"
                                    style={{ width: `${revPct}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>

              <div className="lg:col-span-5 p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Globe className="w-4 h-4 text-[#015b9d]" />
                    <h3 className="text-xs font-black uppercase text-slate-900">
                      5. Origen del Tráfico Web y Mercados
                    </h3>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex items-center gap-4">
                    <div className="relative w-24 h-24 shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        {summary.webTrafficDonut.map((seg) => (
                          <circle
                            key={seg.id}
                            cx="18"
                            cy="18"
                            r="15.915"
                            fill="transparent"
                            stroke={seg.color}
                            strokeWidth="4.4"
                            strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                            strokeDashoffset={-seg.start}
                          />
                        ))}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-black text-slate-950 leading-none">
                          {formatCompact(summary.totalWebVisits)}
                        </span>
                        <span className="text-[8px] font-bold uppercase text-slate-400 mt-0.5">
                          Visitas
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px] w-full">
                      {summary.webTrafficDonut.map((seg) => (
                        <div key={seg.id} className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 font-bold text-slate-700 leading-tight">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: seg.color }}
                            />
                            <span>{seg.name}</span>
                          </span>
                          <span className="font-black text-slate-950 shrink-0">
                            {seg.pct.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {draft.markets.length > 0 && (
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-2.5 text-[11px]">
                    <div className="font-black text-slate-900 uppercase text-[10px] tracking-wider">
                      Mercados Emisores / Perfil de Demanda
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
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: mkt.market_a_color }}
                            />
                            {mkt.market_a_name}: <strong>{mkt.market_a_pct}%</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: mkt.market_b_color }}
                            />
                            {mkt.market_b_name}: <strong>{mkt.market_b_pct}%</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-emerald-50/90 p-3.5 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 flex items-start gap-2">
                  <Trophy className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>{draft.competitive_note_title}:</strong> {draft.competitive_note_text}
                  </div>
                </div>
              </div>
            </div>

            {/* BLOQUE 6: PLAN DE ACCIÓN RECOMENDADO */}
            <div className="rounded-2xl bg-amber-50/80 border-2 border-[#f5b514] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#ed6723]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">
                    6. Plan de Acción Recomendado para el Próximo Mes
                  </h3>
                </div>
                <span className="text-[10px] font-black uppercase text-amber-900">
                  Aprobación Dirección General
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {draft.directives.map((dir) => {
                  const pill =
                    dir.status === 'ESCALAR'
                      ? 'bg-emerald-700 text-white'
                      : dir.status === 'CORREGIR'
                        ? 'bg-rose-700 text-white'
                        : 'bg-slate-900 text-[#f5b514]';
                  return (
                    <div
                      key={dir.id}
                      className="bg-white p-3.5 rounded-xl border border-amber-200 flex flex-col justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1.5 mb-1">
                          <span className="font-black text-xs text-slate-950">{dir.area}</span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${pill}`}>
                            {dir.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-snug">{dir.decision}</p>
                      </div>
                      <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-extrabold text-[#015b9d]">
                        <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                        <span>Objetivo: {dir.expected_impact}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}