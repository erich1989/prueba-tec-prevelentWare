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
  Chip,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CrearUsuarioDialog } from '../../app/components/CrearUsuarioDialog';
import {
  pageContainerSx,
  headerRowSx,
  pageTitleSx,
  nuevoButtonSx,
  filterCardSx,
  filterCardContentSx,
  filterRowSx,
  labelCaptionSx,
  formControlSearchSx,
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
  editButtonSx,
  deleteButtonSx,
  searchIconSx,
  getRoleChipStyles,
} from './usuarios.styles';
import { useUsuarios } from './useUsuarios';

export default function UsuariosPage() {
  const {
    usuarios,
    loading,
    error,
    nombreCorreo,
    setNombreCorreo,
    rolFiltro,
    setRolFiltro,
    estadoFiltro,
    setEstadoFiltro,
    dialogOpen,
    usuarioEditando,
    eliminandoId,
    sending,
    errorCrear,
    handleCrearUsuarioSubmit,
    handleEditarUsuario,
    openModalCrear,
    handleEliminarUsuario,
    openModalEditar,
    closeDialog,
  } = useUsuarios();

  return (
    <Box sx={pageContainerSx}>
      <Box sx={headerRowSx}>
        <Typography variant="h4" component="h1" sx={pageTitleSx}>
          Usuarios
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openModalCrear}
          sx={nuevoButtonSx}
        >
          Nuevo
        </Button>
      </Box>

      <CrearUsuarioDialog
        open={dialogOpen}
        onClose={closeDialog}
        onSubmit={handleCrearUsuarioSubmit}
        usuarioEditando={usuarioEditando}
        onEdit={handleEditarUsuario}
        sending={sending}
        submitError={errorCrear}
      />

      <Card elevation={0} sx={filterCardSx}>
        <CardContent sx={filterCardContentSx}>
          <Box sx={filterRowSx}>
            <FormControl sx={formControlSearchSx} size="small">
              <Typography variant="caption" sx={labelCaptionSx}>
                Nombre / Correo
              </Typography>
              <TextField
                size="small"
                placeholder="Buscar usuario..."
                value={nombreCorreo}
                onChange={(e) => setNombreCorreo(e.target.value)}
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
                Rol
              </Typography>
              <Select
                value={rolFiltro}
                onChange={(e) => setRolFiltro(e.target.value)}
                displayEmpty
                sx={selectSx}
                renderValue={(v) => v || 'Todos los roles'}
              >
                <MenuItem value="">Todos los roles</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Usuario">Usuario</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={formControlSelectSx} size="small">
              <Typography variant="caption" sx={labelCaptionSx}>
                Estado
              </Typography>
              <Select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                displayEmpty
                sx={selectSx}
                renderValue={(v) => v || 'Todos los estados'}
              >
                <MenuItem value="">Todos los estados</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
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
                <TableCell sx={tableHeadCellSx}>Nombre</TableCell>
                <TableCell sx={tableHeadCellSx}>Correo</TableCell>
                <TableCell sx={tableHeadCellSx}>Teléfono</TableCell>
                <TableCell sx={tableHeadCellSx}>Tipo de usuario</TableCell>
                <TableCell sx={tableHeadCellSx}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={tableCellSecondarySx}>
                    Cargando usuarios...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} sx={tableCellSecondarySx}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map((row) => (
                  <TableRow key={row.id} sx={tableBodyRowSx}>
                    <TableCell sx={tableCellSx}>{row.nombre}</TableCell>
                    <TableCell sx={tableCellSecondarySx}>{row.correo}</TableCell>
                    <TableCell sx={tableCellSecondarySx}>{row.telefono ?? ''}</TableCell>
                    <TableCell sx={tableCellSecondarySx}>
                      <Chip
                        label={
                          row.rol === 'ADMIN'
                            ? 'Administrador'
                            : row.rol === 'USER'
                              ? 'Usuario'
                              : row.rol
                        }
                        size="small"
                        variant="outlined"
                        sx={getRoleChipStyles(row.rol)}
                      />
                    </TableCell>
                    <TableCell sx={{ px: 4, py: 2.5 }}>
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
                                if (window.confirm('¿Eliminar este usuario? Se eliminarán sus sesiones, cuentas y movimientos.')) {
                                  handleEliminarUsuario(row.id);
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
    </Box>
  );
}
