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
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
  filterRowSx,
  labelCaptionSx,
  formControlConceptoSx,
  formControlSelectSx,
  searchInputSx,
  selectSx,
  filterButtonSx,
  tableCardSx,
  tableContainerSx,
  tableSx,
  tableHeadRowSx,
  tableHeadCellSx,
  tableBodyRowSx,
  tableCellSx,
  tableCellSecondarySx,
  tableCellMontoSx,
  totalWrapperSx,
  totalCardSx,
  totalCardContentSx,
  totalLabelSx,
  totalValueSx,
  searchIconSx,
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
    loading,
    error,
    total,
    concepto,
    setConcepto,
    tipoFiltro,
    setTipoFiltro,
    usuarioFiltro,
    setUsuarioFiltro,
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
                renderValue={(v) => v || 'Seleccionar tipo'}
              >
                <MenuItem value="">Seleccionar tipo</MenuItem>
                <MenuItem value="ingreso">Ingreso</MenuItem>
                <MenuItem value="egreso">Gasto</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={formControlSelectSx} size="small">
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
              </Select>
            </FormControl>
            <Button variant="outlined" color="primary" sx={filterButtonSx}>
              Filtrar
            </Button>
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
              ) : movimientos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ ...tableCellSecondarySx, py: 4 }}>
                    No hay movimientos registrados
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
          </Table>
        </TableContainer>
      </Card>

      <Box sx={totalWrapperSx}>
        <Card elevation={0} sx={totalCardSx}>
          <CardContent sx={totalCardContentSx}>
            <Typography variant="caption" sx={totalLabelSx}>
              Total
            </Typography>
            <Typography sx={totalValueSx}>
              $ {total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
