import React from 'react';
import { Button } from '@mui/material';

const RunButton = ({ runCode }) => (
    <Button
        variant="contained"
        onClick={runCode}
        sx={{ bgcolor: '#007acc', '&:hover': { bgcolor: '#005f99' } }}
    >
        Run
    </Button>
);

export default RunButton;
