import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, Divider, Fade, useTheme } from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';
import DatabaseIcon from '@mui/icons-material/Storage';
import CompareIcon from '@mui/icons-material/CompareArrows';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import StatCard from '../components/StatCard.jsx';

const Dashboard = () => {
  const theme = useTheme();
  const c = theme.palette.custom;

  const [summary, setSummary] = useState(null);
  const [envCount, setEnvCount] = useState(null);
  const [comparisonCount, setComparisonCount] = useState(null);
  const [recentRuns, setRecentRuns] = useState([]);

  // 🔹 Accuracy + Error
  const dataAccuracy = summary && summary.total > 0
    ? ((summary.matched / summary.total) * 100).toFixed(1)
    : 0;

  const errorRate = summary && summary.total > 0
    ? (((summary.mismatched + summary.missing) / summary.total) * 100).toFixed(1)
    : 0;

  // 🔹 API CALLS
  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard/summary")
      .then(res => res.json())
      .then(data => setSummary(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard/env-count")
      .then(res => res.json())
      .then(data => setEnvCount(data.envCount));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard/comparison-count")
      .then(res => res.json())
      .then(data => setComparisonCount(data.count));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard/recent-runs")
      .then(res => res.json())
      .then(data => setRecentRuns(data));
  }, []);

  return (
    <Box sx={{ pt: 1 }}>
      <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700 }}>
        Dashboard
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          {
            icon: <DatabaseIcon />,
            label: 'Connected Databases',
            value: envCount ?? '...'
          },
          {
            icon: <CompareIcon />,
            label: 'Comparisons Run',
            value: comparisonCount ?? '...'
          },
          {
            icon: <QueryStatsIcon />,
            label: 'Data Accuracy %',
            value: summary ? `${dataAccuracy}%` : '...'
          },
          {
            icon: <TableChartIcon />,
            label: 'Error Rate %',
            value: summary ? `${errorRate}%` : '...'
          }
        ].map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* 🔥 RECENT ACTIVITY */}
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6">Recent Comparison Activity</Typography>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: '0.2fr 2fr 1.5fr 1.5fr 1.5fr', gap: 1.5 }}>
            
            {/* HEADER */}
            {['S.No', 'Comparison', 'Result', 'Runtime', 'Date'].map(h => (
              <Typography key={h} variant="caption" sx={{ fontWeight: 700 }}>
                {h}
              </Typography>
            ))}

            {/* DATA */}
            {recentRuns.map((run, index) => (
              <React.Fragment key={run.run_id}>
                
                <Box>{index + 1}</Box>

                <Box>
                  {run.source_env && run.target_env && run.table_name
                    ? `${run.source_env} vs ${run.target_env} / ${run.table_name}`
                    : `Run #${run.run_id}`}
                </Box>

                <Box>
                  {run.matched === run.total
                    ? "In sync"
                    : `${run.mismatched} mismatched, ${run.missing} missing`}
                </Box>

                <Box>
                  {run.runtime_ms != null
                  ? `${run.runtime_ms} ms (${(run.runtime_ms / 1000).toFixed(2)} sec)`
                  : '...'}
                </Box>

                <Box>
                  {run.created_at
                    ? new Date(run.created_at).toLocaleString()
                    : '...'}
                </Box>

              </React.Fragment>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;