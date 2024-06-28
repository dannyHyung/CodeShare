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
                '& fieldset': { borderColor: '#007acc' },
                '&:hover fieldset': { borderColor: '#005f99' },
                '&.Mui-focused fieldset': { borderColor: '#007acc' },
            },
            '& .MuiInputBase-input': {
                color: '#ffffff',
                fontSize: '14px',
            },
            '& .MuiOutlinedInput-input': { backgroundColor: '#2d2d2d' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#007acc' },
        }}
    />
);

export default QuestionField;
