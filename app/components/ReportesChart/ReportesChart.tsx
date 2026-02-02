'use client';

import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
import type { ApexOptions } from 'apexcharts';
import { getChartWrapperSx, chartLoadingSx } from './ReportesChart.styles';
import { formatPesos } from '@/lib/formatters';

// Documentación: https://apexcharts.com/docs/react-charts/ — import con dynamic y ssr: false para Next.js
const Chart = dynamic(
  () => import('react-apexcharts').then((mod) => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => <Box sx={chartLoadingSx} />,
  }
);

const DIAS_CATEGORIAS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const DIAS_SERIE = [
  1200, 0, -800, 2500, 0, 1800, 0, -1200, 3200, 0, 900, 0, -500, 4100, 0, 1500, 0, -2000, 2800, 0,
  700, 0, -600, 3500, 0, 1100, 0, -400, 2200, 0, 1900,
];

const MESES_CATEGORIAS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MESES_SERIE = [45000, 32000, -12000, 28000, 15000, 38000, 22000, -5000, 41000, 19000, 33000, 26000];

const AÑOS_CATEGORIAS = ['2022', '2023', '2024'];
const AÑOS_SERIE = [125000, 98000, 142000];

const baseOptions: ApexOptions = {
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: '"Inter", sans-serif',
    background: 'transparent',
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '60%',
      borderRadius: 4,
      distributed: false,
    },
  },
  colors: ['#059669', '#059669', '#059669', '#dc2626'],
  dataLabels: { enabled: false },
  stroke: { show: true, width: 1, colors: ['transparent'] },
  xaxis: {
    categories: MESES_CATEGORIAS,
    labels: {
      style: { colors: '#6b7280', fontSize: '12px' },
    },
    axisBorder: { show: true, color: '#e5e7eb' },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: '#6b7280', fontSize: '12px' },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
    crosshairs: { show: false },
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  legend: { show: false },
  tooltip: {
    theme: 'light',
    y: {
      formatter: formatPesos,
    },
  },
};

export type VistaGraficaChart = 'dia' | 'mes' | 'año';

function getCategoriesAndData(vista: VistaGraficaChart): { categories: string[]; data: number[] } {
  if (vista === 'dia') return { categories: DIAS_CATEGORIAS, data: DIAS_SERIE };
  if (vista === 'mes') return { categories: MESES_CATEGORIAS, data: MESES_SERIE };
  return { categories: AÑOS_CATEGORIAS, data: AÑOS_SERIE };
}

interface ReportesChartProps {
  vista?: VistaGraficaChart;
  /** Mes en formato YYYY-MM; se usa cuando vista === 'dia' para filtrar datos por ese mes. */
  mesParaVistaDia?: string;
  /** Año (ej. 2024); se usa cuando vista === 'mes' para filtrar datos por ese año. */
  añoParaVistaMes?: number;
  /** Categorías del eje X; si se pasan (ej. vista año con datos reales), reemplazan las por defecto. */
  categoriesOverride?: string[];
  series?: ApexOptions['series'];
  options?: ApexOptions;
  height?: number;
}

const COLORS_INGRESO_EGRESO = ['#059669', '#dc2626'];

export function ReportesChart({ vista = 'mes', mesParaVistaDia, añoParaVistaMes, categoriesOverride, series, options = {}, height = 320 }: ReportesChartProps) {
  const { categories, data } = getCategoriesAndData(vista);
  const defaultSeries: ApexOptions['series'] = series ?? [{ name: 'Saldo', data }];
  const isDia = vista === 'dia';
  const isDosSeries = Array.isArray(defaultSeries) && defaultSeries.length === 2;
  const xCategories = categoriesOverride?.length ? categoriesOverride : categories;
  const mergedOptions = {
    ...baseOptions,
    ...options,
    colors: isDosSeries ? COLORS_INGRESO_EGRESO : baseOptions.colors,
    legend: isDosSeries ? { show: true, position: 'top', horizontalAlign: 'right' } : { show: false },
    tooltip:
      isDosSeries
        ? { ...baseOptions.tooltip, y: [{ formatter: formatPesos }, { formatter: formatPesos }] }
        : baseOptions.tooltip,
    plotOptions: {
      ...baseOptions.plotOptions,
      bar: {
        ...baseOptions.plotOptions?.bar,
        columnWidth: isDia ? '55%' : '60%',
      },
    },
    xaxis: {
      ...baseOptions.xaxis,
      ...options.xaxis,
      categories: xCategories,
      labels: {
        ...baseOptions.xaxis?.labels,
        style: { colors: '#6b7280', fontSize: isDia ? '10px' : '12px' },
      },
    },
  };

  return (
    <Box sx={getChartWrapperSx(height)}>
      <Chart type="bar" series={defaultSeries} options={mergedOptions} height={height} width="100%" />
    </Box>
  );
}
