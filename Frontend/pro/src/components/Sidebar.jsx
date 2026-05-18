import React, { useState } from 'react';
import {
  Box, Drawer, Toolbar, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, useTheme, useMediaQuery, SwipeableDrawer
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import DnsIcon from '@mui/icons-material/Dns';
import { NavLink, useLocation } from 'react-router-dom';

const expandedWidth = 220;
const collapsedWidth = 68;

const Sidebar = ({ role, onLogout, collapsed = false, mobileOpen = false, onMobileClose }) => {
  const theme = useTheme();
  const location = useLocation();
  const c = theme.palette.custom;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const items = [
    { label: 'Dashboard', icon: <DashboardIcon />, to: '/' },
    { label: 'Compare Tables', icon: <CompareArrowsIcon />, to: '/compare' },
    { label: 'Reports', icon: <AssessmentIcon />, to: '/reports' },

    
    //{ label: 'Users', icon: <PersonAddIcon />, to: '/users', adminOnly: true },
    { label: 'User', icon: <PersonAddIcon />, to: '/users/add', adminOnly: true },

    { label: 'Roles', icon: <AdminPanelSettingsIcon />, to: '/roles', adminOnly: true },
    { label: 'Environment', icon: <DnsIcon />, to: '/environment', adminOnly: true }
  ];

  const width = collapsed ? collapsedWidth : expandedWidth;

  const drawerContent = (
    <>
      <Toolbar sx={{ px: collapsed && !isMobile ? 1.5 : 2.5, display: 'flex', alignItems: 'center', justifyContent: collapsed && !isMobile ? 'center' : 'flex-start' }}>
        <Box sx={{
          width: collapsed && !isMobile ? 40 : 36, height: collapsed && !isMobile ? 40 : 36, borderRadius: 3, mr: collapsed && !isMobile ? 0 : 1.5,
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #22D3EE)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 15, color: '#fff',
          boxShadow: '0 4px 16px rgba(99,102,241,0.3)', flexShrink: 0
        }}>
          DB
        </Box>
        {(isMobile || !collapsed) && (
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.1, background: c.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DB Insight
            </Typography>
            <Typography variant="caption" sx={{ color: c.subtleText, fontSize: 10 }}>
              {role === 'ADMIN' ? 'Admin Console' : 'Analytics'}
            </Typography>
          </Box>
        )}
      </Toolbar>

      {(isMobile || !collapsed) && (
        <Box sx={{ px: 2, pt: 2, pb: 0.5 }}>
          <Typography variant="overline" sx={{ color: c.subtleText, letterSpacing: 1.5, fontSize: 10, fontWeight: 600 }}>
            NAVIGATION
          </Typography>
        </Box>
      )}

      <List sx={{ px: collapsed && !isMobile ? 0.8 : 1.2, mt: 0.5 }}>
        {items.filter((item) => !item.adminOnly || role?.roleName?.toUpperCase() === 'ADMIN').map((item) => {
          const selected = location.pathname === item.to;
          const isCollapsed = collapsed && !isMobile;
          return (
            <ListItemButton key={item.label} component={NavLink} to={item.to}
              onClick={isMobile ? onMobileClose : undefined}
              sx={{
                mb: 0.4, borderRadius: 3, justifyContent: isCollapsed ? 'center' : 'flex-start',
                px: isCollapsed ? 1.2 : 1.8, py: 1,
                color: selected ? c.sidebarActive : c.sidebarText,
                backgroundColor: selected ? c.sidebarActiveBg : 'transparent',
                position: 'relative', overflow: 'hidden',
                '&::before': selected ? {
                  content: '""', position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                  width: 3, height: 20, borderRadius: 999,
                  background: 'linear-gradient(180deg, #6366F1, #8B5CF6)'
                } : {},
                '&:hover': { backgroundColor: selected ? c.sidebarActiveBg : c.rowHover }
              }}
            >
              <ListItemIcon sx={{
                color: selected ? theme.palette.primary.main : c.sidebarText,
                minWidth: isCollapsed ? 0 : 36, mr: isCollapsed ? 0 : 1
              }}>
                {item.icon}
              </ListItemIcon>
              {(isMobile || !collapsed) && (
                <ListItemText primary={item.label}
                  primaryTypographyProps={{ fontSize: 13.5, fontWeight: selected ? 600 : 500, letterSpacing: '0.01em' }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ px: collapsed && !isMobile ? 0.8 : 2, pb: 2.5 }}>
        <ListItemButton onClick={() => { if (isMobile) onMobileClose?.(); onLogout(); }}
          sx={{
            borderRadius: 3, justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
            color: c.sidebarText,
            '&:hover': { backgroundColor: 'rgba(248,113,113,0.08)', color: '#F87171' }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: collapsed && !isMobile ? 0 : 36, mr: collapsed && !isMobile ? 0 : 1 }}>
            <LogoutIcon />
          </ListItemIcon>
          {(isMobile || !collapsed) && <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 13.5, fontWeight: 500 }} />}
        </ListItemButton>
      </Box>
    </>
  );

  // Mobile: temporary swipeable drawer
  if (isMobile) {
    return (
      <SwipeableDrawer
        open={mobileOpen}
        onClose={onMobileClose}
        onOpen={() => { }}
        sx={{
          '& .MuiDrawer-paper': {
            width: expandedWidth,
            boxSizing: 'border-box',
            borderRight: 'none'
          }
        }}
      >
        {drawerContent}
      </SwipeableDrawer>
    );
  }

  // Desktop: permanent drawer
  return (
    <Drawer
      variant="permanent"
      sx={{
        width, flexShrink: 0,
        '& .MuiDrawer-paper': {
          width, boxSizing: 'border-box', borderRight: 'none',
          color: theme.palette.text.primary,
          transition: (t) => t.transitions.create('width', { easing: t.transitions.easing.easeInOut, duration: t.transitions.duration.standard })
        }
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
