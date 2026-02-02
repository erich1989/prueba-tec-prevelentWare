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
  Alert,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SendIcon from '@mui/icons-material/Send';
import {
  backdropSx,
  paperSx,
  contentBoxSx,
  headerRowSx,
  dialogTitleSx,
  closeButtonSx,
  formContentSx,
  labelSx,
  tipoGridSx,
  tipoButtonBaseSx,
  inputSx,
  inputAdornmentStartSx,
  montoInputPropsSx,
  currencySymbolSx,
  conceptInputPropsSx,
  dateInputAdornmentSx,
  calendarIconSx,
  submitWrapSx,
  submitButtonSx,
  footerSx,
  cancelButtonSx,
  tipoLabelSx,
  ingresoIconSx,
  egresoIconSx,
  getTipoButtonIngresoSx,
  getTipoButtonEgresoSx,
} from './NuevoMovimientoDialog.styles';

export type TipoMovimientoForm = 'ingreso' | 'egreso';

export interface NuevoMovimientoForm {
  tipo: TipoMovimientoForm;
  monto: string;
  concepto: string;
  fecha: string;
}

export interface MovimientoParaEditar {
  id: string;
  concepto: string;
  monto: number;
  fechaISO: string;
  tipo: TipoMovimientoForm;
}

interface NuevoMovimientoDialogProps {
  open: boolean;
  onClose: () => void;
  /** Modo crear: se llama al guardar. */
  onSubmit?: (data: NuevoMovimientoForm) => void;
  /** Modo editar: movimiento a editar; si está definido, el modal abre en modo edición. */
  movimientoEditando?: MovimientoParaEditar | null;
  /** Modo editar: se llama al guardar con el id y los datos. */
  onEdit?: (id: string, data: NuevoMovimientoForm) => void;
  sending?: boolean;
  submitError?: string | null;
}

const initialForm: NuevoMovimientoForm = {
  tipo: 'ingreso',
  monto: '',
  concepto: '',
  fecha: '',
};

export function NuevoMovimientoDialog({ open, onClose, onSubmit, movimientoEditando, onEdit, sending = false, submitError = null }: NuevoMovimientoDialogProps) {
  const [form, setForm] = useState<NuevoMovimientoForm>(initialForm);
  const isEditMode = Boolean(movimientoEditando?.id);

  useEffect(() => {
    if (open && movimientoEditando) {
      setForm({
        tipo: movimientoEditando.tipo,
        monto: String(movimientoEditando.monto),
        concepto: movimientoEditando.concepto,
        fecha: movimientoEditando.fechaISO || '',
      });
    } else if (open && !movimientoEditando) {
      setForm(initialForm);
    }
  }, [open, movimientoEditando]);

  const handleClose = () => {
    setForm(initialForm);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && movimientoEditando) {
      onEdit?.(movimientoEditando.id, form);
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
            {isEditMode ? 'Editar Movimiento' : 'Nuevo Movimiento de Dinero'}
          </DialogTitle>
          <IconButton aria-label="cerrar" onClick={handleClose} sx={closeButtonSx}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={formContentSx}>
            <Box>
              <Typography component="label" sx={labelSx}>
                Tipo de Movimiento
              </Typography>
              <Box sx={tipoGridSx}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, tipo: 'ingreso' }))}
                  sx={getTipoButtonIngresoSx(form.tipo === 'ingreso')}
                >
                  <TrendingUpIcon sx={ingresoIconSx} />
                  <Typography sx={tipoLabelSx}>Ingreso</Typography>
                </Box>
                <Box
                  component="button"
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, tipo: 'egreso' }))}
                  sx={getTipoButtonEgresoSx(form.tipo === 'egreso')}
                >
                  <TrendingDownIcon sx={egresoIconSx} />
                  <Typography sx={tipoLabelSx}>Gasto</Typography>
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography component="label" htmlFor="monto" sx={labelSx}>
                Monto
              </Typography>
              <TextField
                id="monto"
                fullWidth
                placeholder="0.00"
                value={form.monto}
                onChange={(e) => setForm((f) => ({ ...f, monto: e.target.value }))}
                inputProps={{ step: 0.01, min: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={inputAdornmentStartSx}>
                      <Typography sx={currencySymbolSx}>$</Typography>
                    </InputAdornment>
                  ),
                  sx: montoInputPropsSx,
                }}
                sx={inputSx}
              />
            </Box>

            <Box>
              <Typography component="label" htmlFor="concepto" sx={labelSx}>
                Concepto
              </Typography>
              <TextField
                id="concepto"
                fullWidth
                placeholder="Descripción del movimiento..."
                value={form.concepto}
                onChange={(e) => setForm((f) => ({ ...f, concepto: e.target.value }))}
                InputProps={{ sx: conceptInputPropsSx }}
                sx={inputSx}
              />
            </Box>

            <Box>
              <Typography component="label" htmlFor="fecha" sx={labelSx}>
                Fecha
              </Typography>
              <TextField
                id="fecha"
                fullWidth
                type="date"
                value={form.fecha}
                onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={dateInputAdornmentSx}>
                      <CalendarTodayIcon sx={calendarIconSx} />
                    </InputAdornment>
                  ),
                  sx: conceptInputPropsSx,
                }}
                sx={inputSx}
              />
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
                endIcon={sending ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                disabled={sending}
                sx={submitButtonSx}
              >
                {sending ? 'Guardando...' : isEditMode ? 'Guardar cambios' : 'Ingresar Movimiento'}
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
