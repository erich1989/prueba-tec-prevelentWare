import type { SxProps, Theme } from '@mui/material';

export const pageContainerSx: SxProps<Theme> = {
  height: '100%',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
};

export const scrollZoneSx: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
};

export const headerRowSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: 2,
  mb: 3,
};

export const pageTitleSx: SxProps<Theme> = {
  fontSize: { xs: '1.875rem', md: '2.25rem' },
  fontWeight: 700,
  color: 'text.primary',
  mb: 1,
};

export const pageSubtitleSx: SxProps<Theme> = {
  color: 'text.secondary',
  maxWidth: 560,
  fontSize: '1.125rem',
  mt: 1,
};

export const todayPaperSx: SxProps<Theme> = {
  px: 2,
  py: 1.5,
  borderRadius: '16px',
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'grey.100',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  display: 'flex',
  alignItems: 'center',
  gap: 2,
};

export const todayIconWrapperSx: SxProps<Theme> = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  bgcolor: '#d1fae5',
  color: 'primary.main',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const todayLabelSx: SxProps<Theme> = {
  color: 'text.secondary',
  display: 'block',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export const todayValueSx: SxProps<Theme> = {
  fontWeight: 700,
  color: 'text.primary',
};

export const featureGridSx: SxProps<Theme> = { mb: 3 };

export const featureCardSx: SxProps<Theme> = {
  height: '100%',
  position: 'relative',
  borderRadius: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  border: '1px solid',
  borderColor: 'grey.100',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
    transform: 'translateY(-4px)',
  },
};

export const featureCardContentSx: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  p: 3,
};

export const featureCardNumberSx: SxProps<Theme> = {
  position: 'absolute',
  top: 16,
  right: 16,
  fontSize: '3.75rem',
  fontWeight: 800,
  color: '#d1fae5',
  lineHeight: 1,
  userSelect: 'none',
};

export const featureCardIconWrapperSx: SxProps<Theme> = {
  width: 56,
  height: 56,
  borderRadius: '16px',
  bgcolor: '#ecfdf5',
  color: 'primary.main',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mb: 2,
};

export const featureCardIconSx: SxProps<Theme> = { fontSize: 32 };

export const featureCardTitleSx: SxProps<Theme> = {
  fontWeight: 700,
  color: 'text.primary',
  mb: 1,
  fontSize: '1.25rem',
};

export const featureCardDescriptionSx: SxProps<Theme> = {
  color: 'text.secondary',
  mb: 2,
  flex: 1,
  fontSize: '0.875rem',
  lineHeight: 1.6,
};

export const featureCardFooterSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,
  flexWrap: 'wrap',
};

export const featureBadgeSx: SxProps<Theme> = {
  textTransform: 'uppercase',
  fontWeight: 700,
  fontSize: '0.75rem',
  borderRadius: '9999px',
  letterSpacing: '-0.01em',
};

export const featureBadgeOutlinedSx: SxProps<Theme> = {
  ...featureBadgeSx,
  bgcolor: 'grey.100',
  color: 'text.secondary',
  border: 'none',
};

export const resumenPaperSx: SxProps<Theme> = {
  mt: 'auto',
  p: { xs: 3, md: 4 },
  borderRadius: '2rem',
  bgcolor: 'primary.main',
  color: 'white',
  mb: 3,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
  flexShrink: 0,
};

export const resumenBlobTopSx: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  right: 0,
  width: 256,
  height: 256,
  bgcolor: 'white',
  opacity: 0.05,
  borderRadius: '50%',
  mr: -5,
  mt: -5,
};

export const resumenBlobBottomSx: SxProps<Theme> = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: 128,
  height: 128,
  bgcolor: 'white',
  opacity: 0.05,
  borderRadius: '50%',
  ml: -2,
  mb: -2,
};

export const resumenContentSx: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: { xs: 'column', lg: 'row' },
  justifyContent: 'space-between',
  alignItems: { xs: 'stretch', lg: 'center' },
  gap: 3,
};

export const resumenTextBlockSx: SxProps<Theme> = { flex: 1, maxWidth: 448 };

export const resumenTitleSx: SxProps<Theme> = {
  fontWeight: 700,
  mb: 1,
  fontSize: '1.875rem',
  color: 'white',
};

export const resumenSubtitleSx: SxProps<Theme> = {
  color: '#d1fae5',
  opacity: 0.9,
  mb: 2,
  fontSize: '1rem',
};

export const resumenButtonSx: SxProps<Theme> = {
  bgcolor: 'white',
  color: 'primary.main',
  fontWeight: 700,
  borderRadius: '12px',
  px: 3,
  py: 1.5,
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
  '&:hover': { bgcolor: '#ecfdf5' },
};

export const resumenStatsRowSx: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
  flexWrap: 'wrap',
};

export const resumenStatBoxSx: SxProps<Theme> = {
  bgcolor: 'rgba(6, 78, 59, 0.4)',
  backdropFilter: 'blur(12px)',
  p: 2,
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.1)',
  minWidth: 140,
};

export const resumenStatLabelSx: SxProps<Theme> = {
  color: '#d1fae5',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  display: 'block',
  mb: 0.5,
};

export const resumenStatValueSx: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: '1.5rem',
  color: 'white',
};

export const resumenStatTrendSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  color: '#a7f3d0',
  mt: 1,
};

export const resumenStatTrendNegativeSx: SxProps<Theme> = {
  ...resumenStatTrendSx,
  color: '#fca5a5',
};

export const footerSx: SxProps<Theme> = {
  pt: 3,
  pb: 2,
  borderTop: '1px solid',
  borderColor: 'grey.100',
  flexShrink: 0,
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 2,
};

export const footerTextSx: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: '0.875rem',
};

export const footerLinksSx: SxProps<Theme> = { display: 'flex', gap: 3 };

export const featureCardLinkStyle = {
  textDecoration: 'none',
  color: '#064e3b',
  fontWeight: 600,
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
} as const;

export const footerLinkStyle = {
  color: '#6b7280',
  fontSize: '0.875rem',
  fontWeight: 500,
  textDecoration: 'none',
} as const;

export const calendarIconSx: SxProps<Theme> = { fontSize: 24 };

export const arrowIconSx: SxProps<Theme> = { fontSize: 16 };

export const trendIconSx: SxProps<Theme> = { fontSize: 16 };
