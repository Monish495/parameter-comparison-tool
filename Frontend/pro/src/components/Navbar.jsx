import React, { useState } from 'react';
import {
  AppBar, Toolbar, Box, IconButton, Typography, Menu, MenuItem,
  Avatar, Tooltip, Divider, Switch, FormControlLabel, useTheme
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = ({ user, onLogout, mode, toggleColorMode, onToggleSidebar, sidebarCollapsed }) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const theme = useTheme();
  const c = theme.palette.custom;

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleLogout = () => { handleCloseUserMenu(); onLogout(); };

  const initials = user?.name ? user.name.split(' ').map((p) => p[0]).join('').toUpperCase() : '';

  return (
    <AppBar position="fixed" color="default" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar sx={{ px: 2.5, gap: 1 }}>
        <Box sx={{ display: 'flex' }}>
          <IconButton size="small" color="inherit" onClick={onToggleSidebar}
            sx={{
              borderRadius: 2.5, border: `1px solid ${theme.palette.divider}`,
              backgroundColor: c.rowBg, color: 'text.secondary',
              transition: 'all 200ms ease',
              '&:hover': { backgroundColor: c.rowHover, borderColor: 'rgba(99,102,241,0.3)', color: '#6366F1' }
            }}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <MenuRoundedIcon /> : <MenuOpenRoundedIcon />}
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, minWidth: 0, pl: { xs: 0.5, md: 1 } }}>
          <Typography variant="h6" sx={{ fontWeight: 700, background: c.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Overview
          </Typography>
          <Typography variant="body2" sx={{ color: c.subtleText, fontSize: 12 }}>
            Multi-Database Comparison & Insights
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mr: 0.5 }}>
          <IconButton onClick={toggleColorMode} aria-label="Toggle light/dark mode"
            sx={{ mr: 0.5, color: 'text.secondary', transition: 'all 200ms ease', '&:hover': { color: '#6366F1' } }}
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Account settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{
                width: 38, height: 38, fontSize: 15, fontWeight: 700,
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                border: '2px solid rgba(99,102,241,0.2)'
              }}>
                {initials}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu sx={{ mt: '45px' }} anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}
          >
            <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{user?.name || 'User'}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user?.role?.roleName === 'Admin' ? 'Administrator' : 'Standard User'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem disabled>
              <FormControlLabel control={<Switch size="small" checked={mode === 'dark'} onChange={toggleColorMode} />} label="Dark mode" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ '&:hover': { color: '#F87171' } }}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
