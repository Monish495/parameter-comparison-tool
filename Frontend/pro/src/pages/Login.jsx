import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Alert,
  CircularProgress,
  Fade,
  Snackbar
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../App.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ username: '', password: '' });
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required';
    if (!form.password.trim()) errs.password = 'Password is required';
    return errs;
  };
  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    setError('');
    if (!isValid) return;
    setSubmitting(true);
    try {
      const user = await login(form.username, form.password);
      
      if (user) {
        navigate(from, { replace: true }); // 🔥 navigate immediately
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: theme.palette.background.default,
        px: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: theme.palette.mode === 'light'
            ? 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)'
            : 'radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)',
          top: '-150px',
          left: '-100px',
          animation: 'float 8s ease-in-out infinite',
          pointerEvents: 'none'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: theme.palette.mode === 'light'
            ? 'radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)'
            : 'radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)',
          bottom: '-100px',
          right: '-80px',
          animation: 'float 10s ease-in-out infinite reverse',
          pointerEvents: 'none'
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(30px, -30px)' }
        }
      })}
    >
      <Fade in timeout={600}>
        <Card
          sx={(theme) => ({
            maxWidth: 440,
            width: '100%',
            borderRadius: 5,
            position: 'relative',
            zIndex: 1,
            overflow: 'visible',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #6366F1, #8B5CF6, #22D3EE, transparent)',
              borderRadius: '20px 20px 0 0'
            }
          })}
        >
          <CardContent sx={{ p: 4.5 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 200, height: 64, borderRadius: 10, mx: 'auto', mb: 2,
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #22D3EE)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em',
                  boxShadow: '0 8px 30px rgba(99,102,241,0.35)',
                  position: 'relative',
                  '&::after': {
                    content: '""', position: 'absolute', inset: '-3px', borderRadius: 5,
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #22D3EE)',
                    opacity: 0.3, filter: 'blur(12px)', zIndex: -1
                  }
                }}
              >
                ParamCompare
              </Box>
              <Typography
                variant="h5"
                sx={(theme) => ({
                  fontWeight: 700, mb: 0.5,
                  background: theme.palette.custom.gradientText,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                })}
              >
                Welcome to ParamCompare
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Sign in to compare and analyze your databases.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" noValidate onSubmit={handleSubmit}>
              <TextField
                margin="normal" required fullWidth id="username" label="Username" name="username"
                autoComplete="username" autoFocus value={form.username}
                onChange={handleChange} onBlur={handleBlur}
                error={touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon fontSize="small" sx={{ color: 'text.secondary', opacity: 0.6 }} />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                margin="normal" required fullWidth name="password" label="Password" type="password"
                id="password" autoComplete="current-password" value={form.password}
                onChange={handleChange} onBlur={handleBlur}
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" sx={{ color: 'text.secondary', opacity: 0.6 }} />
                    </InputAdornment>
                  )
                }}
              />
              <Button type="submit" fullWidth variant="contained" disabled={submitting}
                sx={{ mt: 3.5, mb: 1.5, py: 1.4, borderRadius: 3, fontSize: 15, fontWeight: 600 }}
              >
                {submitting ? <CircularProgress size={22} color="inherit" /> : 'Sign in'}
              </Button>
              {/* <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary', mt: 0.5 }}>
                Try <strong style={{ color: '#6366F1' }}>admin/admin123</strong> or{' '}
                <strong style={{ color: '#8B5CF6' }}>user/user123</strong>
              </Typography> */}
            </Box>
          </CardContent>
        </Card>
      </Fade>

      <Snackbar open={snackbarOpen} autoHideDuration={2200}
        onClose={() => setSnackbarOpen(false)} message="Welcome back to DB Insight"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Login;
