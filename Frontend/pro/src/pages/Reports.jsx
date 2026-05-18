import React, { useState } from 'react';
import { useEffect } from 'react';
import {
Box, Card, CardContent, Typography, Grid,
Chip, Fade, useTheme, TextField, Button, Divider
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { MenuItem } from '@mui/material';



const Reports = () => {
const theme = useTheme();
const c = theme.palette.custom;

// 🔹 STATE
const [fromDate, setFromDate] = useState('');
const [toDate, setToDate] = useState('');
const [structureData, setStructureData] = useState([]);
const [page, setPage] = useState(0);
const [valuePage, setValuePage] = useState(0);
const [valueReport, setValueReport] = useState([]);
const rowsPerPage = 20;
const [refreshKey, setRefreshKey] = useState(0);
const [tableFilter, setTableFilter] = useState('');
const [statusFilter, setStatusFilter] = useState('');
const [recidFilter, setRecidFilter] = useState('');

const [structureTableFilter, setStructureTableFilter] = useState('');
const [structureStatusFilter, setStructureStatusFilter] = useState('');
const [structureFieldFilter, setStructureFieldFilter] = useState('');


// 🔹 API CALL
const handleApply = () => {
  setPage(0);
  setValuePage(0);

  // optional but clean UX
  // clear filters when new date applied
  setTableFilter('');
  setStatusFilter('');
  setRecidFilter('');

  setStructureTableFilter('');
  setStructureStatusFilter('');
  setStructureFieldFilter('');

  setRefreshKey(prev => prev + 1);
};

const handleDownload = () => {
  if (!fromDate || !toDate) {
    alert("Please select date");
    return;
  }

  const url =
    `http://localhost:8080/api/dashboard/reports/export?from=${fromDate}&to=${toDate}` +
    `${structureTableFilter ? `&structureTable=${structureTableFilter}` : ''}` +
    `${structureStatusFilter ? `&structureStatus=${structureStatusFilter}` : ''}` +
    `${structureFieldFilter ? `&structureField=${structureFieldFilter}` : ''}` +
    `${tableFilter ? `&valueTable=${tableFilter}` : ''}` +
    `${statusFilter ? `&valueStatus=${statusFilter}` : ''}` +
    `${recidFilter ? `&recid=${recidFilter}` : ''}`;

  window.open(url, "_blank");
};

useEffect(() => {
  if (!fromDate || !toDate) return;   // ✅ ADD THIS

  fetch(`http://localhost:8080/api/reports/value?from=${fromDate}&to=${toDate}&page=${valuePage}&size=${rowsPerPage}&table=${tableFilter}&status=${statusFilter}&recid=${recidFilter}`)
    .then(res => res.json())
    .then(data => setValueReport(data))
    .catch(err => console.error(err));

}, [valuePage, refreshKey, tableFilter, statusFilter, recidFilter]);


useEffect(() => {
  if (!fromDate || !toDate) return;

  fetch(`http://localhost:8080/api/dashboard/reports/structure?from=${fromDate}&to=${toDate}&page=${page}&size=${rowsPerPage}&table=${structureTableFilter}&status=${structureStatusFilter}&field=${structureFieldFilter}`)
    .then(res => res.json())
    .then(data => setStructureData(data))
    .catch(err => console.error(err));

}, [page, refreshKey, structureTableFilter, structureStatusFilter, structureFieldFilter]);

return (
<Box sx={{ pt: 1 }}>
<Typography variant="h5" sx={{
mb: 0.5, fontWeight: 700,
background: c.gradientText,
WebkitBackgroundClip: 'text',
WebkitTextFillColor: 'transparent'
}}>
Reports </Typography>

  <Typography variant="body2" sx={{ mb: 3, color: c.subtleText }}>
    Curated insights from historical comparison runs and drift detection.
  </Typography>

  {/* 🔥 DATE FILTER */}
  <Card sx={{ borderRadius: 4, mb: 3 }}>
    <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <TextField
        type="date"
        label="From Date"
        InputLabelProps={{ shrink: true }}
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />

      <TextField
        type="date"
        label="To Date"
        InputLabelProps={{ shrink: true }}
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />

      <Button variant="contained" onClick={handleApply}>
        Apply
      </Button>
      <Button
        variant="outlined"
        onClick={handleDownload}
      >
        Download CSV
      </Button>
    </CardContent>
  </Card>

  <Card sx={{ borderRadius: 4, mb: 2 }}>
  <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>

    <TextField
      label="Table"
      value={structureTableFilter}
      onChange={(e) => {
      setStructureTableFilter(e.target.value);
      setPage(0);
    }}
    />

    <TextField
      label="Field"
      value={structureFieldFilter}
      onChange={(e) => {
        setStructureFieldFilter(e.target.value);
        setPage(0);
      }}
    />

    <TextField sx={{ minWidth:150}}
      label="Status"
      select
      //SelectProps={{ native: true }}
      value={structureStatusFilter}
      onChange={(e) => {
        setStructureStatusFilter(e.target.value);
        setPage(0);
      }}
    >
      <MenuItem value="">ALL</MenuItem>
      <MenuItem value="MATCH">MATCH</MenuItem>
      <MenuItem value="MISMATCH">MISMATCH</MenuItem>
    </TextField>

  </CardContent>
</Card>

  {/* 🔥 STRUCTURE HISTORY TABLE */}
  <Card sx={{ borderRadius: 4 }}>
    <CardContent>
      <Typography variant="h6">Structure History</Typography>
      <Divider sx={{ my: 2 }} />

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '0.5fr 1fr 2fr 2fr 1fr 1fr 2fr',
        gap: 1.5
      }}>
        
        {/* HEADER */}
        {['S.No', 'Position', 'Table', 'Field', 'POS Match', 'Status', 'Date'].map(h => (
          <Typography key={h} variant="caption" sx={{ fontWeight: 700 }}>
            {h}
          </Typography>
        ))}

        {/* DATA */}
        {structureData.map((row, index) => (
          <React.Fragment key={row.id}>
            
            <Box>{index + 1}</Box>

            <Box>{row.position}</Box>

            <Box>{row.table_name}</Box>

            <Box>{row.field_name}</Box>


            <Box>
              <Chip
                label={row.pos_match}
                size="small"
                color={row.pos_match === 'POS_MATCH' ? 'success' : 'warning'}
              />
            </Box>

            <Box>
              <Chip
                label={row.compared_data}
                size="small"
                color={row.compared_data === 'MATCH' ? 'success' : 'error'}
              />
            </Box>

            <Box>
              {new Date(row.created_at).toLocaleString('en-GB')}
            </Box>

          </React.Fragment>
        ))}
      </Box>

      {fromDate && toDate && structureData.length === 0 && (
  <Typography sx={{ mt: 2, textAlign: 'center' }}>
    No data available for selected date
  </Typography>
)}
    </CardContent>
  </Card>

  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>

  <Button
    variant="outlined"
    disabled={page === 0}
    onClick={() => setPage(prev => prev - 1)}
  >
    Previous
  </Button>

  <Typography>Page {page + 1}</Typography>

  <Button
  variant="outlined"
  disabled={structureData.length < rowsPerPage}
  onClick={() => setPage(prev => prev + 1)}
>
  Next
</Button>

</Box>

<Card sx={{ borderRadius: 4, mt: 3 }}>
  <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>

    <TextField
      label="Table"
      value={tableFilter}
      onChange={(e) => {
      setTableFilter(e.target.value);
      setValuePage(0);
    }}
      placeholder="F_ACCOUNT"
    />

    <TextField
      label="Recid"
      value={recidFilter}
      onChange={(e) => {
      setRecidFilter(e.target.value);
      setValuePage(0);
    }}
      placeholder="Search Recid"
    />

    <TextField sx={{ minWidth:150}}
  label="Status"
  select
  value={statusFilter}
  onChange={(e) => {
    setStatusFilter(e.target.value);
    setValuePage(0);
  }}
>
      <MenuItem value="">ALL</MenuItem>
  <MenuItem value="MATCH">MATCH</MenuItem>
  <MenuItem value="MISMATCH">MISMATCH</MenuItem>
    </TextField>

  </CardContent>
</Card>

{/* 🔥 VALUE COMPARISON HISTORY */}
<Card sx={{ borderRadius: 4, mt: 4 }}>
  <CardContent>

    <Typography variant="h6">Value Comparison History</Typography>
    <Divider sx={{ my: 2 }} />

    {valueReport.length === 0 ? (
      <Typography>No value comparison data available</Typography>
    ) : (
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr 0.5fr 2fr 2fr 2fr 1fr 2fr',
        gap: 1.5
      }}>

        {/* HEADER */}
        {['Recid', 'Table', 'Pos', 'Field', 'DB1', 'DB2', 'Status', 'Date']
          .map(h => (
            <Typography key={h} variant="caption" sx={{ fontWeight: 700 }}>
              {h}
            </Typography>
          ))}

        {/* DATA */}
        {valueReport.map((row, index) => (
          <React.Fragment key={index}>

            

            <Box>{row.recid}</Box>

            <Box>{row.table_name}</Box>

            <Box>{row.position}</Box>

            <Box>{row.field_name}</Box>

            <Box>{row.db1_value}</Box>

            <Box>{row.db2_value}</Box>

            <Box>
              <Chip
                label={row.status}
                size="small"
                color={row.status === 'MATCH' ? 'success' : 'error'}
              />
            </Box>

            <Box>
              {new Date(row.created_at).toLocaleString('en-GB')}
            </Box>

          </React.Fragment>
        ))}

      </Box>
    )}

  </CardContent>
</Card>

<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>

  <Button
    variant="outlined"
    disabled={valuePage === 0}
    onClick={() => setValuePage(prev => prev - 1)}
  >
    Previous
  </Button>

  <Typography>Page {valuePage + 1}</Typography>

  <Button
    variant="outlined"
    disabled={valueReport.length < rowsPerPage}
    onClick={() => setValuePage(prev => prev + 1)}
  >
    Next
  </Button>

</Box>

</Box>


);
};

export default Reports;
