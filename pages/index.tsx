import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import Link from 'next/link';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  pageContainerSx,
  scrollZoneSx,
  headerRowSx,
  pageTitleSx,
  pageSubtitleSx,
  todayPaperSx,
  todayIconWrapperSx,
  todayLabelSx,
  todayValueSx,
  featureGridSx,
  featureCardSx,
  featureCardContentSx,
  featureCardNumberSx,
  featureCardIconWrapperSx,
  featureCardIconSx,
  featureCardTitleSx,
  featureCardDescriptionSx,
  featureCardFooterSx,
  featureBadgeSx,
  featureBadgeOutlinedSx,
  featureCardLinkStyle,
  resumenPaperSx,
  resumenBlobTopSx,
  resumenBlobBottomSx,
  resumenContentSx,
  resumenTextBlockSx,
  resumenTitleSx,
  resumenSubtitleSx,
  resumenButtonSx,
  resumenStatsRowSx,
  resumenStatBoxSx,
  resumenStatLabelSx,
  resumenStatValueSx,
  resumenStatTrendSx,
  resumenStatTrendNegativeSx,
  footerSx,
  footerTextSx,
  footerLinksSx,
  footerLinkStyle,
  calendarIconSx,
  arrowIconSx,
  trendIconSx,
} from '@/styles/index.styles';

function formatDate() {
  const d = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  return d.toLocaleDateString('es-ES', options);
}

export default function Home() {
  const todayFormatted = formatDate();

  const featureCards = [
    {
      number: '01',
      icon: <AccountBalanceIcon sx={featureCardIconSx} />,
      title: 'Gestión Financiera',
      description:
        'Registra ingresos y gastos, controla tus movimientos y mantén el balance al día.',
      badge: 'ACCESO TOTAL',
      badgeVariant: 'contained' as const,
      linkText: 'Ir ahora',
      href: '/movimientos',
    },
    {
      number: '02',
      icon: <PeopleIcon sx={featureCardIconSx} />,
      title: 'Control de Usuarios',
      description:
        'Administra perfiles, roles y permisos de los usuarios del sistema.',
      badge: 'ADMINISTRADOR',
      badgeVariant: 'outlined' as const,
      linkText: 'Gestionar',
      href: '/usuarios',
    },
    {
      number: '03',
      icon: <AssessmentIcon sx={featureCardIconSx} />,
      title: 'Informes Dinámicos',
      description:
        'Visualiza gráficos, saldo actual y descarga reportes en CSV.',
      badge: 'AVANZADO',
      badgeVariant: 'outlined' as const,
      linkText: 'Ver análisis',
      href: '/reportes',
    },
  ];

  return (
    <Box sx={pageContainerSx}>
      <Box sx={scrollZoneSx}>
        <Box sx={headerRowSx}>
          <Box>
            <Typography variant="h4" component="h1" sx={pageTitleSx}>
              Inicio
            </Typography>
            <Typography variant="body1" sx={pageSubtitleSx}>
              Bienvenido al panel principal. Desde aquí puedes gestionar las
              finanzas, usuarios y visualizar informes detallados.
            </Typography>
          </Box>
          <Paper elevation={0} sx={todayPaperSx}>
            <Box sx={todayIconWrapperSx}>
              <CalendarTodayIcon sx={calendarIconSx} />
            </Box>
            <Box>
              <Typography variant="caption" sx={todayLabelSx}>
                Hoy es
              </Typography>
              <Typography variant="subtitle1" sx={todayValueSx}>
                {todayFormatted}
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Grid container spacing={3} sx={featureGridSx}>
          {featureCards.map((card) => (
            <Grid item xs={12} md={4} key={card.number}>
              <Card elevation={0} sx={featureCardSx}>
                <CardContent sx={featureCardContentSx}>
                  <Typography sx={featureCardNumberSx}>
                    {card.number}
                  </Typography>
                  <Box sx={featureCardIconWrapperSx}>
                    {card.icon}
                  </Box>
                  <Typography variant="h6" sx={featureCardTitleSx}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" sx={featureCardDescriptionSx}>
                    {card.description}
                  </Typography>
                  <Box sx={featureCardFooterSx}>
                    <Button
                      size="small"
                      variant={card.badgeVariant}
                      color="primary"
                      sx={card.badgeVariant === 'outlined' ? featureBadgeOutlinedSx : featureBadgeSx}
                    >
                      {card.badge}
                    </Button>
                    <Link href={card.href} style={featureCardLinkStyle}>
                      {card.linkText}
                      <ArrowForwardIcon sx={arrowIconSx} />
                    </Link>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Paper sx={resumenPaperSx}>
        <Box sx={resumenBlobTopSx} />
        <Box sx={resumenBlobBottomSx} />
        <Box sx={resumenContentSx}>
          <Box sx={resumenTextBlockSx}>
            <Typography variant="h5" sx={resumenTitleSx}>
              Resumen del Mes
            </Typography>
            <Typography variant="body2" sx={resumenSubtitleSx}>
              Echa un vistazo rápido al rendimiento financiero de este periodo
              comparado con el anterior.
            </Typography>
            <Button variant="contained" sx={resumenButtonSx}>
              Ver Detalle Mensual
            </Button>
          </Box>
          <Box sx={resumenStatsRowSx}>
            <Box sx={resumenStatBoxSx}>
              <Typography variant="caption" sx={resumenStatLabelSx}>
                Ingresos
              </Typography>
              <Typography variant="h6" sx={resumenStatValueSx}>
                $12.450,00
              </Typography>
              <Typography variant="caption" sx={resumenStatTrendSx}>
                <TrendingUpIcon sx={trendIconSx} />
                +14% vs mes anterior
              </Typography>
            </Box>
            <Box sx={resumenStatBoxSx}>
              <Typography variant="caption" sx={resumenStatLabelSx}>
                Gastos
              </Typography>
              <Typography variant="h6" sx={resumenStatValueSx}>
                $8.210,00
              </Typography>
              <Typography variant="caption" sx={resumenStatTrendNegativeSx}>
                <TrendingDownIcon sx={trendIconSx} />
                -5% vs mes anterior
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box component="footer" sx={footerSx}>
        <Typography variant="body2" sx={footerTextSx}>
          © 2023 Sistema de Gestión. Todos los derechos reservados.
        </Typography>
        <Box sx={footerLinksSx}>
          <Link href="#" style={footerLinkStyle} className="footer-link">
            Ayuda y Soporte
          </Link>
          <Link href="#" style={footerLinkStyle} className="footer-link">
            Términos
          </Link>
          <Link href="#" style={footerLinkStyle} className="footer-link">
            Privacidad
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
