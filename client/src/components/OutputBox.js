import React from 'react';
import { Paper, Typography } from '@mui/material';

const OutputBox = ({ output }) => (
    <Paper sx={{ height: '50%', p: 2, display: 'flex', flexDirection: 'column', bgcolor: '#2C2E3A' }}>
        <Typography component="pre" sx={{ flex: 1, overflowX: 'auto', bgcolor: '#141619', p: 2, borderRadius: 1, color: '#ffffff' }}>
            {output}
        </Typography>
    </Paper>
);

export default OutputBox;
