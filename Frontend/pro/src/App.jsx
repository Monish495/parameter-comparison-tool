import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback
} from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Toolbar } from '@mui/material';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Compare from './pages/Compare.jsx';
import Reports from './pages/Reports.jsx';
import AddUser from './pages/User.jsx';
import Roles from './pages/Roles.jsx';
import Environment from './pages/Environment.jsx';

import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import { getAppTheme } from './theme/theme.js';
import * as authService from './services/authService.js';
import { Outlet } from "react-router-dom";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
const user = JSON.parse(localStorage.getItem("user"));


// =======================
// 🔹 APP LAYOUT (UI SAME)
// =======================
const AppLayout = () => {
  const { user, logout, mode, toggleMode } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 900) {
      setMobileOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  const sidebarWidth = sidebarCollapsed ? 68 : 220;

  return (
    <Box sx={{ display: 'block', minHeight: '100vh' }}>

      <Navbar
        user={user}
        onLogout={logout}
        mode={mode}
        toggleColorMode={toggleMode}
        onToggleSidebar={handleToggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
      />

      <Sidebar
        role={user?.role}
        onLogout={logout}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Box component="main" sx={{ ml: { xs: 0, md: `${sidebarWidth}px` } }}>
        <Toolbar />

        <Box sx={{ px: 2, py: 2 }}>
          <Outlet /> {/* 🔥 renders page */}
        </Box>

      </Box>
    </Box>
  );
};


// =======================
// 🔹 AUTH PROVIDER
// =======================
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
});
  const [mode, setMode] = useState('light');

  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    console.log("SETTING USER:", parsedUser);
    setUser(parsedUser);
  }
}, []);

  const login = async (username, password) => {
    const loggedIn = await authService.login(username, password);
    setUser(loggedIn);
    return loggedIn;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const toggleMode = useCallback(() => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <AuthContext.Provider value={{ user, login, logout, mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AuthContext.Provider>
  );
};


// =======================
// 🔹 MAIN APP ROUTING
// =======================
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          {/* PROTECTED UI */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >

            {/* 👤 USER + ADMIN */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/reports" element={<Reports />} />

            {/* 👨‍💼 ADMIN ONLY */}
            <Route
              path="/users/add"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AddUser />
                </ProtectedRoute>
              }
            />

            <Route
              path="/roles"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Roles />
                </ProtectedRoute>
              }
            />

            <Route
              path="/environment"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Environment />
                </ProtectedRoute>
              }
            />

          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};


// =======================
// 🔹 PUBLIC ROUTE
// =======================
const PublicOnlyRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return children;
};

export default App;