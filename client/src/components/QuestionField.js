import React from 'react';
import { TextField } from '@mui/material';

const QuestionField = ({ question, handleQuestionChange }) => (
    <TextField
        variant="outlined"
        placeholder="Paste your question here"
        value={question}
        onChange={handleQuestionChange}
        multiline
        rows={3}
        sx={{
            flexGrow: 1,
            mr: 2,
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: '#2C2E3A', // Default border color
                },
                '&:hover fieldset': {
                    borderColor: '#0A21C0', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#0A21C0', // Border color when focused
                },
            },
            '& .MuiInputBase-input': {
                color: '#ffffff',
                fontSize: '14px',
            },
            '& .MuiOutlinedInput-input': { 
                backgroundColor: '#2C2E3A' 
            },
        }}
    />
);

export default QuestionField;