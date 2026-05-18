import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Card, CardContent, Typography, Grid, TextField, MenuItem,
  Button, Chip, Divider, Alert, CircularProgress, Fade, Snackbar, useTheme
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TableChartIcon from '@mui/icons-material/TableChart';

import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from "@mui/material";

const Compare = () => {
  const theme = useTheme();
  const c = theme.palette.custom;

  const [selection, setSelection] = useState({ db1: '', db2: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [environments, setEnvironments] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedRecid, setSelectedRecid] = useState(null);
  const [valueData, setValueData] = useState([]);
  const [recids, setRecids] = useState([]);
  const [valueTables, setValueTables] = useState([]);
  const [selectedValueTable, setSelectedValueTable] = useState('');
  const [message, setMessage] = useState('');
  

// ✅ ADD THIS FUNCTION (from second file)
const handleDownload = () => {
  if (!selectedValueTable || !selection.db1 || !selection.db2 || !selectedRecid) {
  alert("Please select table, recid, and environments!");
  return;
}

  const url = `http://localhost:8080/api/value/download-excel?table=${selectedValueTable}&recid=${selectedRecid}&sourceEnvId=${selection.db1}&targetEnvId=${selection.db2}`;

  window.open(url, "_blank");
};

  // 🔥 API CALLS
  const runComparisonAPI = () => {
    return axios.post("http://localhost:8080/api/comparison/run");
  };

  const getResultsAPI = () => {
    return axios.get("http://localhost:8080/api/comparison/results");
  };

  // 🔄 Fetch environments
useEffect(() => {
  axios.get("http://localhost:8080/api/environment")
    .then(res => setEnvironments(res.data))
    .catch(err => console.error(err));
}, []);

  const [groupedData, setGroupedData] = useState({});
const [openTable, setOpenTable] = useState(null);

useEffect(() => {
  if (results.length > 0) {
    const grouped = {};

    results.forEach((item) => {
      const table = item.table_name;

      if (!grouped[table]) {
        grouped[table] = [];
      }

      grouped[table].push(item);
    });

    setGroupedData(grouped);
  }
}, [results]);

const handleToggle = (tableName) => {
  if (openTable === tableName) {
    setOpenTable(null); // close if same clicked
  } else {
    setOpenTable(tableName); // open new
  }
};

  const handleChange = (e) => {
    setSelection((p) => ({ ...p, [e.target.name]: e.target.value }));
    setSubmitted(false);
    setError('');
  };

  const uploadCsvAPI = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post("http://localhost:8080/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
  // 🚀 MAIN BUTTON LOGIC
  const handleCompare = async () => {
  if (!selection.db1 || !selection.db2) return;

  try {
    setError('');
    setLoading(true);
    setSubmitted(false);

    // ✅ STEP 1: Upload CSV
    if (csvFile) {
      await uploadCsvAPI(csvFile);
    }

    // ✅ STEP 2: Run comparison
    await runComparisonAPI();

    // ✅ STEP 3: Get results
    const res = await getResultsAPI();
    setResults(res.data);

    setSubmitted(true);
    setSnackbarOpen(true);

  } catch (err) {
    console.error(err);
    setError("Error running comparison");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchValueTables();
}, []);

const fetchValueTables = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/value/tables");
    console.log("TABLES:", res.data); // 🔥 VERY IMPORTANT
    setValueTables(res.data);
  } catch (err) {
    console.error(err);
  }
};

const handleRecidClick = async (recid) => {
  const res = await axios.get(
    `http://localhost:8080/api/value/compare/${recid}?table=${selectedValueTable}&sourceEnvId=${selection.db1}&targetEnvId=${selection.db2}`
  );
  setValueData(res.data);
};

const runComparison = async () => {
  try {
    setLoading(true);

    // 1. Structure comparison
    await handleCompare();

    // 2. Store value comparison (for report)
    await axios.post(
      `http://localhost:8080/api/run-all?sourceEnvId=${selection.db1}&targetEnvId=${selection.db2}`
    );

    setMessage("Value data stored successfully");
    setSnackbarOpen(true);

  } catch (error) {
    console.error(error);
    setMessage("Error storing value data");
    setSnackbarOpen(true);
  } finally {
    setLoading(false);
  }
};

const getRecidsAPI = async (tableName) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/value/recids/${tableName}`);
    setRecids(res.data);
  } catch (err) {
    console.error("Error fetching recids:", err);
  }
};

  const sourceEnvs = environments.filter(env => env.type === "Source");
  const targetEnvs = environments.filter(env => env.type === "Target");
  const canCompare = selection.db1 && selection.db2;

 return (
  <Box sx={{ pt: 1 }}>
    <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
      Comparison
    </Typography>

    <Grid container spacing={3} sx={{ mb: 3 }}>

      {/* SOURCE */}
      <Grid item xs={12} md={5}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1">Source</Typography>
            <TextField
              select
              fullWidth
              name="db1"
              label="Source Environment"
              value={selection.db1}
              onChange={handleChange}
              sx={{ mt: 2 }}
            >
              {sourceEnvs.map((env) => (
                <MenuItem key={env.id} value={env.id}>
                  {env.name}
                </MenuItem>
              ))}
            </TextField>
          </CardContent>
        </Card>
      </Grid>

      {/* MIDDLE */}
      <Grid
        item
        xs={12}
        md={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CompareArrowsIcon sx={{ fontSize: 40, mb: 1 }} />

        <Button variant="outlined" component="label">
          Upload CSV
          <input
            hidden
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files[0])}
          />
        </Button>

        {csvFile && (
          <Typography
            variant="caption"
            sx={{
              mt: 1,
              color: "green",
              fontWeight: 500,
              textAlign: "center",
              wordBreak: "break-all"
            }}
          >
            {csvFile.name}
          </Typography>
        )}
      </Grid>

      {/* TARGET */}
      <Grid item xs={12} md={5}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1">Target</Typography>
            <TextField
              select
              fullWidth
              name="db2"
              label="Target Environment"
              value={selection.db2}
              onChange={handleChange}
              sx={{ mt: 2 }}
            >
              {targetEnvs.map((env) => (
                <MenuItem key={env.id} value={env.id}>
                  {env.name}
                </MenuItem>
              ))}
            </TextField>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    {/* BUTTON */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
      {loading && <CircularProgress size={20} sx={{ mr: 2 }} />}
      <Button
        variant="contained"
        disabled={!canCompare || loading}
        onClick={runComparison}
      >
        Run Comparison
      </Button>
    </Box>

    {error && <Alert severity="error">{error}</Alert>}

    {/* RESULT */}
    {submitted && (
      <Fade in>
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>

            <Typography variant="h6">Comparison Result</Typography>
            <Divider sx={{ my: 2 }} />

            {/* TABLE DROPDOWN */}
            <TextField
              select
              fullWidth
              label="Select Table"
              value={selectedTable}
              sx={{ mb: 2 }}
            >
              {Object.keys(groupedData).map((tableName) => (
                <MenuItem
                  key={tableName}
                  value={tableName}
                  onClick={() => setSelectedTable(tableName)}
                >
                  {tableName}
                </MenuItem>
              ))}
            </TextField>

            {/* EXISTING COMPARISON TABLE (UNCHANGED) */}
            {results.length === 0 ? (
              <Typography>No data found</Typography>
            ) : (
              selectedTable && (
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f5f5f5" }}>
                        <th>Position</th>
                        <th>Field</th>
                        <th>Table</th>
                        <th>Pos Match</th>
                        <th>Field Match</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedData[selectedTable]?.map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                          <td align='center'>{row.position}</td>
                          <td align='center'>{row.fields}</td>
                          <td align='center'>{row.table_name}</td>

                          <td align='center'>
                            <Chip
                              label={row.pos_match}
                              color={row.pos_match === "POS_MATCH" ? "success" : "error"}
                              size="small"
                            />
                          </td>

                          <td align='center'>
                            <Chip
                              label={row.compared_data}
                              color={row.compared_data === "MATCH" ? "success" : "error"}
                              size="small"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              )
            )}

            {/* 🔥 VALUE COMPARISON */}
<Box sx={{ mt: 5 }}>

  <Typography variant="h5">Value Comparison</Typography>

  {/* TABLE DROPDOWN */}
  <TextField
    select
    fullWidth
    label="Select Table"
    value={selectedValueTable}
    onChange={(e) => {
      const table = e.target.value;
      setSelectedValueTable(table);
      setSelectedRecid(null);
      setValueData([]);

axios.get(`http://localhost:8080/api/value/recids/${table}`)
        .then(res => setRecids(res.data));
    }}
    sx={{ mb: 2 }}
  >
    {valueTables.map((table) => (
      <MenuItem key={table} value={table}>
        {table}
      </MenuItem>
    ))}
  </TextField>

  {/* RECID LIST */}
  {recids.map((recid) => (
    <Box
      key={recid}
      onClick={() => {
        if (selectedRecid === recid) {
          setSelectedRecid(null);
          setValueData([]);
        } else {
          setSelectedRecid(recid);

axios.get(
  `http://localhost:8080/api/value/compare/${recid}?table=${selectedValueTable}&sourceEnvId=${selection.db1}&targetEnvId=${selection.db2}`
)
.then(res => setValueData(res.data));
        }
      }}
      sx={{
        cursor: "pointer",
        padding: "8px",
        background: "#f5f5f5",
        mb: 1,
        borderRadius: "5px"
      }}
    >
      {selectedRecid === recid ? "▼" : "▶"} {recid}
    </Box>
  ))}

  {/* VALUE TABLE */}
{valueData.length > 0 && (
  <>
    
    {/* ✅ ADDED CSV BUTTON (ONLY CHANGE) */}
    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
        variant="contained"
        color="success"
        onClick={handleDownload}
      >
        Download Excel
      </Button>
    </Box>

    {/* EXISTING TABLE (UNCHANGED) */}
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            {["S.No", "Position", "Field Name", "DB1", "DB2", "Status"].map((h) => (
              <TableCell
                key={h}
                sx={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#333"
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {valueData.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{row.position}</TableCell>

              <TableCell>
                {row.fieldName || "-"}
              </TableCell>

              <TableCell>{row.db1_value || "-"}</TableCell>
              <TableCell>{row.db2_value || "-"}</TableCell>

              <TableCell>
                <Chip
                  label={row.status}
                  color={row.status === "MATCH" ? "success" : "error"}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>

  </>
)}

</Box>

          </CardContent>
        </Card>
      </Fade>
    )}

    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={() => setSnackbarOpen(false)}
      message={message}
    />
  </Box>
);
};

export default Compare;