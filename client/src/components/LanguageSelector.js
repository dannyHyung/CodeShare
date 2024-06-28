import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const LanguageSelector = ({ language, handleLanguageChange }) => (
    <FormControl variant="outlined" sx={{ mr: 2, minWidth: 120 }}>
        <InputLabel sx={{ color: '#ffffff' }}>Language</InputLabel>
        <Select
            value={language}
            onChange={handleLanguageChange}
            label="Language"
            sx={{
                color: '#ffffff',
                '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#007acc' },
                    '&:hover fieldset': { borderColor: '#005f99' },
                    '&.Mui-focused fieldset': { borderColor: '#007acc' },
                },
                '& .MuiSelect-icon': { color: '#ffffff' },
            }}
        >
            <MenuItem value="javascript">JavaScript</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
        </Select>
    </FormControl>
);

export default LanguageSelector;
