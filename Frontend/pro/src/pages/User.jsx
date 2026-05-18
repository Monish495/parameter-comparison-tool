import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, TextField, Button, MenuItem,
  Chip, Fade, IconButton, InputAdornment, Snackbar, useTheme,
  Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import axios from 'axios';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';



const ROLE_COLORS = {
  Admin: { background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff' },
  //Manager: { background: 'linear-gradient(135deg,#F59E0B,#D97706)', color: '#fff' },
  User: { backgroundColor: 'rgba(99,102,241,0.08)', color: '#6366F1' }
};

const EMPTY_FORM = {
  userId: '',
  username: '',
  password: '',
  fullName: '',
  email: '',
  role: ''
};

const BASE_URL = "http://localhost:8080/api/user";

const AddUser = () => {
  const theme = useTheme();
  const c = theme.palette.custom;

  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  //  FETCH USERS
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

 const fetchUsers = async () => {
  const res = await axios.get(BASE_URL);
  setUsers(res.data);
};

  const fetchRoles = async () => {
  const res = await axios.get("http://localhost:8080/roles");
  setRoles(res.data);
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD / UPDATE
  const handleSubmit = async () => {
  try {

    // const roleMap = {
    //   Admin: 1,
    //   User: 2,
    //   Manager: 2
    // };

    let payload;

    if (editingId) {
      // ✅ UPDATE
      payload = {
        userId: form.userId,
        userName: form.username,
        password: form.password,
        fullName: form.fullName,
        email: form.email,
        role: {
          roleId: form.role
        }
      };

      await axios.put(`${BASE_URL}/${editingId}`, payload);
      setSnackbarMsg("User updated successfully");

    } else {
      // ✅ CREATE (NO userId)
      payload = {
        userName: form.username,
        password: form.password,
        fullName: form.fullName,
        email: form.email,
        role: {
          roleId: form.role
        }
      };

      await axios.post(BASE_URL, payload);
      setSnackbarMsg("User created successfully");
    }

    console.log("Payload sent:", payload);

    await fetchUsers();

    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSnackbarOpen(true);

  } catch (err) {
    console.error("API ERROR:", err.response?.data || err.message);
  }
};

  //  DELETE
  const handleDelete = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
    fetchUsers();
    setSnackbarMsg("User deleted");
    setSnackbarOpen(true);
  };

  //  EDIT
  const handleEdit = (user) => {
    setForm({
      userId: user.userId,
      username: user.userName,
      password: '',
      fullName: user.fullName,
      email: user.email,
      role: user.role?.roleID
    });

    setEditingId(user.userId);
    setShowForm(true);
  };

  return (
    <Box sx={{ pt: 1 }}>

      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Users
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(EMPTY_FORM);
          }}
        >
          Add User
        </Button>
      </Box>

      <Typography sx={{ mb: 3, color: c.subtleText }}>
        Manage user accounts and role assignments.
      </Typography>

    {/* TABLE */}
     {showForm ? (

  // SHOW ONLY FORM
  <Fade in>
    <Card sx={{ borderRadius: 3, mb: 2 }}>
      <CardContent>

        <Typography variant="h6" sx={{ mb: 2 }}>
          {editingId ? "Edit User" : "User Details"}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField label="Username" name="username" fullWidth
              value={form.username} onChange={handleChange}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField label="Password" name="password" type="password" fullWidth
              value={form.password} onChange={handleChange}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField label="Full Name" name="fullName" fullWidth
              value={form.fullName} onChange={handleChange}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField label="Email" name="email" fullWidth
              value={form.email} onChange={handleChange}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField select label="Role" name="role" fullWidth
              value={form.role} onChange={handleChange}
            >
              {roles.map(role => (
              <MenuItem key={role.roleId} value={role.roleId}>
                {role.roleName}
              </MenuItem>
            ))}
            </TextField>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button onClick={() => setShowForm(false)} sx={{ mr: 2 }}>
            Cancel
          </Button>

          <Button variant="contained" onClick={handleSubmit}>
            {editingId ? "Update User" : "Create User"}
          </Button>
        </Box>

      </CardContent>
    </Card>
  </Fade>

) : (

  // SHOW ONLY TABLE
  <Fade in>
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Users List
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>USER ID</TableCell>
              <TableCell>FULL NAME / USER NAME</TableCell>
              <TableCell>ROLE</TableCell>
              <TableCell align="right">ACTIONS</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map(user => (
              <TableRow key={user.userId}>
                <TableCell>{user.userId}</TableCell>

                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>
                    {user.fullName} ({user.userName})
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={user.role?.roleName}
                    size="small"
                    sx={ROLE_COLORS[user.role?.roleName]}
                  />
                </TableCell>

                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(user)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton onClick={() => handleDelete(user.userId)}>
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

)}

      {/* TABLE */}
     

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
      />
    </Box>
  );
};

export default AddUser;