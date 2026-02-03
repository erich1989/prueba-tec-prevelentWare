'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import FlagIcon from '@mui/icons-material/Flag';
import SaveIcon from '@mui/icons-material/Save';
import {
  backdropSx,
  paperSx,
  contentBoxSx,
  headerRowSx,
  dialogTitleSx,
  closeButtonSx,
  formContentSx,
  labelSx,
  inputSx,
  inputAdornmentSx,
  inputPropsSx,
  iconSx,
  submitWrapSx,
  submitButtonSx,
  footerSx,
  cancelButtonSx,
} from './CrearUsuarioDialog.styles';

export interface CrearUsuarioForm {
  nombre: string;
  correo: string;
  telefono: string;
  rol: string;
  estado: string;
}

export interface UsuarioParaEditar {
  id: string;
  nombre: string;
  correo: string;
  telefono: string | null;
  rol: string;
  estado: string;
}

interface CrearUsuarioDialogProps {
  open: boolean;
  onClose: () => void;
  /** Modo crear: se llama al guardar. */
  onSubmit?: (data: CrearUsuarioForm) => void;
  /** Modo editar: usuario a editar; si está definido, el modal abre en modo edición. */
  usuarioEditando?: UsuarioParaEditar | null;
  /** Modo editar: se llama al guardar con el id y los datos. */
  onEdit?: (id: string, data: CrearUsuarioForm) => void;
  /** En modo crear: deshabilitar botón Guardar mientras se envía. */
  sending?: boolean;
  /** En modo crear: mensaje de error del POST (ej. correo duplicado). */
  submitError?: string | null;
}

const initialForm: CrearUsuarioForm = {
  nombre: '',
  correo: '',
  telefono: '',
  rol: '',
  estado: 'Activo',
};

export function CrearUsuarioDialog({ open, onClose, onSubmit, usuarioEditando, onEdit, sending = false, submitError = null }: CrearUsuarioDialogProps) {
  const [form, setForm] = useState<CrearUsuarioForm>(initialForm);
  const isEditMode = Boolean(usuarioEditando?.id);

  useEffect(() => {
    if (open && usuarioEditando) {
      setForm({
        nombre: usuarioEditando.nombre,
        correo: usuarioEditando.correo || '',
        telefono: usuarioEditando.telefono || '',
        rol: usuarioEditando.rol === 'ADMIN' ? 'Admin' : usuarioEditando.rol === 'USER' ? 'Usuario' : usuarioEditando.rol || '',
        estado: usuarioEditando.estado === 'Activo' || usuarioEditando.estado === 'Inactivo' ? usuarioEditando.estado : 'Activo',
      });
    } else if (open && !usuarioEditando) {
      setForm(initialForm);
    }
  }, [open, usuarioEditando]);

  const handleClose = () => {
    setForm(initialForm);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && usuarioEditando) {
      onEdit?.(usuarioEditando.id, form);
    } else {
      onSubmit?.(form);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ backdrop: { sx: backdropSx } }}
      PaperProps={{ sx: paperSx }}
    >
      <Box sx={contentBoxSx}>
        <Box sx={headerRowSx}>
          <DialogTitle component="h3" sx={dialogTitleSx}>
            {isEditMode ? 'Editar usuario' : 'Crear usuario'}
          </DialogTitle>
          <IconButton aria-label="cerrar" onClick={handleClose} sx={closeButtonSx}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={formContentSx}>
            <Box>
              <Typography component="label" htmlFor="crear-usuario-nombre" sx={labelSx}>
                Nombre
              </Typography>
              <TextField
                id="crear-usuario-nombre"
                fullWidth
                placeholder="Ej. Carlos Mendoza"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={inputAdornmentSx}>
                      <PersonOutlineIcon sx={iconSx} />
                    </InputAdornment>
                  ),
                  sx: inputPropsSx,
                }}
                sx={inputSx}
              />
            </Box>

            <Box>
              <Typography component="label" htmlFor="crear-usuario-correo" sx={labelSx}>
                Correo
              </Typography>
              <TextField
                id="crear-usuario-correo"
                fullWidth
                type="email"
                placeholder="Ej. usuario@correo.com"
                value={form.correo}
                onChange={(e) => setForm((f) => ({ ...f, correo: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={inputAdornmentSx}>
                      <EmailOutlinedIcon sx={iconSx} />
                    </InputAdornment>
                  ),
                  sx: inputPropsSx,
                }}
                sx={inputSx}
              />
            </Box>

            <Box>
              <Typography component="label" htmlFor="crear-usuario-telefono" sx={labelSx}>
                Teléfono
              </Typography>
              <TextField
                id="crear-usuario-telefono"
                fullWidth
                placeholder="Ej. 300 123 4567"
                value={form.telefono}
                onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={inputAdornmentSx}>
                      <PhoneOutlinedIcon sx={iconSx} />
                    </InputAdornment>
                  ),
                  sx: inputPropsSx,
                }}
                sx={inputSx}
              />
            </Box>

            <Box>
              <Typography component="label" htmlFor="crear-usuario-rol" sx={labelSx}>
                Rol
              </Typography>
              <TextField
                id="crear-usuario-rol"
                select
                fullWidth
                value={form.rol}
                onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={inputAdornmentSx}>
                      <WorkOutlineIcon sx={iconSx} />
                    </InputAdornment>
                  ),
                  sx: inputPropsSx,
                }}
                sx={inputSx}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (v: unknown) => (typeof v === 'string' ? v : '') || 'Seleccione un rol',
                }}
              >
                <MenuItem value="">Seleccione un rol</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Usuario">Usuario</MenuItem>
              </TextField>
            </Box>

            <Box>
              <Typography component="label" htmlFor="crear-usuario-estado" sx={labelSx}>
                Estado
              </Typography>
              <TextField
                id="crear-usuario-estado"
                select
                fullWidth
                value={form.estado}
                onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={inputAdornmentSx}>
                      <FlagIcon sx={iconSx} />
                    </InputAdornment>
                  ),
                  sx: inputPropsSx,
                }}
                sx={inputSx}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (v: unknown) => (typeof v === 'string' ? v : '') || 'Seleccione un estado',
                }}
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </TextField>
            </Box>

            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}
            <Box sx={submitWrapSx}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                disabled={sending}
                sx={submitButtonSx}
              >
                {sending ? 'Guardando...' : 'Guardar'}
              </Button>
            </Box>
          </DialogContent>
        </form>
      </Box>

      <Box sx={footerSx}>
        <Button type="button" onClick={handleClose} sx={cancelButtonSx}>
          Cancelar
        </Button>
      </Box>
    </Dialog>
  );
}
