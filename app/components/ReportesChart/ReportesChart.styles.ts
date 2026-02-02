import type { SxProps, Theme } from '@mui/material';

export function getChartWrapperSx(height: number): SxProps<Theme> {
  return {
    width: '100%',
    minHeight: height,
  };
}

export const chartLoadingSx: SxProps<Theme> = {
  width: '100%',
  minHeight: 280,
  bgcolor: 'grey.50',
  borderRadius: 1,
};
