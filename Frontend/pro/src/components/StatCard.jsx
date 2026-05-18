import React from 'react';
import { Card, CardContent, Box, Typography, useTheme } from '@mui/material';

const StatCard = ({ icon, label, value, trend, trendLabel }) => {
  const theme = useTheme();
  const c = theme.palette.custom;

  const isPositive = trend !== undefined && trend >= 0;

  return (
    <Card sx={{ height: '100%', borderRadius: 4, position: 'relative', overflow: 'hidden', cursor: 'default' }}>
      <CardContent sx={{ p: 2.8 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{
            width: 44,
            height: 44,
            borderRadius: 3,
            mr: 1.8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: c.iconGradient1,
            color: c.iconColor1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            '& svg': { fontSize: 22 }
          }}>
            {icon}
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: c.subtleText,
                fontWeight: 600,
                fontSize: 10
              }}
            >
              {label}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mt: 0.3,
                fontWeight: 700,
                background: c.gradientText,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {value}
            </Typography>
          </Box>
        </Box>

        {/* ✅ Show only if trend exists */}
        {trend !== undefined && trendLabel && (
          <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 1,
                py: 0.2,
                borderRadius: 2,
                backgroundColor: isPositive ? c.trendPositiveBg : c.trendNegativeBg,
                border: `1px solid ${isPositive ? c.trendPositiveBorder : c.trendNegativeBorder}`
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  fontSize: 12,
                  color: isPositive
                    ? theme.palette.success.main
                    : theme.palette.error.main
                }}
              >
                {isPositive ? '+' : ''}
                {trend}%
              </Typography>
            </Box>

            <Typography
              variant="caption"
              sx={{ color: c.subtleText, fontSize: 11 }}
            >
              {trendLabel}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;