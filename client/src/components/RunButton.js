import React from 'react';
import { Button } from '@mui/material';

const RunButton = ({ runCode }) => (
    <Button
        variant="outlined"
        onClick={runCode}
        sx={{
            color: '#ffffff',
            backgroundColor: '#2C2E3A',
            borderColor: '#2C2E3A',
            '&:hover': {
                backgroundColor: '#2C2E3A',
                borderColor: '#0A21C0',
                color: '#ffffff',
            },
        }}
    >
        Run
    </Button>
);

export default RunButton;