import { createTheme, alpha } from '@mui/material/styles';

export const getDesignTokens = (mode = 'light') => {
  const isLight = mode === 'light';

  const primaryMain = '#6366F1';
  const secondaryMain = '#8B5CF6';

  return {
    palette: {
      mode,
      primary: {
        main: primaryMain,
        light: '#818CF8',
        dark: '#4F46E5',
        contrastText: '#FFFFFF'
      },
      secondary: {
        main: secondaryMain,
        light: '#A78BFA',
        dark: '#7C3AED',
        contrastText: '#FFFFFF'
      },
      success: { main: isLight ? '#059669' : '#34D399', light: '#6EE7B7', dark: '#059669' },
      warning: { main: isLight ? '#D97706' : '#FBBF24', light: '#FCD34D', dark: '#D97706' },
      error: { main: isLight ? '#DC2626' : '#F87171', light: '#FCA5A5', dark: '#DC2626' },
      info: { main: '#22D3EE' },
      background: {
        default: isLight ? '#F5F7FB' : '#0A0A16',
        paper: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(17,17,34,0.72)'
      },
      text: {
        primary: isLight ? '#1E293B' : '#F1F5F9',
        secondary: isLight ? '#64748B' : 'rgba(148,163,184,0.85)'
      },
      divider: isLight ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.12)',
      custom: {
        cardBg: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(17,17,34,0.55)',
        cardBorder: isLight ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.10)',
        cardHoverBorder: isLight ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.25)',
        cardShadow: isLight
          ? '0 8px 32px rgba(99,102,241,0.08), 0 1px 3px rgba(0,0,0,0.06)'
          : '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
        cardHoverShadow: isLight
          ? '0 16px 48px rgba(99,102,241,0.12), 0 2px 6px rgba(0,0,0,0.06)'
          : '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        inputBg: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(15,15,30,0.5)',
        sidebarBg: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(10,10,22,0.92)',
        sidebarText: isLight ? '#475569' : 'rgba(148,163,184,0.7)',
        sidebarActive: isLight ? '#1E293B' : '#F9FAFB',
        sidebarActiveBg: isLight ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.15)',
        navBg: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(15,15,26,0.75)',
        gradientText: isLight
          ? 'linear-gradient(135deg, #1E293B, #475569)'
          : 'linear-gradient(135deg, #F1F5F9, #94A3B8)',
        subtleText: isLight ? '#94A3B8' : 'rgba(148,163,184,0.6)',
        rowHover: isLight ? 'rgba(99,102,241,0.04)' : 'rgba(99,102,241,0.08)',
        rowBg: isLight ? 'rgba(99,102,241,0.02)' : 'rgba(99,102,241,0.04)',
        rowBorder: isLight ? 'rgba(99,102,241,0.05)' : 'rgba(99,102,241,0.06)',
        codeBg: isLight ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.1)',
        codeColor: isLight ? '#4F46E5' : '#818CF8',
        iconGradient1: isLight
          ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.12))'
          : 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))',
        iconGradient2: isLight
          ? 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(244,114,182,0.12))'
          : 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(244,114,182,0.2))',
        iconColor1: isLight ? '#4F46E5' : '#818CF8',
        iconColor2: isLight ? '#7C3AED' : '#A78BFA',
        trendPositiveBg: isLight ? 'rgba(5,150,105,0.08)' : 'rgba(52,211,153,0.1)',
        trendPositiveBorder: isLight ? 'rgba(5,150,105,0.15)' : 'rgba(52,211,153,0.2)',
        trendNegativeBg: isLight ? 'rgba(220,38,38,0.06)' : 'rgba(248,113,113,0.1)',
        trendNegativeBorder: isLight ? 'rgba(220,38,38,0.12)' : 'rgba(248,113,113,0.2)',
        chipSuccess: isLight ? 'rgba(5,150,105,0.1)' : 'rgba(52,211,153,0.12)',
        chipWarning: isLight ? 'rgba(217,119,6,0.1)' : 'rgba(251,191,36,0.12)',
        chipError: isLight ? 'rgba(220,38,38,0.08)' : 'rgba(248,113,113,0.12)'
      }
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.03em' },
      h5: { fontWeight: 700, letterSpacing: '-0.02em' },
      h6: { fontWeight: 600, letterSpacing: '-0.01em' },
      subtitle1: { fontWeight: 600 },
      body1: { fontSize: 14.5, lineHeight: 1.6 },
      body2: { fontSize: 13.5, lineHeight: 1.5 },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
      caption: { fontSize: 11.5, letterSpacing: '0.02em' }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isLight ? '#F5F7FB' : '#0A0A16',
            backgroundImage: isLight
              ? 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.06), transparent), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(139,92,246,0.04), transparent)'
              : 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.15), transparent), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(139,92,246,0.08), transparent)',
            backgroundAttachment: 'fixed'
          }
        }
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 18,
            backgroundImage: 'none',
            backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(17,17,34,0.55)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            border: isLight ? '1px solid rgba(99,102,241,0.08)' : '1px solid rgba(99,102,241,0.10)',
            boxShadow: isLight
              ? '0 8px 32px rgba(99,102,241,0.06), 0 1px 3px rgba(0,0,0,0.04)'
              : '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
            transition: 'box-shadow 250ms ease, transform 250ms ease, border-color 250ms ease'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(17,17,34,0.55)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            border: isLight ? '1px solid rgba(99,102,241,0.08)' : '1px solid rgba(99,102,241,0.10)',
            boxShadow: isLight
              ? '0 8px 32px rgba(99,102,241,0.06), 0 1px 3px rgba(0,0,0,0.04)'
              : '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
            transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
            '&:hover': {
              borderColor: isLight ? 'rgba(99,102,241,0.18)' : 'rgba(99,102,241,0.25)',
              boxShadow: isLight
                ? '0 16px 48px rgba(99,102,241,0.1), 0 2px 6px rgba(0,0,0,0.05)'
                : '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
              transform: 'translateY(-2px)'
            }
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(15,15,26,0.75)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            boxShadow: isLight
              ? '0 1px 0 rgba(99,102,241,0.06), 0 4px 16px rgba(0,0,0,0.04)'
              : '0 1px 0 rgba(99,102,241,0.08), 0 8px 24px rgba(0,0,0,0.25)',
            borderBottom: isLight ? '1px solid rgba(99,102,241,0.06)' : '1px solid rgba(99,102,241,0.08)',
            color: isLight ? '#1E293B' : '#F1F5F9'
          }
        }
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 12,
            paddingInline: 22,
            paddingBlock: 10,
            fontSize: 14,
            fontWeight: 600,
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: `0 8px 25px ${alpha(primaryMain, 0.3)}`
            }
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${primaryMain} 0%, ${secondaryMain} 100%)`,
            boxShadow: `0 4px 15px ${alpha(primaryMain, 0.3)}`,
            '&:hover': {
              background: `linear-gradient(135deg, ${alpha(primaryMain, 0.9)} 0%, ${alpha(secondaryMain, 0.9)} 100%)`,
              boxShadow: `0 8px 30px ${alpha(primaryMain, 0.4)}`
            }
          }
        }
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(15,15,30,0.5)',
              backdropFilter: 'blur(8px)',
              color: isLight ? '#1E293B' : '#F1F5F9',
              transition: 'all 200ms ease',
              '& fieldset': {
                borderColor: isLight ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.15)',
                transition: 'border-color 200ms ease, box-shadow 200ms ease'
              },
              '&:hover fieldset': {
                borderColor: isLight ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.35)'
              },
              '&.Mui-focused fieldset': {
                borderColor: primaryMain,
                boxShadow: `0 0 0 3px ${alpha(primaryMain, 0.12)}, 0 0 20px ${alpha(primaryMain, 0.08)}`
              }
            },
            '& .MuiInputLabel-root': {
              color: isLight ? '#94A3B8' : 'rgba(148,163,184,0.7)',
              '&.Mui-focused': { color: primaryMain }
            },
            '& .MuiInputBase-input': { color: isLight ? '#1E293B' : '#F1F5F9' }
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: 8 }
        }
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            paddingInline: 14,
            transition: 'all 200ms ease',
            '&:hover': { backgroundColor: isLight ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.08)' }
          }
        }
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: isLight ? '1px solid rgba(99,102,241,0.06)' : '1px solid rgba(99,102,241,0.08)',
            backgroundColor: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(10,10,22,0.92)',
            backdropFilter: 'blur(24px) saturate(150%)',
            WebkitBackdropFilter: 'blur(24px) saturate(150%)',
            backgroundImage: isLight
              ? 'radial-gradient(ellipse at 0% 0%, rgba(99,102,241,0.05), transparent 60%), radial-gradient(ellipse at 100% 100%, rgba(139,92,246,0.03), transparent 60%)'
              : 'radial-gradient(ellipse at 0% 0%, rgba(99,102,241,0.12), transparent 60%), radial-gradient(ellipse at 100% 100%, rgba(139,92,246,0.08), transparent 60%)'
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: isLight ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.1)' }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottomColor: isLight ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.08)',
            color: isLight ? '#1E293B' : '#F1F5F9'
          },
          head: {
            fontWeight: 600,
            color: isLight ? '#64748B' : 'rgba(148,163,184,0.9)',
            textTransform: 'uppercase',
            fontSize: 11,
            letterSpacing: '0.06em'
          }
        }
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 12 }
        }
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(17,17,34,0.92)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            border: isLight ? '1px solid rgba(99,102,241,0.08)' : '1px solid rgba(99,102,241,0.12)'
          }
        }
      }
    }
  };
};

export const getAppTheme = (mode = 'light') => createTheme(getDesignTokens(mode));
