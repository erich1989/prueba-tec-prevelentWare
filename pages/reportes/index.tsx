'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { ReportesChart } from '../../app/components/ReportesChart';
import {
  labelCaptionSx,
  labelCaptionWithMbSx,
  pageTitleSx,
  pageContainerSx,
  filterCardSx,
  filterCardContentSx,
  filterContentWrapperSx,
  filterRowSx,
  formControlDateSx,
  formControlSelectSx,
  dateInputSx,
  selectSx,
  filterButtonSx,
  gridContainerSx,
  cardChartSx,
  cardSaldoSx,
  cardContentChartSx,
  cardContentSaldoSx,
  saldoValueSx,
  csvButtonSx,
  chartVistaSelectSx,
  todayPaperSx,
  todayIconWrapperSx,
  todayLabelSx,
  todayValueSx,
  todayCalendarIconSx,
} from '@/styles/reportes.styles';
import { useReportes } from '@/hooks/useReportes';

export default function ReportesPage() {
  const router = useRouter();
  const {
    tipoFiltro,
    setTipoFiltro,
    usuarioFiltro,
    setUsuarioFiltro,
    vistaGrafica,
    setVistaGrafica,
    mesParaVistaDia,
    setMesParaVistaDia,
    añoParaVistaMes,
    setAñoParaVistaMes,
    loadingReporte,
    loadingReporteMessage,
    errorReporte,
    chartSeries,
    chartCategoriesOverride,
    saldo,
    loadingSaldo,
    errorSaldo,
    handleDescargarCSV,
    limpiarFiltros,
  } = useReportes();

  // Sincronizar mes con query ?mes=YYYY-MM (ej. desde Inicio > Ver Detalle Mensual)
  useEffect(() => {
    const mes = typeof router.query.mes === 'string' ? router.query.mes.trim() : '';
    if (mes && /^\d{4}-\d{2}$/.test(mes)) {
      setMesParaVistaDia(mes);
      setVistaGrafica('dia');
    }
  }, [router.query.mes, setMesParaVistaDia, setVistaGrafica]);

  const hoyFormatted = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <Box sx={pageContainerSx}>
      <Typography variant="h4" component="h1" sx={pageTitleSx}>
        Reportes
      </Typography>

      <Card elevation={0} sx={filterCardSx}>
        <CardContent sx={filterCardContentSx}>
          <Box sx={filterContentWrapperSx}>
            <Box sx={filterRowSx}>
            <FormControl size="small" sx={chartVistaSelectSx}>
              <Typography variant="caption" sx={labelCaptionSx}>
                Vista
              </Typography>
              <Select
                value={vistaGrafica}
                onChange={(e) => setVistaGrafica(e.target.value as 'dia' | 'mes' | 'año')}
                displayEmpty
                sx={selectSx}
                renderValue={(v) =>
                  v === 'dia' ? 'Por día del mes' : v === 'mes' ? 'Por mes' : 'Por año'
                }
              >
                <MenuItem value="dia">Por día del mes</MenuItem>
                <MenuItem value="mes">Por mes</MenuItem>
                <MenuItem value="año">Por año</MenuItem>
              </Select>
            </FormControl>
            {vistaGrafica === 'dia' && (
              <FormControl size="small" sx={formControlDateSx}>
                <Typography variant="caption" sx={labelCaptionSx}>
                  Mes
                </Typography>
                <TextField
                  size="small"
                  type="month"
                  value={mesParaVistaDia}
                  onChange={(e) => setMesParaVistaDia(e.target.value)}
                  sx={dateInputSx}
                  inputProps={{ 'aria-label': 'Seleccionar mes' }}
                />
              </FormControl>
            )}
            {vistaGrafica === 'mes' && (
              <FormControl size="small" sx={formControlSelectSx}>
                <Typography variant="caption" sx={labelCaptionSx}>
                  Año
                </Typography>
                <Select
                  value={añoParaVistaMes}
                  onChange={(e) => setAñoParaVistaMes(Number(e.target.value))}
                  displayEmpty
                  sx={selectSx}
                  renderValue={(v) => v || 'Año'}
                >
                  {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <FormControl sx={formControlSelectSx} size="small">
              <Typography variant="caption" sx={labelCaptionSx}>
                Tipo
              </Typography>
              <Select
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                displayEmpty
                sx={selectSx}
                renderValue={(v) => v || 'Todos los tipos'}
              >
                <MenuItem value="">Todos los tipos</MenuItem>
                <MenuItem value="ingreso">Ingreso</MenuItem>
                <MenuItem value="egreso">Gasto</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={formControlSelectSx} size="small" disabled>
              <Typography variant="caption" sx={labelCaptionSx}>
                Usuario
              </Typography>
              <Select
                value={usuarioFiltro}
                onChange={(e) => setUsuarioFiltro(e.target.value)}
                displayEmpty
                sx={selectSx}
                renderValue={(v) => v || 'Todos los usuarios'}
              >
                <MenuItem value="">Todos los usuarios</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Usuario">Usuario</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" color="primary" sx={filterButtonSx} aria-label="Quitar filtros" onClick={limpiarFiltros}>
              <FilterListOffIcon />
            </Button>
            </Box>
            <Paper elevation={0} sx={todayPaperSx}>
              <Box sx={todayIconWrapperSx}>
                <CalendarTodayIcon sx={todayCalendarIconSx} />
              </Box>
              <Box>
                <Typography variant="caption" sx={todayLabelSx}>
                  Hoy es
                </Typography>
                <Typography variant="subtitle1" sx={todayValueSx}>
                  {hoyFormatted}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </CardContent>
      </Card>

      <Box sx={gridContainerSx}>
        <Card elevation={0} sx={cardChartSx}>
          <CardContent sx={cardContentChartSx}>
            <Typography variant="caption" sx={labelCaptionWithMbSx}>
              Movimientos
            </Typography>
            {(vistaGrafica === 'dia' || vistaGrafica === 'mes' || vistaGrafica === 'año') && errorReporte && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {errorReporte}
              </Typography>
            )}
            {(vistaGrafica === 'dia' || vistaGrafica === 'mes' || vistaGrafica === 'año') && loadingReporte ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 280 }}>
                <Typography color="text.secondary">{loadingReporteMessage}</Typography>
              </Box>
            ) : (
              <ReportesChart
                vista={vistaGrafica}
                mesParaVistaDia={mesParaVistaDia}
                añoParaVistaMes={añoParaVistaMes}
                categoriesOverride={chartCategoriesOverride}
                series={chartSeries}
                height={280}
              />
            )}
          </CardContent>
        </Card>

        <Card elevation={0} sx={cardSaldoSx}>
          <CardContent sx={cardContentSaldoSx}>
            <Typography variant="caption" sx={labelCaptionSx}>
              Saldo
            </Typography>
            {loadingSaldo ? (
              <Typography color="text.secondary" sx={saldoValueSx}>
                Cargando...
              </Typography>
            ) : errorSaldo ? (
              <Typography color="error" variant="body2" sx={saldoValueSx}>
                {errorSaldo}
              </Typography>
            ) : (
              <Typography sx={saldoValueSx}>
                $ {saldo.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </Typography>
            )}
            <Button
              variant="outlined"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleDescargarCSV}
              sx={csvButtonSx}
            >
              Descargar CSV
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
