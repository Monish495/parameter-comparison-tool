import React, { useState } from 'react';
import { useEffect } from "react";
import {
    Box, Card, CardContent, Typography, Grid, TextField, Button,
    Chip, Divider, Fade, IconButton, Tooltip, InputAdornment, Snackbar, useTheme,
    Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import BadgeIcon from '@mui/icons-material/Badge';
import DescriptionIcon from '@mui/icons-material/Description';

import axios from "axios";

const BASE_URL = "http://localhost:8080/roles";



const EMPTY_FORM = { name: '', description: '' };

const Roles = () => {
    const theme = useTheme();
    const c = theme.palette.custom;
    const [roles, setRoles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [touched, setTouched] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "name" ? value.toUpperCase() : value
        }));
    };
    const handleBlur = (e) => setTouched((p) => ({ ...p, [e.target.name]: true }));

    const errors = {};
    if (!form.name.trim()) errors.name = 'Role Name is required';

    const isValid = form.name.trim() !== "";

    const handleAdd = async () => {
    try {
        const payload = {
            roleName: form.name,
            roleDescription: form.description
        };

        if (editingId) {
            await axios.put(`${BASE_URL}/${editingId}`, payload);
            setSnackbarMsg("Role updated successfully");
        } else {
            await axios.post(BASE_URL, payload);
            setSnackbarMsg("Role created successfully");
        }

        await fetchRoles();

        setForm(EMPTY_FORM);
        setShowForm(false);
        setEditingId(null);
        setSnackbarOpen(true);
        setTouched({});

    } 
    catch (err) {
    console.error(err);
    setSnackbarMsg("Something went wrong");
    setSnackbarOpen(true);
    }
    };

    const handleDelete = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
    fetchRoles();
    setSnackbarMsg("Role deleted successfully");
    setSnackbarOpen(true);
    };

    const handleEdit = (role) => {
    setForm({
        //roleId: role.roleId,
        name: role.roleName,
        description: role.roleDescription
    });

    setEditingId(role.roleId);
    setShowForm(true);
};

    const handleCancel = () => {
        setShowForm(false);
        setForm({ ...EMPTY_FORM });
        setTouched({});
        setEditingId(null);
    };

        useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        const res = await axios.get(BASE_URL);
        setRoles(res.data);
    };

    const iconSx = { color: 'text.secondary', opacity: 0.5, fontSize: 20 };

    return (
        <Box sx={{ pt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, background: c.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Roles
                </Typography>
                <Button variant="contained" startIcon={showForm ? null : <AddIcon />} onClick={showForm ? handleCancel : () => setShowForm(true)}
                    sx={{ borderRadius: 3, px: 3, fontWeight: 600 }}
                >
                    {showForm ? 'Cancel' : 'Add Role'}
                </Button>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, color: c.subtleText }}>
                Manage system roles, permissions, and descriptions.
            </Typography>

            {/* ──── Add / Edit Role Form ──── */}
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
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box sx={{
                                    width: 42, height: 42, borderRadius: 3, mr: 1.5,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: c.iconGradient1, color: c.iconColor1,
                                    boxShadow: '0 4px 12px rgba(99,102,241,0.15)'
                                }}>
                                    <AdminPanelSettingsIcon />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{editingId ? 'Edit Role' : 'Role Details'}</Typography>
                                    <Typography variant="caption" sx={{ color: c.subtleText }}>
                                        {editingId ? 'Update role properties.' : 'Define a new system role.'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Grid container spacing={2.5}>
                                {/* <Grid item xs={12} sm={6}>
                                    <TextField label="Role ID" name="roleId" fullWidth required
                                        value={form.roleId} onChange={handleChange} onBlur={handleBlur}
                                        error={touched.roleId && !!errors.roleId} helperText={touched.roleId && errors.roleId}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><FingerprintIcon sx={iconSx} /></InputAdornment> }}
                                    />
                                </Grid> */}
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Role Name" name="name" fullWidth required
                                        value={form.name} onChange={handleChange} onBlur={handleBlur}
                                        error={touched.name && !!errors.name} helperText={touched.name && errors.name}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><BadgeIcon sx={iconSx} /></InputAdornment> }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Role Description" name="description" fullWidth multiline rows={3}
                                        value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
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
                                <Button variant="contained" onClick={handleAdd} disabled={!isValid}
                                    sx={{ borderRadius: 3, px: 4, fontWeight: 600 }}
                                >
                                    {editingId ? 'Update Role' : 'Create Role'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Fade>
            )}

            {/* ──── Roles Table ──── */}
            <Fade in timeout={300}>
                <Card sx={{ borderRadius: 5 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                            <Box sx={{
                                width: 42, height: 42, borderRadius: 3, mr: 1.5,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: c.iconGradient1, color: c.iconColor1,
                                boxShadow: '0 4px 12px rgba(99,102,241,0.15)'
                            }}>
                                <AdminPanelSettingsIcon />
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Roles List</Typography>
                        </Box>

                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Role ID</TableCell>
                                    <TableCell>Role Name</TableCell>
                                    <TableCell>Role Description</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roles.map((role) => (
                                    <TableRow key={role.roleId}>
                                        <TableCell>{role.roleId}</TableCell>

                                        <TableCell>
                                        <Chip label={role.roleName} size="small" />
                                        </TableCell>

                                        <TableCell>{role.roleDescription}</TableCell>

                                        <TableCell align="right">
                                        <IconButton onClick={() => handleEdit(role)}>
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton onClick={() => handleDelete(role.roleId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Fade>

            <Snackbar open={snackbarOpen} autoHideDuration={2200} onClose={() => setSnackbarOpen(false)}
                message={snackbarMsg} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
        </Box>
    );
};

export default Roles;

