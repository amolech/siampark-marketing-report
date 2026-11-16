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
} from 'lucide-react';

export type ObjectiveCategory =
  | 'Tráfico Web'
  | 'Mensajes / Leads'
  | 'Ventas / Compras'
  | 'Alcance / Branding';

interface DynamicChannel {
  id: string;
  name: string;
  color: string;
  objective_type: ObjectiveCategory;
  result_unit_label: string;
  followers_total: number;
  organic_growth_net: number;
  organic_reach: number;
  paid_reach_clicks: number;
  web_visits: number;
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
  target_max_cpa: number; // Coste máximo rentable por resultado/lead/venta (€)
  target_min_roas: number; // ROAS mínimo rentable (ej. 3.0x)
  auto_diagnosis: boolean;
  custom_headline: string;
  show_financials: boolean;
  channels: DynamicChannel[];
  markets: MarketSegment[];
  competitive_note_title: string;
  competitive_note_text: string;
  directives: CeoDirective[];
}

const SIAM_LOGO_URL =
  'https://siampark.net/templates/yootheme/cache/d1/siam-park-tenerife-main-logo-d1ab9a93.webp';

const STORAGE_KEY = 'agency_ceo_profitability_engine_v8';

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
  'Mensajes / Leads': 'leads',
  'Ventas / Compras': 'ventas',
  'Alcance / Branding': 'impactos',
};

const DEFAULT_SIAM_TEMPLATE: ClientTemplateReport = {
  client_name: 'SIAM PARK TENERIFE',
  client_subtitle: 'THE WATER KINGDOM',
  logo_data_url: SIAM_LOGO_URL,
  web_kpi_subtitle: 'Tráfico directo hacia web / taquilla',
  report_month: '2026-10',
  period_label: 'Octubre 2026 (01 – 31 Oct)',
  target_max_cpa: 15,
  target_min_roas: 3.0,
  auto_diagnosis: true,
  custom_headline: '',
  show_financials: true,
  channels: [
    {
      id: 'tiktok',
      name: 'TikTok',
      color: '#0f172a',
      objective_type: 'Alcance / Branding',
      result_unit_label: 'impactos',
      followers_total: 20350,
      organic_growth_net: 1250,
      organic_reach: 163620,
      paid_reach_clicks: 18400,
      web_visits: 640,
      ad_spend: 0,
      results_count: 0,
      revenue: 0,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      color: '#e1306c',
      objective_type: 'Alcance / Branding',
      result_unit_label: 'impactos',
      followers_total: 218770,
      organic_growth_net: 441,
      organic_reach: 1690000,
      paid_reach_clicks: 24500,
      web_visits: 1120,
      ad_spend: 0,
      results_count: 0,
      revenue: 0,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      color: '#1877f2',
      objective_type: 'Tráfico Web',
      result_unit_label: 'clics',
      followers_total: 352290,
      organic_growth_net: 424,
      organic_reach: 736800,
      paid_reach_clicks: 15200,
      web_visits: 2453,
      ad_spend: 0,
      results_count: 2453,
      revenue: 0,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      color: '#0a66c2',
      objective_type: 'Alcance / Branding',
      result_unit_label: 'impactos',
      followers_total: 3200,
      organic_growth_net: 85,
      organic_reach: 14200,
      paid_reach_clicks: 0,
      web_visits: 190,
      ad_spend: 0,
      results_count: 0,
      revenue: 0,
    },
    {
      id: 'youtube',
      name: 'YouTube',
      color: '#dc2626',
      objective_type: 'Alcance / Branding',
      result_unit_label: 'views',
      followers_total: 9610,
      organic_growth_net: 48,
      organic_reach: 46850,
      paid_reach_clicks: 81500,
      web_visits: 520,
      ad_spend: 0,
      results_count: 0,
      revenue: 0,
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
  competitive_note_title: 'Posicionamiento Competitivo',
  competitive_note_text:
    'Superamos a Waterbom Bali en Facebook (352,3K vs. 334,1K) y multiplicamos x41 la audiencia YouTube de Aqualand Costa Adeje.',
  directives: [
    {
      id: 'dir-1',
      area: '1. Alianzas Talento VIP',
      status: 'ESCALAR',
      decision:
        'Programar 2 colaboraciones mensuales con creadores de España y Reino Unido tras el pico de alcance orgánico.',
      expected_impact: '+250K impactos orgánicos/mes sin pauta.',
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
      area: '3. Enlaces Directos a Web',
      status: 'CORREGIR',
      decision:
        'Activar enlaces directos con seguimiento en Instagram, TikTok y LinkedIn para igualar la tracción de Facebook (2.453 visitas).',
      expected_impact: '+60% tráfico web desde redes sociales.',
    },
  ],
};

const createBlankClientTemplate = (month: string): ClientTemplateReport => ({
  client_name: 'NUEVO CLIENTE',
  client_subtitle: 'INFORME EJECUTIVO DE RENTABILIDAD Y MARKETING',
  logo_data_url: '',
  web_kpi_subtitle: 'Clics directos hacia web / contacto',
  report_month: month,
  period_label: `Cierre Mensual · ${month}`,
  target_max_cpa: 12,
  target_min_roas: 3.0,
  auto_diagnosis: true,
  custom_headline: '',
  show_financials: true,
  channels: [
    {
      id: 'ch-ig-trafico',
      name: 'Instagram · Tráfico',
      color: '#e1306c',
      objective_type: 'Tráfico Web',
      result_unit_label: 'clics',
      followers_total: 0,
      organic_growth_net: 0,
      organic_reach: 0,
      paid_reach_clicks: 0,
      web_visits: 0,
      ad_spend: 0,
      results_count: 0,
      revenue: 0,
    },
    {
      id: 'ch-fb-mensajes',
      name: 'Facebook · Mensajes',
      color: '#1877f2',
      objective_type: 'Mensajes / Leads',
      result_unit_label: 'leads',
      followers_total: 0,
      organic_growth_net: 0,
      organic_reach: 0,
      paid_reach_clicks: 0,
      web_visits: 0,
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
      area: '1. Escalar Canal Rentable',
      status: 'ESCALAR',
      decision: 'Reasignar presupuesto desde campañas sin retorno hacia el canal con menor CPA.',
      expected_impact: '+25% conversiones manteniendo gasto.',
    },
    {
      id: 'dir-new-2',
      area: '2. Optimizar Conversión Web',
      status: 'CORREGIR',
      decision: 'Mejorar página de destino y oferta para convertir el tráfico que llega y no compra.',
      expected_impact: 'Subir tasa de conversión web.',
    },
    {
      id: 'dir-new-3',
      area: '3. Base Orgánica',
      status: 'MANTENER',
      decision: 'Mantener contenido de prueba social y casos reales para reducir dependencia de pauta.',
      expected_impact: 'Menor coste de adquisición global.',
    },
  ],
});

const DATA_SOURCES_GUIDE = [
  {
    network: 'Meta Business (Orgánico)',
    color: '#e1306c',
    organic: 'Estadísticas → Resultados: "Seguidores" (Crec. orgánico) y "Visualizaciones" (Alcance).',
    paid: 'Ver bloque Meta Ads Manager.',
    web: 'Estadísticas → Resultados: "Clics en el enlace" (total del mes).',
  },
  {
    network: 'Meta Ads por Objetivo',
    color: '#1877f2',
    organic: '—',
    paid: 'Tabla dinámica por Objetivo + Plataforma → Columna "Alcance" y "Monto gastado".',
    web: 'Columna "Resultados": separa filas de Tráfico (clics) de filas de Mensajes (leads).',
  },
  {
    network: 'TikTok & YouTube',
    color: '#0f172a',
    organic: 'TikTok Studio / YouTube Studio → Estadísticas → Seguidores netos + Visualizaciones.',
    paid: 'TikTok Ads / Google Ads → Alcance/Impresiones y Coste total.',
    web: 'Clics en enlace de bio/tarjetas + Google Analytics 4.',
  },
  {
    network: 'Google / LinkedIn / Otros',
    color: '#16a34a',
    organic: 'Search Console / LinkedIn Análisis → Impresiones y nuevos seguidores.',
    paid: 'Google Ads / LinkedIn Campaign Manager → Impresiones, Gasto y Conversiones.',
    web: 'GA4 → Adquisición de tráfico (Sesiones por fuente/medio).',
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

export default function CeoProfitabilityReportPage() {
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
    setToast('Plantilla en blanco lista para nuevo cliente');
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
    setToast('Diagnóstico de rentabilidad actualizado');
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
    a.download = `Informe-CEO-${safeClient || 'cliente'}-${selectedMonth}.json`;
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
          setDraft(imported[firstKey]);
          const merged = { ...reportsMap, ...imported };
          setReportsMap(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          setToast('Plantilla de cliente cargada');
          setTimeout(() => setToast(null), 3000);
        }
      } catch {
        alert('El archivo JSON no es válido.');
      }
    };
    reader.readAsText(file);
  };

  // Gestión dinámica de canales
  const handleAddChannel = () => {
    const nextColor = PRESET_COLORS[draft.channels.length % PRESET_COLORS.length];
    setDraft((prev) => ({
      ...prev,
      channels: [
        ...prev.channels,
        {
          id: `ch-${Date.now()}`,
          name: 'Nuevo Canal',
          color: nextColor,
          objective_type: 'Tráfico Web',
          result_unit_label: 'clics',
          followers_total: 0,
          organic_growth_net: 0,
          organic_reach: 0,
          paid_reach_clicks: 0,
          web_visits: 0,
          ad_spend: 0,
          results_count: 0,
          revenue: 0,
        },
      ],
    }));
  };

  const handleRemoveChannel = (id: string) => {
    if (draft.channels.length <= 1) return;
    setDraft((prev) => ({
      ...prev,
      channels: prev.channels.filter((c) => c.id !== id),
    }));
  };

  const updateChannelField = <K extends keyof DynamicChannel>(
    id: string,
    field: K,
    value: DynamicChannel[K]
  ) => {
    setDraft((prev) => ({
      ...prev,
      channels: prev.channels.map((ch) => {
        if (ch.id !== id) return ch;
        if (field === 'objective_type') {
          const objCat = value as ObjectiveCategory;
          return {
            ...ch,
            objective_type: objCat,
            result_unit_label: OBJECTIVE_UNIT_DEFAULTS[objCat],
          };
        }
        return { ...ch, [field]: value };
      }),
    }));
  };

  // Gestión dinámica de mercados
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

  // Gestión dinámica de directivas
  const handleAddDirective = () => {
    const num = draft.directives.length + 1;
    setDraft((prev) => ({
      ...prev,
      directives: [
        ...prev.directives,
        {
          id: `dir-${Date.now()}`,
          area: `${num}. Nueva Directiva`,
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
  // MOTOR DE AUDITORÍA FINANCIERA, RENTABILIDAD Y DETECCIÓN DE FUGAS PARA CEO
  // =========================================================================
  const summary = useMemo(() => {
    const list = draft.channels;
    const totalFollowers = list.reduce((s, n) => s + Number(n.followers_total || 0), 0);
    const totalOrganicGrowth = list.reduce((s, n) => s + Number(n.organic_growth_net || 0), 0);
    const totalOrganicReach = list.reduce((s, n) => s + Number(n.organic_reach || 0), 0);
    const totalPaid = list.reduce((s, n) => s + Number(n.paid_reach_clicks || 0), 0);
    const totalWebVisits = list.reduce((s, n) => s + Number(n.web_visits || 0), 0);
    const totalAdSpend = list.reduce((s, n) => s + Number(n.ad_spend || 0), 0);
    const totalRevenue = list.reduce((s, n) => s + Number(n.revenue || 0), 0);

    // Evaluar salud financiera de cada canal individualmente
    const evaluatedChannels = list.map((ch) => {
      const spend = Number(ch.ad_spend || 0);
      const results = Number(ch.results_count || 0);
      const rev = Number(ch.revenue || 0);
      const visits = Number(ch.web_visits || 0);

      const cpa = spend > 0 && results > 0 ? spend / results : 0;
      const roas = spend > 0 && rev > 0 ? rev / spend : 0;
      const convRate =
        visits > 0 &&
        results > 0 &&
        (ch.objective_type === 'Ventas / Compras' || ch.objective_type === 'Mensajes / Leads')
          ? (results / visits) * 100
          : 0;

      let verdict: 'ESCALAR' | 'OPTIMIZAR EMBUDO' | 'FUGA / CORTAR' | 'ORGÁNICO PURO' =
        'ORGÁNICO PURO';
      let reason = 'Genera tracción sin inversión publicitaria directa.';

      if (spend > 0) {
        if (results === 0 && rev === 0) {
          verdict = 'FUGA / CORTAR';
          reason = `Gasto de ${formatEur(spend)} sin conversiones ni resultados registrados.`;
        } else if (rev > 0 && roas < 1) {
          verdict = 'FUGA / CORTAR';
          reason = `Pérdida directa: ROAS de ${roas.toFixed(2)}x (retorna menos de lo invertido).`;
        } else if (
          (ch.objective_type === 'Mensajes / Leads' || ch.objective_type === 'Ventas / Compras') &&
          draft.target_max_cpa > 0 &&
          cpa > draft.target_max_cpa
        ) {
          verdict = 'FUGA / CORTAR';
          reason = `CPA de ${cpa.toFixed(2)} € supera el máximo rentable (${draft.target_max_cpa} €).`;
        } else if (
          ch.objective_type === 'Tráfico Web' &&
          visits >= 500 &&
          results === 0 &&
          rev === 0
        ) {
          verdict = 'OPTIMIZAR EMBUDO';
          reason = 'Trae tráfico web pero falta medir o cerrar conversión final.';
        } else if (
          (rev > 0 && roas >= draft.target_min_roas) ||
          (cpa > 0 && cpa <= draft.target_max_cpa)
        ) {
          verdict = 'ESCALAR';
          reason =
            rev > 0
              ? `Alta rentabilidad: ROAS ${roas.toFixed(2)}x (supera meta ${draft.target_min_roas}x).`
              : `Captación eficiente a ${cpa.toFixed(2)} €/${ch.result_unit_label.replace(/s$/, '')}.`;
        } else {
          verdict = 'OPTIMIZAR EMBUDO';
          reason = 'Rentabilidad media; margen de mejora en segmentación o landing.';
        }
      } else if (visits < 100 && ch.organic_growth_net <= 0) {
        verdict = 'OPTIMIZAR EMBUDO';
        reason = 'Baja tracción orgánica y escaso tráfico derivado a la web.';
      } else if (visits >= 500 || ch.organic_growth_net >= 200) {
        verdict = 'ESCALAR';
        reason = 'Motor orgánico sólido sin coste de adquisición.';
      }

      return {
        ...ch,
        cpa,
        roas,
        convRate,
        verdict,
        reason,
      };
    });

    // Agrupación estricta de resultados e inversión por Objetivo
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

    list.forEach((ch) => {
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
      cpr: grp.totalResults > 0 && grp.totalSpend > 0 ? grp.totalSpend / grp.totalResults : 0,
      roas: grp.totalSpend > 0 && grp.totalRevenue > 0 ? grp.totalRevenue / grp.totalSpend : 0,
    }));

    // Identificar: 1) Qué es lo más rentable, 2) Dónde se pierde dinero, 3) Cuello de botella del embudo
    const paidChannels = evaluatedChannels.filter((c) => c.ad_spend > 0);
    const leakingChannels = evaluatedChannels.filter((c) => c.verdict === 'FUGA / CORTAR');
    const wastedSpend = leakingChannels.reduce((s, c) => s + Number(c.ad_spend || 0), 0);

    const bestProfitable =
      [...paidChannels]
        .filter((c) => c.verdict === 'ESCALAR')
        .sort((a, b) => (b.roas || 1 / (b.cpa || 999)) - (a.roas || 1 / (a.cpa || 999)))[0] ||
      [...evaluatedChannels].sort((a, b) => b.web_visits - a.web_visits)[0];

    let profitableTitle = 'Sin datos suficientes';
    let profitableWhy = 'Introduce inversión y resultados para calcular el retorno.';
    if (bestProfitable) {
      profitableTitle = bestProfitable.name;
      if (bestProfitable.ad_spend > 0) {
        profitableWhy =
          bestProfitable.roas > 0
            ? `Genera ${formatEur(bestProfitable.revenue)} con ${formatEur(
                bestProfitable.ad_spend
              )} invertidos (ROAS ${bestProfitable.roas.toFixed(2)}x). Escalar presupuesto aquí.`
            : `Consigue ${formatCompact(bestProfitable.results_count)} ${
                bestProfitable.result_unit_label
              } a ${bestProfitable.cpa.toFixed(2)} € cada uno (por debajo del límite de ${
                draft.target_max_cpa
              } €).`;
      } else {
        profitableWhy = `Aporta ${formatCompact(bestProfitable.web_visits)} visitas y +${formatCompact(
          bestProfitable.organic_growth_net
        )} seguidores con 0 € de gasto publicitario.`;
      }
    }

    let leakTitle = 'Sin fugas críticas detectadas';
    let leakWhy =
      paidChannels.length > 0
        ? `Todos los canales activos operan dentro del CPA máximo rentable (${draft.target_max_cpa} €).`
        : 'No hay inversión publicitaria activa cargada en este periodo.';
    if (leakingChannels.length > 0) {
      const worst = [...leakingChannels].sort((a, b) => b.ad_spend - a.ad_spend)[0];
      leakTitle = `${worst.name} (${formatEur(wastedSpend)} en riesgo)`;
      leakWhy = worst.reason;
    }

    // Diagnóstico del embudo (Captación vs. Conversión)
    const highTrafficLowConv = evaluatedChannels.find(
      (c) => c.web_visits >= 1000 && c.results_count === 0 && c.revenue === 0
    );
    let funnelTitle = 'Embudo equilibrado';
    let funnelWhy = 'El volumen de tráfico y las acciones de contacto/venta mantienen proporción.';
    if (highTrafficLowConv) {
      funnelTitle = `Fuga en Cierre Web (${highTrafficLowConv.name})`;
      funnelWhy = `Llegan ${formatCompact(
        highTrafficLowConv.web_visits
      )} visitas pero no hay conversiones atribuidas: revisar página de destino o seguimiento UTM.`;
    } else if (totalWebVisits < 500 && totalOrganicReach > 50000) {
      funnelTitle = 'Fuga en Captación de Clics';
      funnelWhy = `Mucho alcance (${formatCompact(
        totalOrganicReach
      )} imp.) pero solo ${formatCompact(
        totalWebVisits
      )} visitas web: faltan llamadas a la acción y enlaces directos.`;
    }

    const maxCombinedImpact = Math.max(
      ...list.map((n) => Number(n.organic_reach || 0) + Number(n.paid_reach_clicks || 0)),
      1
    );
    const maxWebVisits = Math.max(...list.map((n) => Number(n.web_visits || 0)), 1);

    let startPct = 0;
    const donut = list.map((n) => {
      const pct =
        totalFollowers > 0
          ? (Number(n.followers_total || 0) / totalFollowers) * 100
          : 100 / Math.max(list.length, 1);
      const item = { ...n, pct, start: startPct };
      startPct += pct;
      return item;
    });

    // Diagnóstico Ejecutivo Automático centrado en Rentabilidad y Fugas
    let generatedHeadline = `${draft.client_name}: `;
    if (paidChannels.length > 0) {
      generatedHeadline += `Inversión total de ${formatEur(totalAdSpend)} con ${
        objectiveGroups.length > 0
          ? objectiveGroups
              .map(
                (g) =>
                  `${formatCompact(g.totalResults)} ${g.unit} (${
                    g.cpr > 0 ? `${g.cpr.toFixed(2)} €/ud` : 'sin coste'
                  })`
              )
              .join(' y ')
          : '0 resultados registrados'
      }. `;
      if (leakingChannels.length > 0) {
        generatedHeadline += `ALERTA DE FUGA: ${leakingChannels
          .map((c) => c.name)
          .join(', ')} concentra ${formatEur(
          wastedSpend
        )} con baja eficiencia (${leakingChannels[0].reason.toLowerCase()}). `;
      } else if (bestProfitable) {
        generatedHeadline += `LO MÁS RENTABLE: ${bestProfitable.name} lidera el retorno (${bestProfitable.reason.toLowerCase()}). `;
      }
    } else {
      generatedHeadline += `Comunidad de ${formatCompact(
        totalFollowers
      )} seguidores (+${formatCompact(
        totalOrganicGrowth
      )} netos) y ${formatCompact(
        totalWebVisits
      )} visitas web sin inversión en pauta. El principal motor de tráfico orgánico es ${
        bestProfitable ? bestProfitable.name : 'redes sociales'
      }.`;
    }

    return {
      channels: evaluatedChannels,
      totalFollowers,
      totalOrganicGrowth,
      totalOrganicReach,
      totalPaid,
      totalWebVisits,
      totalAdSpend,
      totalRevenue,
      objectiveGroups,
      profitableTitle,
      profitableWhy,
      leakTitle,
      leakWhy,
      hasLeak: leakingChannels.length > 0,
      funnelTitle,
      funnelWhy,
      maxCombinedImpact,
      maxWebVisits,
      donut,
      generatedHeadline,
    };
  }, [draft]);

  const activeHeadline = draft.auto_diagnosis
    ? summary.generatedHeadline
    : draft.custom_headline || summary.generatedHeadline;

  return (
    <div className="min-h-screen bg-[#e8ecf1] text-[#111827] p-3 sm:p-6">
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
        {/* BARRA DE CONTROLES (Oculta al imprimir) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-2.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase text-[#081b2b]">Mes:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => handleSelectMonth(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-extrabold text-[#081b2b]"
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
              <span>Guía Extracción</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setDraft((prev) => ({ ...prev, show_financials: !prev.show_financials }))
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
            >
              {draft.show_financials ? (
                <ToggleRight className="w-4 h-4 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-slate-400" />
              )}
              <span>Rentabilidad y Ads {draft.show_financials ? 'Activos' : 'Ocultos'}</span>
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f5b514] hover:bg-[#ffcd02] text-[#081b2b] text-xs font-black cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editMode ? 'Cerrar Editor' : 'Editar Cliente y Datos'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              title="Descargar archivo JSON de este cliente"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Guardar JSON</span>
            </button>

            <button
              type="button"
              onClick={() => jsonInputRef.current?.click()}
              title="Cargar plantilla JSON de un cliente"
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-extrabold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#f5b514]" />
              <span>Imprimir / PDF A4</span>
            </button>
          </div>
        </div>

        {/* GUÍA INTERACTIVA DE EXTRACCIÓN */}
        {showGuide && (
          <div className="no-print bg-white p-5 rounded-3xl border-2 border-[#015b9d] shadow-md space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-black text-[#081b2b]">
                Guía Rápida: Dónde sacar cada dato en las plataformas
              </h2>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="text-xs font-bold text-slate-500 hover:text-black cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {DATA_SOURCES_GUIDE.map((g) => (
                <div
                  key={g.network}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5"
                >
                  <div className="font-black text-xs uppercase" style={{ color: g.color }}>
                    {g.network}
                  </div>
                  <p className="text-[11px] text-slate-700">
                    <strong className="text-emerald-700">Orgánico:</strong> {g.organic}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    <strong className="text-[#015b9d]">Paid Media:</strong> {g.paid}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    <strong className="text-[#ed6723]">Web / Resultados:</strong> {g.web}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* EDITOR COMPLETO DE PLANTILLA MULTI-CLIENTE                        */}
        {/* ================================================================= */}
        {editMode && (
          <form
            onSubmit={handleSave}
            className="no-print bg-white p-5 rounded-3xl border-2 border-[#f5b514] shadow-lg space-y-5 text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-[#081b2b]">
                  Configuración de Cliente, Umbrales de Rentabilidad y Datos · {selectedMonth}
                </h2>
                <p className="text-[11px] text-slate-500">
                  Define el CPA Máximo Rentable y ROAS Objetivo del cliente para que el sistema detecte automáticamente fugas de dinero.
                </p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-black text-white font-black px-5 py-2.5 rounded-full cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#f5b514]" />
                <span>Aplicar y Guardar</span>
              </button>
            </div>

            {/* 1. IDENTIDAD DEL CLIENTE, UMBRALES FINANCIEROS Y LOGOTIPO */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-black uppercase text-[#015b9d]">
                1. Identidad Visual, Logo y Umbrales de Rentabilidad del Cliente
              </div>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nombre del Cliente</label>
                  <input
                    type="text"
                    value={draft.client_name}
                    onChange={(e) => setDraft({ ...draft, client_name: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Periodo</label>
                  <input
                    type="text"
                    value={draft.period_label}
                    onChange={(e) => setDraft({ ...draft, period_label: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                  />
                </div>
                <div>
                  <label
                    className="block font-bold text-rose-700 mb-1"
                    title="Coste máximo que puede costar un lead o venta antes de perder dinero"
                  >
                    CPA Máx. Rentable (€)
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
                    ROAS Objetivo (x)
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
                  <label className="block font-bold text-slate-700 mb-1">Logo Cliente</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 font-extrabold text-[#081b2b] cursor-pointer w-full justify-center"
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

              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-2 font-extrabold text-[#081b2b] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.auto_diagnosis}
                      onChange={(e) => setDraft({ ...draft, auto_diagnosis: e.target.checked })}
                    />
                    <Sparkles className="w-3.5 h-3.5 text-[#ed6723]" />
                    <span>
                      Diagnóstico Ejecutivo automático (detecta qué es rentable y dónde se pierde dinero)
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Subtítulo marca:</span>
                    <input
                      type="text"
                      value={draft.client_subtitle}
                      onChange={(e) => setDraft({ ...draft, client_subtitle: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-300 bg-white text-[11px] font-semibold w-48"
                    />
                  </div>
                </div>
                {!draft.auto_diagnosis && (
                  <textarea
                    rows={2}
                    value={draft.custom_headline}
                    onChange={(e) => setDraft({ ...draft, custom_headline: e.target.value })}
                    placeholder="Escribe el diagnóstico ejecutivo personalizado..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs"
                  />
                )}
              </div>
            </div>

            {/* 2. MATRIZ DINÁMICA DE CANALES, OBJETIVOS Y CONVERSIONES */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black uppercase text-[#081b2b]">
                  2. Canales, Objetivo de Campaña y Resultados Específicos
                </span>
                <button
                  type="button"
                  onClick={handleAddChannel}
                  className="inline-flex items-center gap-1 bg-sky-50 hover:bg-sky-100 text-[#015b9d] border border-sky-200 font-black px-3.5 py-1.5 rounded-full cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Canal / Objetivo</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black text-white text-[10px] font-extrabold uppercase">
                      <th className="p-2">Color</th>
                      <th className="p-2">Canal / Campaña</th>
                      <th className="p-2">Objetivo (Meta)</th>
                      <th className="p-2 text-right">Comunidad</th>
                      <th className="p-2 text-right">Crec. Org.</th>
                      <th className="p-2 text-right">Alcance Org.</th>
                      <th className="p-2 text-right">Alcance Paid</th>
                      <th className="p-2 text-right">Visitas Web</th>
                      {draft.show_financials && (
                        <>
                          <th className="p-2 text-right">Inversión (€)</th>
                          <th className="p-2 text-right">Resultados</th>
                          <th className="p-2">Unidad</th>
                          <th className="p-2 text-right">Ingresos (€)</th>
                        </>
                      )}
                      <th className="p-2 text-center">Quitar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {draft.channels.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50">
                        <td className="p-1.5 text-center">
                          <input
                            type="color"
                            value={row.color}
                            onChange={(e) => updateChannelField(row.id, 'color', e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                          />
                        </td>
                        <td className="p-1.5">
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => updateChannelField(row.id, 'name', e.target.value)}
                            className="w-28 px-2 py-1 rounded border border-slate-300 font-black"
                          />
                        </td>
                        <td className="p-1.5">
                          <select
                            value={row.objective_type}
                            onChange={(e) =>
                              updateChannelField(
                                row.id,
                                'objective_type',
                                e.target.value as ObjectiveCategory
                              )
                            }
                            className="w-36 px-2 py-1 rounded border border-slate-300 bg-white text-[11px] font-extrabold text-[#081b2b]"
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
                            value={row.followers_total}
                            onChange={(e) =>
                              updateChannelField(row.id, 'followers_total', Number(e.target.value))
                            }
                            className="w-20 px-1.5 py-1 rounded border border-slate-300 text-right font-bold"
                          />
                        </td>
                        <td className="p-1.5 text-right">
                          <input
                            type="number"
                            value={row.organic_growth_net}
                            onChange={(e) =>
                              updateChannelField(
                                row.id,
                                'organic_growth_net',
                                Number(e.target.value)
                              )
                            }
                            className="w-16 px-1.5 py-1 rounded border border-slate-300 text-right font-bold"
                          />
                        </td>
                        <td className="p-1.5 text-right">
                          <input
                            type="number"
                            value={row.organic_reach}
                            onChange={(e) =>
                              updateChannelField(row.id, 'organic_reach', Number(e.target.value))
                            }
                            className="w-20 px-1.5 py-1 rounded border border-slate-300 text-right font-bold"
                          />
                        </td>
                        <td className="p-1.5 text-right">
                          <input
                            type="number"
                            value={row.paid_reach_clicks}
                            onChange={(e) =>
                              updateChannelField(
                                row.id,
                                'paid_reach_clicks',
                                Number(e.target.value)
                              )
                            }
                            className="w-20 px-1.5 py-1 rounded border border-slate-300 text-right font-bold"
                          />
                        </td>
                        <td className="p-1.5 text-right">
                          <input
                            type="number"
                            value={row.web_visits}
                            onChange={(e) =>
                              updateChannelField(row.id, 'web_visits', Number(e.target.value))
                            }
                            className="w-20 px-1.5 py-1 rounded border border-slate-300 text-right font-bold"
                          />
                        </td>
                        {draft.show_financials && (
                          <>
                            <td className="p-1.5 text-right">
                              <input
                                type="number"
                                step="any"
                                value={row.ad_spend}
                                onChange={(e) =>
                                  updateChannelField(row.id, 'ad_spend', Number(e.target.value))
                                }
                                className="w-20 px-1.5 py-1 rounded border border-emerald-300 bg-emerald-50/50 text-right font-bold"
                              />
                            </td>
                            <td className="p-1.5 text-right">
                              <input
                                type="number"
                                value={row.results_count}
                                onChange={(e) =>
                                  updateChannelField(
                                    row.id,
                                    'results_count',
                                    Number(e.target.value)
                                  )
                                }
                                className="w-20 px-1.5 py-1 rounded border border-emerald-300 bg-emerald-50/50 text-right font-bold"
                              />
                            </td>
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={row.result_unit_label}
                                onChange={(e) =>
                                  updateChannelField(row.id, 'result_unit_label', e.target.value)
                                }
                                className="w-20 px-1.5 py-1 rounded border border-slate-300 text-[11px] font-semibold"
                              />
                            </td>
                            <td className="p-1.5 text-right">
                              <input
                                type="number"
                                step="any"
                                value={row.revenue}
                                onChange={(e) =>
                                  updateChannelField(row.id, 'revenue', Number(e.target.value))
                                }
                                className="w-20 px-1.5 py-1 rounded border border-emerald-300 bg-emerald-50/50 text-right font-bold"
                              />
                            </td>
                          </>
                        )}
                        <td className="p-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveChannel(row.id)}
                            disabled={draft.channels.length <= 1}
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

            {/* 3. MERCADOS EMISORES / SEGMENTOS EDITABLES */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black uppercase text-[#015b9d]">
                  3. Mercados Emisores / Distribución Geográfica (Editable por Cliente)
                </span>
                <button
                  type="button"
                  onClick={handleAddMarket}
                  className="inline-flex items-center gap-1 text-[11px] font-black text-[#015b9d] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir Comparativa de Mercado
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

            {/* 4. DIRECTIVAS ESTRATÉGICAS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#081b2b] uppercase">
                  4. Directivas Estratégicas, Objetivos y Resultados Esperados
                </span>
                <button
                  type="button"
                  onClick={handleAddDirective}
                  className="inline-flex items-center gap-1 text-[11px] font-black text-[#015b9d] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir Directiva
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
                        className="text-[10px] font-black px-2 py-1 rounded bg-black text-[#f5b514]"
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
        {/* DOCUMENTO EJECUTIVO VISUAL (A4 ONE-PAGER PARA DIRECCIÓN GENERAL)      */}
        {/* ===================================================================== */}
        <div
          id="ceo-visual-report"
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* CABECERA CON LOGO DINÁMICO DEL CLIENTE */}
          <div className="bg-gradient-to-b from-amber-50/50 to-white pt-5 pb-3 px-6 flex flex-col items-center text-center">
            {draft.logo_data_url && !logoError ? (
              <img
                src={draft.logo_data_url}
                alt={draft.client_name}
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
                className="h-16 sm:h-20 object-contain mb-1"
              />
            ) : (
              <div className="mb-1">
                <div className="text-[11px] font-black tracking-[0.25em] text-[#ed6723] uppercase">
                  {draft.client_subtitle}
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#081b2b]">
                  {draft.client_name}
                </div>
              </div>
            )}
          </div>

          {/* Banda Negra Ejecutiva */}
          <div className="bg-black text-white px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-sm sm:text-base font-black tracking-wide uppercase">
              INFORME DE RENTABILIDAD Y MARKETING · {draft.client_name}
            </h1>
            <span className="inline-block px-3 py-1 rounded-full bg-[#f5b514] text-black text-xs font-black">
              {draft.period_label}
            </span>
          </div>

          <div className="p-5 sm:p-7 space-y-5">
            {/* DIAGNÓSTICO EJECUTIVO AUTOGENERADO */}
            <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 text-xs sm:text-sm leading-relaxed border-l-4 border-[#f5b514]">
              <strong className="text-[#f5b514] uppercase text-xs tracking-wider mr-1.5">
                Veredicto Ejecutivo:
              </strong>
              {activeHeadline}
            </div>

            {/* NUEVO PANEL DE CONTROL PARA EL CEO: QUÉ ES RENTABLE, DÓNDE SE PIERDE DINERO Y POR QUÉ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-black uppercase text-emerald-800">
                    Qué funciona / Más Rentable
                  </div>
                  <div className="text-xs font-black text-emerald-950 mt-0.5">
                    {summary.profitableTitle}
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-snug mt-0.5">
                    {summary.profitableWhy}
                  </p>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
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
                    className={`text-[11px] leading-snug mt-0.5 ${
                      summary.hasLeak ? 'text-rose-900' : 'text-slate-600'
                    }`}
                  >
                    {summary.leakWhy}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5">
                <Filter className="w-5 h-5 text-[#ed6723] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-black uppercase text-amber-900">
                    Diagnóstico del Embudo (Captación vs. Cierre)
                  </div>
                  <div className="text-xs font-black text-amber-950 mt-0.5">
                    {summary.funnelTitle}
                  </div>
                  <p className="text-[11px] text-amber-900 leading-snug mt-0.5">
                    {summary.funnelWhy}
                  </p>
                </div>
              </div>
            </div>

            {/* 4 TARJETAS KPI GLOBALES */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-[#fafaf9] border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-500">
                    Comunidad Global
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-black mt-0.5">
                    {formatCompact(summary.totalFollowers)}
                  </div>
                  <div className="text-[11px] font-extrabold text-emerald-700 mt-0.5">
                    {summary.totalOrganicGrowth >= 0
                      ? `+${formatCompact(summary.totalOrganicGrowth)}`
                      : formatCompact(summary.totalOrganicGrowth)}{' '}
                    orgánicos/mes
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fafaf9] border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-500">
                    Alcance Orgánico
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-black mt-0.5">
                    {formatCompact(summary.totalOrganicReach)}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Impactos sin coste publicitario
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-pink-100 text-[#e1306c] flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fafaf9] border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-500">
                    Impulso Paid Media
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-black mt-0.5">
                    {formatCompact(summary.totalPaid)}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Alcance / impactos patrocinados
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-[#015b9d] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fafaf9] border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-500">
                    Visitas a la Web
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-black mt-0.5">
                    {formatCompact(summary.totalWebVisits)}
                  </div>
                  <div className="text-[11px] font-extrabold text-[#015b9d] mt-0.5">
                    {draft.web_kpi_subtitle}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#ed6723] flex items-center justify-center shrink-0">
                  <MousePointerClick className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* 1. MATRIZ DE RENTABILIDAD Y SEMÁFORO DE DECISIÓN POR CANAL */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-black">
                  1. Matriz de Rentabilidad y Decisión por Canal (CPA Máx: {draft.target_max_cpa}{' '}
                  € · ROAS Meta: {draft.target_min_roas}x)
                </h2>
                <div className="flex items-center gap-3 text-[10px] font-bold">
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" /> Rentable / Escalar
                  </span>
                  <span className="inline-flex items-center gap-1 text-amber-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Optimizar Embudo
                  </span>
                  <span className="inline-flex items-center gap-1 text-rose-600">
                    <span className="w-2 h-2 rounded-full bg-rose-600" /> Fuga / Pérdida
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-300">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-200/90 text-[#111827] text-[11px] font-black border-b border-slate-300">
                      <th className="py-2.5 px-3 bg-slate-300/80">Canal / Campaña</th>
                      <th className="py-2.5 px-2.5">Objetivo</th>
                      <th className="py-2.5 px-2.5 text-center">Comunidad</th>
                      <th className="py-2.5 px-2.5 text-center">Crec. Org.</th>
                      <th className="py-2.5 px-2.5 text-center">Visitas Web</th>
                      {draft.show_financials && (
                        <>
                          <th className="py-2.5 px-2.5 text-center">Inversión</th>
                          <th className="py-2.5 px-2.5 text-center">Resultados / CPA</th>
                        </>
                      )}
                      <th className="py-2.5 px-3 text-center">Veredicto CEO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {summary.channels.map((net) => {
                      const orgPositive = net.organic_growth_net >= 50;
                      const badgeStyle =
                        net.verdict === 'ESCALAR'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : net.verdict === 'FUGA / CORTAR'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : net.verdict === 'OPTIMIZAR EMBUDO'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300';
                      return (
                        <tr key={net.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-black bg-slate-100/80 text-[#081b2b]">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: net.color }}
                              />
                              <span>{net.name}</span>
                            </div>
                          </td>

                          <td className="py-2.5 px-2.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                              <Target className="w-2.5 h-2.5 text-[#015b9d]" />
                              {net.objective_type}
                            </span>
                          </td>

                          <td className="py-2.5 px-2.5 text-center font-black text-slate-900">
                            {net.followers_total > 0 ? formatCompact(net.followers_total) : '—'}
                          </td>

                          <td className="py-2.5 px-2.5 text-center">
                            <span
                              className={`inline-flex items-center gap-1 font-black ${
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

                          <td className="py-2.5 px-2.5 text-center font-black text-slate-900">
                            {formatCompact(net.web_visits)}
                            {net.convRate > 0 && (
                              <div className="text-[10px] font-bold text-[#015b9d]">
                                Conv: {net.convRate.toFixed(1)}%
                              </div>
                            )}
                          </td>

                          {draft.show_financials && (
                            <>
                              <td className="py-2.5 px-2.5 text-center font-bold text-slate-800">
                                {formatEur(net.ad_spend)}
                              </td>
                              <td className="py-2.5 px-2.5 text-center">
                                <div className="font-black text-slate-900">
                                  {formatCompact(net.results_count)}{' '}
                                  <span className="text-[10px] font-bold text-slate-600">
                                    {net.result_unit_label}
                                  </span>
                                  {net.revenue > 0 ? ` · ${formatEur(net.revenue)}` : ''}
                                </div>
                                {net.cpa > 0 && (
                                  <div
                                    className={`text-[10px] font-extrabold ${
                                      net.cpa > draft.target_max_cpa
                                        ? 'text-rose-600'
                                        : 'text-emerald-700'
                                    }`}
                                  >
                                    CPA: {net.cpa.toFixed(2)} €
                                    {net.roas > 0 ? ` · ROAS ${net.roas.toFixed(2)}x` : ''}
                                  </div>
                                )}
                              </td>
                            </>
                          )}

                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black border ${badgeStyle}`}
                            >
                              {net.verdict}
                            </span>
                            <div className="text-[9px] text-slate-500 mt-0.5 max-w-[170px] mx-auto leading-tight">
                              {net.reason}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-black text-white font-black">
                      <td className="py-2.5 px-3 uppercase">TOTAL</td>
                      <td className="py-2.5 px-2.5 text-[10px] text-slate-300">Por objetivo</td>
                      <td className="py-2.5 px-2.5 text-center text-[#f5b514]">
                        {formatCompact(summary.totalFollowers)}
                      </td>
                      <td className="py-2.5 px-2.5 text-center text-emerald-400">
                        {summary.totalOrganicGrowth >= 0
                          ? `+${formatCompact(summary.totalOrganicGrowth)}`
                          : formatCompact(summary.totalOrganicGrowth)}
                      </td>
                      <td className="py-2.5 px-2.5 text-center text-[#f5b514]">
                        {formatCompact(summary.totalWebVisits)}
                      </td>
                      {draft.show_financials && (
                        <>
                          <td className="py-2.5 px-2.5 text-center">
                            {formatEur(summary.totalAdSpend)}
                          </td>
                          <td className="py-2.5 px-2.5 text-center text-emerald-400 text-[11px]">
                            {summary.objectiveGroups.length > 0
                              ? summary.objectiveGroups
                                  .map((g) => `${formatCompact(g.totalResults)} ${g.unit}`)
                                  .join(' + ')
                              : '—'}
                          </td>
                        </>
                      )}
                      <td className="py-2.5 px-3 text-center text-[10px] text-[#f5b514]">
                        {summary.hasLeak ? 'Corregir fugas' : 'Salud óptima'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* DESGLOSE EJECUTIVO POR OBJETIVO DE CAMPAÑA */}
            {draft.show_financials && summary.objectiveGroups.length > 0 && (
              <div className="rounded-2xl bg-slate-900 text-white p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-[#f5b514]">
                    <DollarSign className="w-4 h-4" />
                    <span>Resultados e Inversión Agrupados por Objetivo de Campaña</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-300">
                    Inversión Total:{' '}
                    <strong className="text-white">{formatEur(summary.totalAdSpend)}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {summary.objectiveGroups.map((grp) => (
                    <div
                      key={grp.objective}
                      className="p-3 rounded-xl bg-white/10 border border-white/15 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-black uppercase text-[#f5b514]">
                          Objetivo: {grp.objective}
                        </div>
                        <div className="text-lg font-black text-white mt-0.5">
                          {formatCompact(grp.totalResults)}{' '}
                          <span className="text-xs font-bold text-slate-300">{grp.unit}</span>
                        </div>
                        <div className="text-[10px] text-slate-300">
                          Inversión: {formatEur(grp.totalSpend)}
                          {grp.totalRevenue > 0 ? ` · Ventas: ${formatEur(grp.totalRevenue)}` : ''}
                        </div>
                      </div>
                      {grp.cpr > 0 && (
                        <div className="text-right">
                          <div className="text-[9px] uppercase text-slate-400">Coste / Unidad</div>
                          <div className="text-sm font-black text-emerald-400">
                            {grp.cpr.toFixed(2)} €
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BLOQUE VISUAL: GRÁFICOS COMPARATIVOS Y MERCADOS EDITABLES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 p-4 rounded-2xl border border-slate-200 bg-[#fafaf9] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-black">
                    2. Peso Visual: Alcance Orgánico vs. Paid Media y Visitas Web
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Orgánico
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#015b9d]" /> Paid Media
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {summary.channels.map((net) => {
                    const orgPct = Math.round(
                      (Number(net.organic_reach || 0) / summary.maxCombinedImpact) * 100
                    );
                    const paidPct = Math.round(
                      (Number(net.paid_reach_clicks || 0) / summary.maxCombinedImpact) * 100
                    );
                    const visitPct = Math.max(
                      4,
                      Math.round((Number(net.web_visits || 0) / summary.maxWebVisits) * 100)
                    );
                    return (
                      <div
                        key={net.id}
                        className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1.5"
                      >
                        <div className="flex justify-between text-[11px]">
                          <span className="font-black text-[#081b2b] flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: net.color }}
                            />
                            {net.name}
                          </span>
                          <span className="text-slate-500">
                            Impacto:{' '}
                            <strong>
                              {formatCompact(
                                Number(net.organic_reach || 0) + Number(net.paid_reach_clicks || 0)
                              )}
                            </strong>{' '}
                            · Web:{' '}
                            <strong className="text-[#ed6723]">
                              {formatCompact(net.web_visits)} visitas
                            </strong>
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                          <div
                            className="bg-emerald-500 h-full"
                            style={{
                              width: `${Math.max(orgPct, net.organic_reach > 0 ? 3 : 0)}%`,
                            }}
                          />
                          <div
                            className="bg-[#015b9d] h-full"
                            style={{
                              width: `${Math.max(paidPct, net.paid_reach_clicks > 0 ? 3 : 0)}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase w-16 shrink-0">
                            Tráfico Web
                          </span>
                          <div className="w-full h-1.5 bg-amber-100/70 rounded-full overflow-hidden">
                            <div
                              className="bg-[#f5b514] h-full rounded-full"
                              style={{ width: `${visitPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 p-4 rounded-2xl border border-slate-200 bg-[#fafaf9] flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Globe className="w-4 h-4 text-[#015b9d]" />
                    <h3 className="text-xs font-black uppercase text-black">
                      3. Cuota de Comunidad y Mercados Clave
                    </h3>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center gap-4">
                    <div className="relative w-24 h-24 shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        {summary.donut.map((seg) => (
                          <circle
                            key={seg.id}
                            cx="18"
                            cy="18"
                            r="15.915"
                            fill="transparent"
                            stroke={seg.color}
                            strokeWidth="4.2"
                            strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                            strokeDashoffset={-seg.start}
                          />
                        ))}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[11px] font-black text-black">
                          {formatCompact(summary.totalFollowers)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] w-full max-h-28 overflow-y-auto pr-1">
                      {summary.donut.map((seg) => (
                        <div key={seg.id} className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-slate-700 truncate">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: seg.color }}
                            />
                            <span className="truncate">{seg.name}</span>
                          </span>
                          <span className="font-black text-black ml-1">{seg.pct.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {draft.markets.length > 0 && (
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-2 text-[11px]">
                    <div className="font-black text-black">
                      Mercados Emisores / Distribución de Audiencia
                    </div>
                    {draft.markets.map((mkt) => (
                      <div key={mkt.id}>
                        <div className="flex justify-between mb-0.5">
                          <span className="truncate pr-1">{mkt.group_label}:</span>
                          <strong className="text-[#081b2b] shrink-0">
                            {mkt.market_a_name} {mkt.market_a_pct}% · {mkt.market_b_name}{' '}
                            {mkt.market_b_pct}%
                          </strong>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
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
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 flex items-start gap-2">
                  <Trophy className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>{draft.competitive_note_title}:</strong> {draft.competitive_note_text}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. DIRECTIVAS ESTRATÉGICAS */}
            <div className="rounded-2xl bg-amber-50 border-2 border-[#f5b514] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#ed6723]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-black">
                    4. Directivas Estratégicas Recomendadas para el Próximo Mes
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
                        : 'bg-black text-[#f5b514]';
                  return (
                    <div
                      key={dir.id}
                      className="bg-white p-3 rounded-xl border border-amber-200 flex flex-col justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1.5 mb-1">
                          <span className="font-black text-xs text-black">{dir.area}</span>
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