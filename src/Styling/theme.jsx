import { createTheme, responsiveFontSizes, Box, Button, Typography, Container, Paper } from "@mui/material";
import { styled } from '@mui/material/styles';

let theme = createTheme({
    palette: {
        primary: {
            main: 'rgb(62, 211, 222)',
            light: 'rgb(93, 237, 245)',
            dark: 'rgb(6, 182, 212)',
            contrastText: '#ffffff',
        },
        secondary: {
            main: 'rgb(29, 58, 138)',
            light: 'rgb(101, 138, 219)',
            dark: 'rgb(20, 40, 100)',
            contrastText: '#ffffff',
        },
        error: {
            main: 'rgb(210, 62, 51)',
        },
        warning: {
            main: 'rgb(195, 106, 22)',
        },
        info: {
            main: 'rgb(101, 138, 219)',
        },
        success: {
            main: 'rgb(21, 156, 21)',
        },
        customNavColor: {
            main: 'rgba(29, 58, 138, 0.83)',
        },
        background: {
            default: '#f5f4ed',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Montserrat", sans-serif',
        h1: { fontWeight: 700, fontSize: '2.5rem' },
        h2: { fontWeight: 700, fontSize: '2rem' },
        h3: { fontWeight: 600, fontSize: '1.75rem' },
        h4: { fontWeight: 600, fontSize: '1.5rem' },
        h5: { fontWeight: 600, fontSize: '1.25rem' },
        h6: { fontWeight: 600, fontSize: '1rem' },
        body1: { fontSize: '1rem', lineHeight: 1.6 },
        body2: { fontSize: '0.875rem', lineHeight: 1.5 },
        caption: { fontSize: '0.75rem' },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0 2px 4px rgba(0,0,0,0.05)',
        '0 2px 8px rgba(0,0,0,0.08)',
        '0 4px 16px rgba(0,0,0,0.1)',
        '0 8px 32px rgba(0,0,0,0.1)',
        '0 12px 40px rgba(0,0,0,0.12)',
        '0 20px 60px rgba(0,0,0,0.1)',
        ...Array(18).fill('0 20px 60px rgba(0,0,0,0.1)'),
    ],
});

theme = responsiveFontSizes(theme);

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    borderRadius: theme.shape.borderRadius,
    textTransform: 'none',
    fontWeight: 600,
    padding: '8px 24px',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 20px rgba(62, 211, 222, 0.3)',
    },
}));

const StyledTypography = styled(Typography)(() => ({
    color: 'rgb(62, 211, 222)',
    fontStyle: 'italic',
    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
    fontWeight: 'bold',
}));

const StyledSubTypography = styled(Typography)(() => ({
    color: 'rgb(29, 58, 138)',
    fontStyle: 'italic',
    fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
    fontWeight: 'inherit',
}));

const StyledContainer = styled(Container)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(2),
    boxShadow: theme.shadows[3],
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: '#ebe7dd',
    border: `2px groove ${theme.palette.divider}`,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(3),
}));

const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(3),
    boxSizing: 'border-box',
}));

export { StyledBox, theme, StyledButton, StyledTypography, StyledContainer, StyledPaper, StyledSubTypography };
