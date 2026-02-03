import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { NuevoMovimientoDialog } from '../../app/components/NuevoMovimientoDialog';
import {
  pageContainerSx,
  headerRowSx,
  pageTitleSx,
  nuevoButtonSx,
  filterCardSx,
  filterCardContentSx,
  filterContentWrapperSx,
  filterRowSx,
  labelCaptionSx,
  formControlConceptoSx,
  formControlDateSx,
  formControlSelectSx,
  searchInputSx,
  dateInputSx,
  selectSx,
  filterButtonSx,
  tableCardSx,
  tableContainerSx,
  tableSx,
  tableHeadRowSx,
  tableHeadCellSx,
  tableBodyRowSx,
  tableFooterRowSx,
  tableCellSx,
  tableCellSecondarySx,
  tableCellMontoSx,
  totalLabelSx,
  totalValueSx,
  totalCardInlineSx,
  totalCardContentInlineSx,
  searchIconSx,
  emptyCellTextBoldSx,
  editButtonSx,
  deleteButtonSx,
  conceptoIconIngresoSx,
  conceptoIconEgresoSx,
  conceptoCellContentSx,
} from '@/styles/movimientos.styles';
import { useMovimientos, type TipoMovimiento } from '@/hooks/useMovimientos';

function formatMonto(monto: number, tipo: TipoMovimiento): string {
  return `$ ${monto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function MovimientosPage() {
  const {
    movimientos,
    movimientosTotal,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    loading,
    error,
    total,
    concepto,
    setConcepto,
    tipoFiltro,
    setTipoFiltro,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    dialogNuevoOpen,
    movimientoEditando,
    eliminandoId,
    sending,
    errorCrear,
    handleNuevoMovimientoSubmit,
    handleEditarMovimiento,
    handleEliminarMovimiento,
    openDialogNuevo,
    openModalEditar,
    closeDialog,
    limpiarFiltros,
    emptyStateMessage,
  } = useMovimientos();

  return (
    <Box sx={pageContainerSx}>
      <Box sx={headerRowSx}>
        <Typography variant="h4" component="h1" sx={pageTitleSx}>
          Ingresos y gastos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openDialogNuevo}
          sx={nuevoButtonSx}
        >
          Nuevo
        </Button>
      </Box>

      <NuevoMovimientoDialog
        open={dialogNuevoOpen}
        onClose={closeDialog}
        onSubmit={handleNuevoMovimientoSubmit}
        movimientoEditando={movimientoEditando}
        onEdit={handleEditarMovimiento}
        sending={sending}
        submitError={errorCrear}
      />

      <Card elevation={0} sx={filterCardSx}>
        <CardContent sx={filterCardContentSx}>
          <Box sx={filterContentWrapperSx}>
            <Box sx={filterRowSx}>
            <FormControl sx={formControlConceptoSx} size="small">
              <Typography variant="caption" sx={labelCaptionSx}>
                Concepto
              </Typography>
              <TextField
                size="small"
                placeholder="Buscar por concepto..."
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={searchIconSx} />
                    </InputAdornment>
                  ),
                }}
                sx={searchInputSx}
              />
            </FormControl>
            <FormControl sx={formControlSelectSx} size="small">
              <Typography variant="caption" sx={labelCaptionSx}>
                Tipo
              </Typography>
              <Select
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                displayEmpty
                sx={selectSx}
                renderValue={(v) => (v === 'ingreso' ? 'Ingreso' : v === 'egreso' ? 'Gasto' : '') || 'Seleccionar tipo'}
              >
                <MenuItem value="">Seleccionar tipo</MenuItem>
                <MenuItem value="ingreso">Ingreso</MenuItem>
                <MenuItem value="egreso">Gasto</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={formControlDateSx}>
              <Typography variant="caption" sx={labelCaptionSx}>
                Desde
              </Typography>
              <TextField
                size="small"
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                sx={dateInputSx}
                inputProps={{ 'aria-label': 'Fecha desde' }}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
            <FormControl size="small" sx={formControlDateSx}>
              <Typography variant="caption" sx={labelCaptionSx}>
                Hasta
              </Typography>
              <TextField
                size="small"
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                sx={dateInputSx}
                inputProps={{ 'aria-label': 'Fecha hasta' }}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
            <Button variant="outlined" color="primary" sx={filterButtonSx} aria-label="Quitar filtros" onClick={limpiarFiltros}>
              <FilterListOffIcon />
            </Button>
          </Box>
            <Card elevation={0} sx={totalCardInlineSx}>
              <CardContent sx={totalCardContentInlineSx}>
                <Typography variant="caption" sx={totalLabelSx}>
                  Total
                </Typography>
                <Typography sx={totalValueSx}>
                  $ {total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </CardContent>
      </Card>

      <Card elevation={0} sx={tableCardSx}>
        <TableContainer component={Paper} elevation={0} sx={tableContainerSx}>
          <Table size="medium" sx={tableSx}>
            <TableHead>
              <TableRow sx={tableHeadRowSx}>
                <TableCell sx={tableHeadCellSx}>Concepto</TableCell>
                <TableCell sx={tableHeadCellSx}>Monto</TableCell>
                <TableCell sx={tableHeadCellSx}>Fecha</TableCell>
                <TableCell sx={tableHeadCellSx}>Usuario</TableCell>
                <TableCell sx={tableHeadCellSx}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ ...tableCellSecondarySx, py: 4 }}>
                    Cargando movimientos...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ ...tableCellSecondarySx, py: 4 }}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : emptyStateMessage ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ ...tableCellSecondarySx, py: 4 }}>
                    {emptyStateMessage.prefix}
                    {emptyStateMessage.highlight != null && (
                      <Box component="span" sx={emptyCellTextBoldSx}>
                        {emptyStateMessage.highlight}
                      </Box>
                    )}
                    {emptyStateMessage.suffix}
                  </TableCell>
                </TableRow>
              ) : (
                movimientos.map((row) => (
                  <TableRow key={row.id} sx={tableBodyRowSx}>
                    <TableCell sx={tableCellSx}>
                      <Box sx={conceptoCellContentSx}>
                        <Box sx={row.tipo === 'ingreso' ? conceptoIconIngresoSx : conceptoIconEgresoSx}>
                          {row.tipo === 'ingreso' ? (
                            <TrendingUpIcon sx={{ fontSize: 20 }} />
                          ) : (
                            <TrendingDownIcon sx={{ fontSize: 20 }} />
                          )}
                        </Box>
                        <Typography component="span" variant="body2">
                          {row.concepto}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        ...tableCellMontoSx,
                        color: row.tipo === 'ingreso' ? '#059669' : '#dc2626',
                      }}
                    >
                      {formatMonto(row.monto, row.tipo)}
                    </TableCell>
                    <TableCell sx={{ ...tableCellSecondarySx, color: 'grey.500' }}>{row.fecha}</TableCell>
                    <TableCell sx={{ ...tableCellSecondarySx, color: 'grey.600' }}>{row.usuario}</TableCell>
                    <TableCell sx={tableCellSx}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                        {eliminandoId === row.id ? (
                          <>
                            <CircularProgress size={20} />
                            <Typography variant="body2" color="text.secondary">
                              Eliminando...
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => openModalEditar(row)}
                              sx={editButtonSx}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => {
                                if (window.confirm('¿Eliminar este movimiento?')) {
                                  handleEliminarMovimiento(row.id);
                                }
                              }}
                              sx={deleteButtonSx}
                            >
                              Eliminar
                            </Button>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow sx={tableFooterRowSx}>
                <TablePagination
                  count={movimientosTotal}
                  page={page}
                  onPageChange={onPageChange}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={onRowsPerPageChange}
                  rowsPerPageOptions={[5, 10, 25]}
                  labelRowsPerPage="Filas por página:"
                  labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
                  colSpan={5}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
