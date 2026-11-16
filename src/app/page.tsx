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
} from 'lucide-react';

interface NetworkRowData {
  followers_total: number;
  organic_growth_net: number;
  organic_reach: number;
  paid_reach_clicks: number;
  ad_spend: number;
  web_visits: number;
  conversions: number;
  revenue: number;
}

interface CeoDirective {
  area: string;
  status: 'ESCALAR' | 'CORREGIR' | 'MANTENER';
  decision: string;
  expected_impact: string;
}

interface CeoVisualReport {
  report_month: string;
  period_label: string;
  executive_headline: string;
  show_financials: boolean;
  tiktok: NetworkRowData;
  instagram: NetworkRowData;
  facebook: NetworkRowData;
  linkedin: NetworkRowData;
  youtube: NetworkRowData;
  uk_share_fb: number;
  spain_share_fb: number;
  spain_share_ig: number;
  uk_share_ig: number;
  directives: CeoDirective[];
}

const SIAM_LOGO_URL =
  'https://siampark.net/templates/yootheme/cache/d1/siam-park-tenerife-main-logo-d1ab9a93.webp';

const STORAGE_KEY = 'siampark_ceo_visual_matrix_v4';

const OCTOBER_2026_DATA: CeoVisualReport = {
  report_month: '2026-10',
  period_label: 'Octubre 2026 (01 – 31 Oct)',
  executive_headline:
    'Comunidad total de 604.220 seguidores liderada por Facebook (352K) e Instagram (218K), con TikTok como motor de crecimiento (+1.250 netos). Las visitas VIP (Amaia Romero y Charly Flow) multiplicaron x8 el alcance orgánico sin coste adicional.',
  show_financials: false,
  tiktok: {
    followers_total: 20350,
    organic_growth_net: 1250,
    organic_reach: 163620,
    paid_reach_clicks: 18400,
    ad_spend: 0,
    web_visits: 640,
    conversions: 0,
    revenue: 0,
  },
  instagram: {
    followers_total: 218770,
    organic_growth_net: 441,
    organic_reach: 1690000,
    paid_reach_clicks: 24500,
    ad_spend: 0,
    web_visits: 1120,
    conversions: 0,
    revenue: 0,
  },
  facebook: {
    followers_total: 352290,
    organic_growth_net: 424,
    organic_reach: 736800,
    paid_reach_clicks: 15200,
    ad_spend: 0,
    web_visits: 2453,
    conversions: 0,
    revenue: 0,
  },
  linkedin: {
    followers_total: 3200,
    organic_growth_net: 85,
    organic_reach: 14200,
    paid_reach_clicks: 0,
    ad_spend: 0,
    web_visits: 190,
    conversions: 0,
    revenue: 0,
  },
  youtube: {
    followers_total: 9610,
    organic_growth_net: 48,
    organic_reach: 46850,
    paid_reach_clicks: 81500,
    ad_spend: 0,
    web_visits: 520,
    conversions: 0,
    revenue: 0,
  },
  uk_share_fb: 30.8,
  spain_share_fb: 27.52,
  spain_share_ig: 44.58,
  uk_share_ig: 19.48,
  directives: [
    {
      area: '1. Alianzas Talento VIP',
      status: 'ESCALAR',
      decision:
        'Programar 2 colaboraciones mensuales con creadores de España y Reino Unido tras el pico de 286K impactos con Amaia Romero.',
      expected_impact: '+250K impactos orgánicos/mes sin pauta.',
    },
    {
      area: '2. Mercado Británico Invierno',
      status: 'ESCALAR',
      decision:
        'Reforzar campañas de Facebook y YouTube segmentadas a Reino Unido (30,8% de audiencia FB) para temporada de invierno.',
      expected_impact: 'Aumento de reservas internacionales.',
    },
    {
      area: '3. Enlaces Directos a Taquilla',
      status: 'CORREGIR',
      decision:
        'Activar enlaces directos con seguimiento en Instagram, TikTok y LinkedIn para igualar la tracción de Facebook (2.453 visitas).',
      expected_impact: '+60% tráfico web desde redes sociales.',
    },
  ],
};

const createEmptyMonth = (month: string): CeoVisualReport => ({
  ...OCTOBER_2026_DATA,
  report_month: month,
  period_label: `Cierre Mensual · ${month}`,
  executive_headline:
    'Introduce los datos mensuales de cada red social para generar automáticamente el diagnóstico ejecutivo.',
  tiktok: {
    followers_total: 0,
    organic_growth_net: 0,
    organic_reach: 0,
    paid_reach_clicks: 0,
    ad_spend: 0,
    web_visits: 0,
    conversions: 0,
    revenue: 0,
  },
  instagram: {
    followers_total: 0,
    organic_growth_net: 0,
    organic_reach: 0,
    paid_reach_clicks: 0,
    ad_spend: 0,
    web_visits: 0,
    conversions: 0,
    revenue: 0,
  },
  facebook: {
    followers_total: 0,
    organic_growth_net: 0,
    organic_reach: 0,
    paid_reach_clicks: 0,
    ad_spend: 0,
    web_visits: 0,
    conversions: 0,
    revenue: 0,
  },
  linkedin: {
    followers_total: 0,
    organic_growth_net: 0,
    organic_reach: 0,
    paid_reach_clicks: 0,
    ad_spend: 0,
    web_visits: 0,
    conversions: 0,
    revenue: 0,
  },
  youtube: {
    followers_total: 0,
    organic_growth_net: 0,
    organic_reach: 0,
    paid_reach_clicks: 0,
    ad_spend: 0,
    web_visits: 0,
    conversions: 0,
    revenue: 0,
  },
});

const DATA_SOURCES_GUIDE = [
  {
    network: 'TikTok',
    color: '#0f172a',
    organic: 'TikTok Studio → Estadísticas → Seguidores (Crecimiento neto + Visualizaciones)',
    paid: 'TikTok Ads Manager → Campañas (Impresiones/Clics y Coste total)',
    web: 'TikTok Studio → Perfil (Clics en el enlace) + GA4 (utm_source=tiktok)',
  },
  {
    network: 'Instagram',
    color: '#e1306c',
    organic: 'Meta Business Suite → Insights → Audiencia (Nuevos seguidores + Alcance)',
    paid: 'Meta Ads Manager → Desglose por plataforma: Instagram (Alcance/Gasto)',
    web: 'Meta Business Suite → Clics en el enlace + GA4 (utm_source=instagram)',
  },
  {
    network: 'Facebook',
    color: '#1877f2',
    organic: 'Meta Business Suite → Insights → Página (Seguidores netos + Visualizaciones)',
    paid: 'Meta Ads Manager → Desglose por plataforma: Facebook (Alcance/Gasto)',
    web: 'Meta Business Suite → Clics en enlaces externos + GA4 (utm_source=facebook)',
  },
  {
    network: 'LinkedIn',
    color: '#0a66c2',
    organic: 'Página Empresa LinkedIn → Análisis → Seguidores y Actualizaciones',
    paid: 'LinkedIn Campaign Manager → Rendimiento (Impresiones y Gasto total)',
    web: 'LinkedIn Análisis → Clics en botón personalizado + GA4 (utm_source=linkedin)',
  },
  {
    network: 'YouTube',
    color: '#dc2626',
    organic: 'YouTube Studio → Estadísticas → Audiencia (Suscriptores ganados + Views)',
    paid: 'Google Ads → Campañas de Vídeo / Demand Gen (Views/Clics y Coste)',
    web: 'YouTube Studio → Clics en tarjetas/descripción + Google Ads',
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
    maximumFractionDigits: 0,
  }).format(val);
}

export default function CeoVisualReportPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-10');
  const [reportsMap, setReportsMap] = useState<Record<string, CeoVisualReport>>({
    '2026-10': OCTOBER_2026_DATA,
  });
  const [draft, setDraft] = useState<CeoVisualReport>(OCTOBER_2026_DATA);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, CeoVisualReport>;
        const merged = { '2026-10': OCTOBER_2026_DATA, ...parsed };
        setReportsMap(merged);
        if (merged['2026-10']) setDraft(merged['2026-10']);
      }
    } catch {
      // Ignorar
    }
  }, []);

  const handleSelectMonth = (m: string) => {
    setSelectedMonth(m);
    setDraft(
      reportsMap[m]
        ? reportsMap[m]
        : m === '2026-10'
          ? OCTOBER_2026_DATA
          : createEmptyMonth(m)
    );
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
    setToast('Informe mensual actualizado');
    setTimeout(() => setToast(null), 3000);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(reportsMap, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SiamPark-Informe-CEO-${selectedMonth}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result)) as Record<string, CeoVisualReport>;
        const merged = { ...reportsMap, ...imported };
        setReportsMap(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        if (merged[selectedMonth]) setDraft(merged[selectedMonth]);
        setToast('Histórico cargado');
        setTimeout(() => setToast(null), 3000);
      } catch {
        alert('Archivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  const summary = useMemo(() => {
    const networks = [
      { id: 'tiktok', name: 'TikTok', color: '#0f172a', data: draft.tiktok },
      { id: 'instagram', name: 'Instagram', color: '#e1306c', data: draft.instagram },
      { id: 'facebook', name: 'Facebook', color: '#1877f2', data: draft.facebook },
      { id: 'linkedin', name: 'LinkedIn', color: '#0a66c2', data: draft.linkedin },
      { id: 'youtube', name: 'YouTube', color: '#dc2626', data: draft.youtube },
    ] as const;

    const totalFollowers = networks.reduce((s, n) => s + Number(n.data.followers_total || 0), 0);
    const totalOrganicGrowth = networks.reduce(
      (s, n) => s + Number(n.data.organic_growth_net || 0),
      0
    );
    const totalOrganicReach = networks.reduce(
      (s, n) => s + Number(n.data.organic_reach || 0),
      0
    );
    const totalPaid = networks.reduce((s, n) => s + Number(n.data.paid_reach_clicks || 0), 0);
    const totalAdSpend = networks.reduce((s, n) => s + Number(n.data.ad_spend || 0), 0);
    const totalWebVisits = networks.reduce((s, n) => s + Number(n.data.web_visits || 0), 0);
    const totalConversions = networks.reduce((s, n) => s + Number(n.data.conversions || 0), 0);
    const totalRevenue = networks.reduce((s, n) => s + Number(n.data.revenue || 0), 0);

    const maxCombinedImpact = Math.max(
      ...networks.map((n) => n.data.organic_reach + n.data.paid_reach_clicks),
      1
    );
    const maxWebVisits = Math.max(...networks.map((n) => n.data.web_visits), 1);

    let startPct = 0;
    const donut = networks.map((n) => {
      const pct = totalFollowers > 0 ? (n.data.followers_total / totalFollowers) * 100 : 20;
      const item = { ...n, pct, start: startPct };
      startPct += pct;
      return item;
    });

    const roas = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0;

    return {
      networks,
      totalFollowers,
      totalOrganicGrowth,
      totalOrganicReach,
      totalPaid,
      totalAdSpend,
      totalWebVisits,
      totalConversions,
      totalRevenue,
      maxCombinedImpact,
      maxWebVisits,
      donut,
      roas,
    };
  }, [draft]);

  const updateRow = (
    net: 'tiktok' | 'instagram' | 'facebook' | 'linkedin' | 'youtube',
    field: keyof NetworkRowData,
    val: number
  ) => {
    setDraft((prev) => ({
      ...prev,
      [net]: { ...prev[net], [field]: val },
    }));
  };

  const updateDirective = (idx: number, field: keyof CeoDirective, val: string) => {
    setDraft((prev) => {
      const list = [...prev.directives];
      list[idx] = { ...list[idx], [field]: val } as CeoDirective;
      return { ...prev, directives: list };
    });
  };

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
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-black uppercase text-[#081b2b]">Mes:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => handleSelectMonth(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-extrabold text-[#081b2b]"
            />

            <button
              type="button"
              onClick={() => setShowGuide((p) => !p)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#015b9d] border border-sky-200 text-xs font-extrabold cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>¿De dónde saco cada dato?</span>
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
              <span>Inversión / Ventas {draft.show_financials ? 'Activas' : 'Ocultas'}</span>
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
              <span>{editMode ? 'Cerrar Editor' : 'Cargar Datos del Mes'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Guardar</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Abrir</span>
            </button>
            <input
              ref={fileInputRef}
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

        {/* GUÍA INTERACTIVA DE EXTRACCIÓN DE DATOS POR PLATAFORMA */}
        {showGuide && (
          <div className="no-print bg-white p-5 rounded-3xl border-2 border-[#015b9d] shadow-md space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-black text-[#081b2b]">
                Mapa de Extracción Mensual: Dónde mirar cada cifra en cada plataforma
              </h2>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="text-xs font-bold text-slate-500 hover:text-black cursor-pointer"
              >
                Cerrar guía ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {DATA_SOURCES_GUIDE.map((g) => (
                <div
                  key={g.network}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="font-black text-xs uppercase" style={{ color: g.color }}>
                    {g.network}
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold text-emerald-700 uppercase">
                      Crecimiento Orgánico:
                    </div>
                    <p className="text-[11px] text-slate-700 leading-snug">{g.organic}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold text-[#015b9d] uppercase">
                      Paid Media / Ads:
                    </div>
                    <p className="text-[11px] text-slate-700 leading-snug">{g.paid}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold text-[#ed6723] uppercase">
                      Visitas a la Web:
                    </div>
                    <p className="text-[11px] text-slate-700 leading-snug">{g.web}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FORMULARIO DE CARGA MENSUAL */}
        {editMode && (
          <form
            onSubmit={handleSave}
            className="no-print bg-white p-5 rounded-3xl border-2 border-[#f5b514] shadow-lg space-y-4 text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-[#081b2b]">
                  Carga de Matriz Mensual · {selectedMonth}
                </h2>
                <p className="text-[11px] text-slate-500">
                  Introduce los cierres de cada red social. Si aún no tienes datos de inversión o ventas, déjalos en 0.
                </p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-black text-white font-black px-5 py-2.5 rounded-full cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#f5b514]" />
                <span>Guardar Informe</span>
              </button>
            </div>

            <div>
              <label className="block font-extrabold text-[#081b2b] mb-1">
                Conclusión Ejecutiva Principal (2 líneas para el CEO)
              </label>
              <textarea
                rows={2}
                value={draft.executive_headline}
                onChange={(e) => setDraft({ ...draft, executive_headline: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black text-white text-[10px] font-extrabold uppercase">
                    <th className="p-2.5">Red Social</th>
                    <th className="p-2.5 text-right">Comunidad Total</th>
                    <th className="p-2.5 text-right">Crec. Orgánico (+/-)</th>
                    <th className="p-2.5 text-right">Alcance Orgánico</th>
                    <th className="p-2.5 text-right">Paid Media (Imp/Clics)</th>
                    <th className="p-2.5 text-right">Visitas a Web</th>
                    {draft.show_financials && (
                      <>
                        <th className="p-2.5 text-right">Inversión Ads (€)</th>
                        <th className="p-2.5 text-right">Conversiones</th>
                        <th className="p-2.5 text-right">Ingresos (€)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(
                    [
                      { key: 'tiktok', label: 'TikTok' },
                      { key: 'instagram', label: 'Instagram' },
                      { key: 'facebook', label: 'Facebook' },
                      { key: 'linkedin', label: 'LinkedIn' },
                      { key: 'youtube', label: 'YouTube' },
                    ] as const
                  ).map((row) => (
                    <tr key={row.key} className="hover:bg-slate-50">
                      <td className="p-2 font-black text-[#081b2b]">{row.label}</td>
                      <td className="p-1.5 text-right">
                        <input
                          type="number"
                          value={draft[row.key].followers_total}
                          onChange={(e) =>
                            updateRow(row.key, 'followers_total', Number(e.target.value))
                          }
                          className="w-24 px-2 py-1 rounded border border-slate-300 text-right font-bold"
                        />
                      </td>
                      <td className="p-1.5 text-right">
                        <input
                          type="number"
                          value={draft[row.key].organic_growth_net}
                          onChange={(e) =>
                            updateRow(row.key, 'organic_growth_net', Number(e.target.value))
                          }
                          className="w-20 px-2 py-1 rounded border border-slate-300 text-right font-bold"
                        />
                      </td>
                      <td className="p-1.5 text-right">
                        <input
                          type="number"
                          value={draft[row.key].organic_reach}
                          onChange={(e) =>
                            updateRow(row.key, 'organic_reach', Number(e.target.value))
                          }
                          className="w-24 px-2 py-1 rounded border border-slate-300 text-right font-bold"
                        />
                      </td>
                      <td className="p-1.5 text-right">
                        <input
                          type="number"
                          value={draft[row.key].paid_reach_clicks}
                          onChange={(e) =>
                            updateRow(row.key, 'paid_reach_clicks', Number(e.target.value))
                          }
                          className="w-24 px-2 py-1 rounded border border-slate-300 text-right font-bold"
                        />
                      </td>
                      <td className="p-1.5 text-right">
                        <input
                          type="number"
                          value={draft[row.key].web_visits}
                          onChange={(e) =>
                            updateRow(row.key, 'web_visits', Number(e.target.value))
                          }
                          className="w-20 px-2 py-1 rounded border border-slate-300 text-right font-bold"
                        />
                      </td>
                      {draft.show_financials && (
                        <>
                          <td className="p-1.5 text-right">
                            <input
                              type="number"
                              step="any"
                              value={draft[row.key].ad_spend}
                              onChange={(e) =>
                                updateRow(row.key, 'ad_spend', Number(e.target.value))
                              }
                              className="w-20 px-2 py-1 rounded border border-emerald-300 bg-emerald-50/50 text-right font-bold"
                            />
                          </td>
                          <td className="p-1.5 text-right">
                            <input
                              type="number"
                              value={draft[row.key].conversions}
                              onChange={(e) =>
                                updateRow(row.key, 'conversions', Number(e.target.value))
                              }
                              className="w-20 px-2 py-1 rounded border border-emerald-300 bg-emerald-50/50 text-right font-bold"
                            />
                          </td>
                          <td className="p-1.5 text-right">
                            <input
                              type="number"
                              step="any"
                              value={draft[row.key].revenue}
                              onChange={(e) =>
                                updateRow(row.key, 'revenue', Number(e.target.value))
                              }
                              className="w-24 px-2 py-1 rounded border border-emerald-300 bg-emerald-50/50 text-right font-bold"
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {draft.directives.map((dir, i) => (
                <div key={i} className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={dir.area}
                      onChange={(e) => updateDirective(i, 'area', e.target.value)}
                      className="font-bold text-xs bg-white px-2 py-1 rounded border border-slate-300 w-full"
                    />
                    <select
                      value={dir.status}
                      onChange={(e) => updateDirective(i, 'status', e.target.value)}
                      className="text-[10px] font-black px-2 py-1 rounded bg-black text-[#f5b514]"
                    >
                      <option value="ESCALAR">ESCALAR</option>
                      <option value="CORREGIR">CORREGIR</option>
                      <option value="MANTENER">MANTENER</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    value={dir.decision}
                    onChange={(e) => updateDirective(i, 'decision', e.target.value)}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-[11px]"
                  />
                  <input
                    type="text"
                    value={dir.expected_impact}
                    onChange={(e) => updateDirective(i, 'expected_impact', e.target.value)}
                    className="w-full px-2 py-1 rounded bg-white border border-slate-300 text-[11px] font-semibold"
                  />
                </div>
              ))}
            </div>
          </form>
        )}

        {/* ===================================================================== */}
        {/* INFORME EJECUTIVO VISUAL (A4 ONE-PAGER CON LOGO OFICIAL SIAM PARK)    */}
        {/* ===================================================================== */}
        <div
          id="ceo-visual-report"
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* CABECERA CON LOGO OFICIAL SIAM PARK */}
          <div className="bg-gradient-to-b from-amber-50/60 to-white pt-5 pb-3 px-6 flex flex-col items-center text-center">
            {!logoError ? (
              <img
                src={SIAM_LOGO_URL}
                alt="Siam Park · The Water Kingdom"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
                className="h-16 sm:h-20 object-contain mb-1"
              />
            ) : (
              <div className="mb-1">
                <div className="text-[11px] font-black tracking-[0.25em] text-[#ed6723] uppercase">
                  THE WATER KINGDOM
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#081b2b]">
                  SIAM PARK <span className="text-[#f5b514]">TENERIFE</span>
                </div>
              </div>
            )}
          </div>

          {/* Banda Negra Ejecutiva */}
          <div className="bg-black text-white px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-base sm:text-lg font-black tracking-wide uppercase">
              INFORME MENSUAL MARKETING · DIRECCIÓN GENERAL
            </h1>
            <span className="inline-block px-3 py-1 rounded-full bg-[#f5b514] text-black text-xs font-black">
              {draft.period_label}
            </span>
          </div>

          <div className="p-5 sm:p-7 space-y-5">
            {/* Síntesis de Dirección */}
            <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 text-xs sm:text-sm leading-relaxed border-l-4 border-[#f5b514]">
              <strong className="text-[#f5b514] uppercase text-xs tracking-wider mr-1.5">
                Diagnóstico Ejecutivo:
              </strong>
              {draft.executive_headline}
            </div>

            {/* 4 TARJETAS VISUALES DE ALTO NIVEL */}
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
                    +{formatCompact(summary.totalOrganicGrowth)} orgánicos/mes
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
                    Impactos / clics patrocinados
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
                    Tráfico directo hacia taquilla
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#ed6723] flex items-center justify-center shrink-0">
                  <MousePointerClick className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* MATRIZ VISUAL SEMÁFORO POR CANAL */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-black">
                  1. Matriz de Rendimiento por Red Social (Semáforo Ejecutivo)
                </h2>
                <div className="flex items-center gap-3 text-[10px] font-bold">
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" /> Alto / Positivo
                  </span>
                  <span className="inline-flex items-center gap-1 text-rose-600">
                    <span className="w-2 h-2 rounded-full bg-rose-600" /> Bajo / Sin Actividad
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-300">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-200/90 text-[#111827] text-[11px] font-black border-b border-slate-300">
                      <th className="py-2.5 px-3.5 bg-slate-300/80">Red Social</th>
                      <th className="py-2.5 px-3 text-center">Comunidad</th>
                      <th className="py-2.5 px-3 text-center">Crecimiento Orgánico</th>
                      <th className="py-2.5 px-3 text-center">Paid Media</th>
                      <th className="py-2.5 px-3 text-center">Visitas a la Web</th>
                      {draft.show_financials && (
                        <>
                          <th className="py-2.5 px-3 text-center">Inversión Ads</th>
                          <th className="py-2.5 px-3 text-center">Conversiones</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {summary.networks.map((net) => {
                      const d = net.data;
                      const orgPositive = d.organic_growth_net >= 100;
                      const paidActive = d.paid_reach_clicks > 0;
                      const visitsGood = d.web_visits >= 500;
                      return (
                        <tr key={net.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3.5 font-black bg-slate-100/80 text-[#081b2b] flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: net.color }}
                            />
                            <span>{net.name}</span>
                          </td>

                          <td className="py-2.5 px-3 text-center font-black text-slate-900">
                            {formatCompact(d.followers_total)}
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 font-black ${
                                orgPositive ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {orgPositive ? (
                                <TrendingUp className="w-3.5 h-3.5" />
                              ) : (
                                <TrendingDown className="w-3.5 h-3.5" />
                              )}
                              {d.organic_growth_net >= 0
                                ? `+${formatCompact(d.organic_growth_net)}`
                                : formatCompact(d.organic_growth_net)}
                            </span>
                            <div className="text-[10px] text-slate-400">
                              ({formatCompact(d.organic_reach)} imp.)
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`font-black ${
                                paidActive ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {paidActive ? formatCompact(d.paid_reach_clicks) : 'Sin pauta'}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`font-black ${
                                visitsGood ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {formatCompact(d.web_visits)}
                            </span>
                          </td>

                          {draft.show_financials && (
                            <>
                              <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                                {formatEur(d.ad_spend)}
                              </td>
                              <td className="py-2.5 px-3 text-center font-black text-emerald-700">
                                {d.conversions} ({formatEur(d.revenue)})
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                    <tr className="bg-black text-white font-black">
                      <td className="py-2.5 px-3.5 uppercase">TOTAL</td>
                      <td className="py-2.5 px-3 text-center text-[#f5b514]">
                        {formatCompact(summary.totalFollowers)}
                      </td>
                      <td className="py-2.5 px-3 text-center text-emerald-400">
                        +{formatCompact(summary.totalOrganicGrowth)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {formatCompact(summary.totalPaid)}
                      </td>
                      <td className="py-2.5 px-3 text-center text-[#f5b514]">
                        {formatCompact(summary.totalWebVisits)}
                      </td>
                      {draft.show_financials && (
                        <>
                          <td className="py-2.5 px-3 text-center">
                            {formatEur(summary.totalAdSpend)}
                          </td>
                          <td className="py-2.5 px-3 text-center text-emerald-400">
                            {summary.totalConversions} ({formatEur(summary.totalRevenue)})
                          </td>
                        </>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* BLOQUE VISUAL: GRÁFICOS COMPARATIVOS */}
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
                  {summary.networks.map((net) => {
                    const orgPct = Math.round(
                      (net.data.organic_reach / summary.maxCombinedImpact) * 100
                    );
                    const paidPct = Math.round(
                      (net.data.paid_reach_clicks / summary.maxCombinedImpact) * 100
                    );
                    const visitPct = Math.max(
                      4,
                      Math.round((net.data.web_visits / summary.maxWebVisits) * 100)
                    );
                    return (
                      <div key={net.id} className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-black text-[#081b2b]">{net.name}</span>
                          <span className="text-slate-500">
                            Impacto:{' '}
                            <strong>
                              {formatCompact(net.data.organic_reach + net.data.paid_reach_clicks)}
                            </strong>{' '}
                            · Web:{' '}
                            <strong className="text-[#ed6723]">
                              {formatCompact(net.data.web_visits)} visitas
                            </strong>
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                          <div
                            className="bg-emerald-500 h-full"
                            style={{ width: `${Math.max(orgPct, net.data.organic_reach > 0 ? 3 : 0)}%` }}
                          />
                          <div
                            className="bg-[#015b9d] h-full"
                            style={{
                              width: `${Math.max(paidPct, net.data.paid_reach_clicks > 0 ? 3 : 0)}%`,
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

                    <div className="space-y-1 text-[11px] w-full">
                      {summary.donut.map((seg) => (
                        <div key={seg.id} className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-slate-700">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: seg.color }}
                            />
                            {seg.name}
                          </span>
                          <span className="font-black text-black">{seg.pct.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-2 text-[11px]">
                  <div className="font-black text-black">Mercados Emisores (UK vs. España)</div>
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span>Facebook (Internacional):</span>
                      <strong className="text-[#1877f2]">
                        UK {draft.uk_share_fb}% · ES {draft.spain_share_fb}%
                      </strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                      <div className="bg-[#1877f2]" style={{ width: `${draft.uk_share_fb}%` }} />
                      <div className="bg-[#f5b514]" style={{ width: `${draft.spain_share_fb}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <span>Instagram (Nacional/Local):</span>
                      <strong className="text-[#e1306c]">
                        ES {draft.spain_share_ig}% · UK {draft.uk_share_ig}%
                      </strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                      <div className="bg-[#e1306c]" style={{ width: `${draft.spain_share_ig}%` }} />
                      <div className="bg-[#015b9d]" style={{ width: `${draft.uk_share_ig}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 flex items-start gap-2">
                  <Trophy className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Liderazgo Competitivo:</strong> Superamos a Waterbom Bali en Facebook
                    (352,3K vs. 334,1K) y multiplicamos x41 la audiencia YouTube de Aqualand Costa
                    Adeje.
                  </div>
                </div>
              </div>
            </div>

            {/* BLOQUE FINAL: 3 DIRECTIVAS EJECUTIVAS */}
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
                {draft.directives.map((dir, i) => {
                  const pill =
                    dir.status === 'ESCALAR'
                      ? 'bg-emerald-700 text-white'
                      : dir.status === 'CORREGIR'
                        ? 'bg-rose-700 text-white'
                        : 'bg-black text-[#f5b514]';
                  return (
                    <div
                      key={i}
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
                        <span>Impacto esperado: {dir.expected_impact}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {draft.show_financials && summary.totalAdSpend > 0 && (
              <div className="rounded-2xl bg-black text-white p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#f5b514]" />
                  <div>
                    <div className="text-[10px] font-black uppercase text-[#f5b514]">
                      Retorno Económico Directo
                    </div>
                    <div className="text-slate-300">Datos consolidados de inversión y ventas</div>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div>
                    <div className="text-[10px] text-slate-400">Inversión Ads</div>
                    <div className="text-base font-black">{formatEur(summary.totalAdSpend)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">ROAS</div>
                    <div className="text-base font-black text-[#f5b514]">
                      {summary.roas.toFixed(2)}x
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Facturación</div>
                    <div className="text-base font-black text-emerald-400">
                      {formatEur(summary.totalRevenue)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}