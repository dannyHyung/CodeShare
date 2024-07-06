import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const LanguageSelector = ({ language, handleLanguageChange }) => (
    <FormControl variant="outlined" sx={{ mr: 2, minWidth: 120 }}>
        <InputLabel
            sx={{
                color: '#0A21C0',
                '&.Mui-focused': {
                    color: '#0A21C0'
                }
            }}
        >
            Language
        </InputLabel>
        <Select
            value={language}
            onChange={handleLanguageChange}
            label="Language"
            sx={{
                color: '#0A21C0',
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2C2E3A', // Default border color
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0A21C0', // Border color on hover
                },
                '& .MuiSelect-icon': {
                    color: '#0A21C0' // Icon color
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0A21C0', // Ensure border is white when dropdown is open
                    borderWidth: 1
                },
            }}
            MenuProps={{
                PaperProps: {
                    sx: {
                        bgcolor: '#141619',
                        '& .MuiMenuItem-root': {
                            color: '#0A21C0',
                            '&:hover': {
                                bgcolor: '#B3B4BD',
                            },
                            '&.Mui-selected': {
                                bgcolor: '#B3B4BD',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.24)',
                                },
                            },
                        },
                    },
                },
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