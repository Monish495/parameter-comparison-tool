import React, { useState,useEffect } from 'react';
import axios from "axios";
import {
    Box, Card, CardContent, Typography, Grid, TextField, Button, MenuItem,
    Chip, Divider, Fade, IconButton, Tooltip, InputAdornment, useTheme,
} from '@mui/material';
import DnsIcon from '@mui/icons-material/Dns';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import LabelIcon from '@mui/icons-material/Label';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LanguageIcon from '@mui/icons-material/Language';
import NumbersIcon from '@mui/icons-material/Numbers';
import TableChartIcon from '@mui/icons-material/TableChart';
import DescriptionIcon from '@mui/icons-material/Description';
import Snackbar from '@mui/material/Snackbar';

const INITIAL_ENVS = [
    { id: 'ENV-001', name: 'Production', type: 'Source', dbType: 'PostgreSQL', status: 'Active', username: 'db_admin', ipAddress: '10.0.1.100', port: '5432', dbName: 'prod_main', description: 'Primary production database' },
    { id: 'ENV-002', name: 'Staging', type: 'Target', dbType: 'PostgreSQL', status: 'Active', username: 'db_staging', ipAddress: '10.0.2.50', port: '5432', dbName: 'staging_db', description: 'Staging environment for testing' },
    { id: 'ENV-003', name: 'EU Cluster', type: 'Source', dbType: 'MySQL', status: 'Active', username: 'eu_reader', ipAddress: '10.0.3.200', port: '3306', dbName: 'eu_data', description: 'EU region cluster' },
    { id: 'ENV-004', name: 'US Cluster', type: 'Target', dbType: 'MySQL', status: 'Inactive', username: 'us_admin', ipAddress: '10.0.4.150', port: '3306', dbName: 'us_data', description: 'US region cluster — maintenance' }
];

const BASE_URL = "http://localhost:8080/environments";

const EMPTY_FORM = {
    name: '',
    type: 'Source',
    databaseType: 'PostgreSQL',  
    status: 'Active',
    username: '',
    password: '',
    ipAddress: '',
    port: '',
    databaseName: '',             
    description: ''
};

const Environment = () => {
    const theme = useTheme();
    const c = theme.palette.custom;
    const [envs, setEnvs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [touched, setTouched] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    const handleBlur = (e) => setTouched((p) => ({ ...p, [e.target.name]: true }));

    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.username.trim()) errors.username = 'Username is required';
    if (!form.password.trim()) errors.password = 'Password is required';
    if (!form.ipAddress.trim()) errors.ipAddress = 'IP address is required';
    if (!form.port.trim()) errors.port = 'Port is required';
    if (!form.databaseName.trim()) errors.databaseName = 'Database name is required';

    const isValid = Object.keys(errors).length === 0;

    const handleAdd = async () => {
  console.log("BUTTON CLICKED", form); // debug

  try {
    const response = await axios.post(
      "http://localhost:8080/environments",
      form   // ✅ FIXED
    );

    console.log("SUCCESS:", response.data);

    // ✅ Refresh UI properly
    await fetchEnvs();

    // ✅ Reset form
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(false);

  } catch (error) {
    console.error("Create failed:", error);
  }
};

const handleUpdate = async () => {
  try {
    await axios.put(`${BASE_URL}/${editingId}`, form);

    await fetchEnvs();

    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(false);

  } catch (error) {
    console.error("Update failed:", error);
  }
};

    const handleDelete = async (id) => {
    if (!window.confirm("Delete this environment?")) return;

    await axios.delete(`${BASE_URL}/${id}`);
    fetchEnvs();
    };

    const handleEdit = (env) => {
    setForm({
    name: env.name || '',
    type: env.type || '',
    databaseType: env.databaseType || '',
    status: env.status || '',
    username: env.username || '',
    password: env.password || '',
    ipAddress: env.ipAddress || '',
    port: env.port || '',
    databaseName: env.databaseName || '',
    description: env.description || ''
    });

 setEditingId(env.id);
  setShowForm(true);
};

    const handleCancel = () => {
        setShowForm(false);
        setForm({ ...EMPTY_FORM });
        setTouched({});
        setEditingId(null);
    };

    useEffect(() => {
    fetchEnvs();
    }, []);

const fetchEnvs = async () => {
    const res = await axios.get(BASE_URL);
    console.log("API DATA:", res.data);
    setEnvs(res.data);
};

const handleTestConnection = async () => {
    try {
        const res = await axios.post(
            "http://localhost:8080/environments/test-connection",
            form
        );

        if (res.data === "SUCCESS") {
            setSnackbarMsg("✅ Connection Successful");
        } else {
            setSnackbarMsg("❌ " + res.data);
        }

        setSnackbarOpen(true);

    } catch (err) {
        setSnackbarMsg("❌ Connection Failed");
        setSnackbarOpen(true);
    }
};

    const iconSx = { color: 'text.secondary', opacity: 0.5, fontSize: 20 };

    return (
        <>
        <Box sx={{ pt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, background: c.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Environments
                </Typography>
                <Button variant="contained" startIcon={showForm ? null : <AddIcon />} onClick={showForm ? handleCancel : () => setShowForm(true)}
                    sx={{ borderRadius: 3, px: 3, fontWeight: 600 }}
                >
                    {showForm ? 'Cancel' : 'Add Environment'}
                </Button>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, color: c.subtleText }}>
                Manage database connections and environment configurations.
            </Typography>

            {/* ──── Add Environment Form ──── */}
            {showForm && (
                <Fade in timeout={250}>
                    <Card sx={{
                        borderRadius: 5, mb: 3, position: 'relative', overflow: 'visible',
                        '&::before': {
                            content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                            background: 'linear-gradient(90deg, transparent, #6366F1, #8B5CF6, #22D3EE, transparent)',
                            borderRadius: '20px 20px 0 0'
                        }
                    }}>
                        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>

                            {/* Section: Environment Info */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box sx={{
                                    width: 42, height: 42, borderRadius: 3, mr: 1.5,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: c.iconGradient1, color: c.iconColor1,
                                    boxShadow: '0 4px 12px rgba(99,102,241,0.15)'
                                }}>
                                    <DnsIcon />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Environment Info</Typography>
                                    <Typography variant="caption" sx={{ color: c.subtleText }}>Define the environment identity and type.</Typography>
                                </Box>
                            </Box>

                            <Grid container spacing={2.5}>
                                {/* <Grid item xs={12} sm={6} md={3}>
                                    <TextField label="Environment ID" name="envId" fullWidth required
                                        value={form.envId} onChange={handleChange} onBlur={handleBlur}
                                        error={touched.envId && !!errors.envId} helperText={touched.envId && errors.envId}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><FingerprintIcon sx={iconSx} /></InputAdornment> }}
                                    />
                                </Grid> */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField label="Name" name="name" fullWidth required
                                        value={form.name || ''} onChange={handleChange} onBlur={handleBlur}
                                        error={touched.name && !!errors.name} helperText={touched.name && errors.name}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><LabelIcon sx={iconSx} /></InputAdornment> }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField label="Type" name="type" fullWidth select
                                        value={form.type || ''} onChange={handleChange}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><SwapHorizIcon sx={iconSx} /></InputAdornment> }}
                                    >
                                        <MenuItem value="Source">Source</MenuItem>
                                        <MenuItem value="Target">Target</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField label="Database Type" name="databaseType" fullWidth select
                                        value={form.databaseType || ''} onChange={handleChange}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><StorageIcon sx={iconSx} /></InputAdornment> }}
                                    >
                                        <MenuItem value="PostgreSQL">PostgreSQL</MenuItem>
                                        <MenuItem value="MySQL">MySQL</MenuItem>
                                        <MenuItem value="SQL Server">SQL Server</MenuItem>
                                        <MenuItem value="Oracle">Oracle</MenuItem>
                                        <MenuItem value="MongoDB">MongoDB</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField label="Status" name="status" fullWidth select
                                        value={form.status} onChange={handleChange}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><CheckCircleIcon sx={iconSx} /></InputAdornment> }}
                                    >
                                        <MenuItem value="Active">Active</MenuItem>
                                        <MenuItem value="Inactive">Inactive</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>

                            {/* Section: Connection Details */}
                            <Divider sx={{ my: 3.5 }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box sx={{
                                    width: 42, height: 42, borderRadius: 3, mr: 1.5,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: c.iconGradient2, color: c.iconColor2,
                                    boxShadow: '0 4px 12px rgba(139,92,246,0.15)'
                                }}>
                                    <LanguageIcon />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Connection Details</Typography>
                                    <Typography variant="caption" sx={{ color: c.subtleText }}>Database credentials and network configuration.</Typography>
                                </Box>
                            </Box>

                            <Grid container spacing={2.5}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField label="Username" name="username" fullWidth required
                                        value={form.username} onChange={handleChange} onBlur={handleBlur}
                                        error={touched.username && !!errors.username} helperText={touched.username && errors.username}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={iconSx} /></InputAdornment> }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField label="Password" name="password" type="password" fullWidth required
                                        value={form.password} onChange={handleChange} onBlur={handleBlur}
                                        error={touched.password && !!errors.password} helperText={touched.password && errors.password}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={iconSx} /></InputAdornment> }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField label="IP Address" name="ipAddress" fullWidth required
                                        value={form.ipAddress} onChange={handleChange} onBlur={handleBlur}
                                        error={touched.ipAddress && !!errors.ipAddress} helperText={touched.ipAddress && errors.ipAddress}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><LanguageIcon sx={iconSx} /></InputAdornment> }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField label="Port" name="port" fullWidth required
                                        value={form.port} onChange={handleChange} onBlur={handleBlur}
                                        error={touched.port && !!errors.port} helperText={touched.port && errors.port}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><NumbersIcon sx={iconSx} /></InputAdornment> }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField label="Database Name" name="databaseName" fullWidth required
                                        value={form.databaseName || ''} onChange={handleChange} onBlur={handleBlur}
                                        error={touched.databaseName && !!errors.databaseName} helperText={touched.databaseName && errors.databaseName}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><TableChartIcon sx={iconSx} /></InputAdornment> }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Description" name="description" fullWidth multiline rows={3}
                                        value={form.description} onChange={handleChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                                    <DescriptionIcon sx={iconSx} />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button variant="outlined"
                                    sx={{
                                        borderRadius: 3, px: 3, borderColor: theme.palette.divider, color: 'text.secondary',
                                        '&:hover': { borderColor: 'rgba(99,102,241,0.3)', backgroundColor: c.rowHover }
                                    }}
                                    onClick={handleCancel}
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant="outlined" onClick={handleTestConnection}
                                    sx={{ mr: 2 }}
                                >
                                    Test Connection
                                </Button>
                                <Button variant="contained" onClick={editingId ? handleUpdate : handleAdd} disabled={!isValid}
                                    sx={{ borderRadius: 3, px: 4, fontWeight: 600 }}
                                >
                                    {editingId ? 'Update Environment' : 'Connect Environment'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Fade>
            )}

            {/* ──── Environment Cards ──── */}
            <Grid container spacing={2}>
                {envs.map((env) => (
                    <Grid item xs={12} sm={6} md={3} key={env.id}>
                        <Fade in timeout={300}>
                            <Card sx={{ borderRadius: 5, height: '100%' }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{
                                                width: 38, height: 38, borderRadius: 2.5,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: c.iconGradient1, color: c.iconColor1
                                            }}>
                                                <DnsIcon fontSize="small" />
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{env.name}</Typography>
                                                <Typography variant="caption" sx={{ color: c.subtleText }}>{env.id}</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 0.3 }}>
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => handleEdit(env)} sx={{ color: 'text.secondary', '&:hover': { color: theme.palette.primary.main } }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Remove">
                                                <IconButton size="small" onClick={() => handleDelete(env.id)}
                                                    sx={{ color: 'text.secondary', '&:hover': { color: theme.palette.error.main } }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ mb: 1.5 }} />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                                        {[
                                            { label: 'Type', value: env.type },
                                            { label: 'DB Type', value: env.databaseType },
                                            { label: 'IP Address', value: env.ipAddress },
                                            { label: 'Port', value: env.port },
                                            { label: 'Database', value: env.databaseName },
                                            { label: 'User', value: env.username }
                                        ].map((row) => (
                                            <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="caption" sx={{ color: c.subtleText }}>{row.label}</Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 500 }}>{row.value}</Typography>
                                            </Box>
                                        ))}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="caption" sx={{ color: c.subtleText }}>Status</Typography>
                                            <Chip
                                                icon={<FiberManualRecordIcon sx={{ fontSize: '8px !important' }} />}
                                                label={env.status}
                                                size="small"
                                                color={env.status === 'Active' ? 'success' : 'error'}
                                                variant="outlined"
                                                sx={{ fontWeight: 600, fontSize: 11 }}
                                            />
                                        </Box>
                                    </Box>
                                    {env.description && (
                                        <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: c.subtleText, fontStyle: 'italic' }}>
                                            {env.description}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>
                ))}
            </Grid>
        </Box>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMsg}
        />    
    </>
);
};

export default Environment;