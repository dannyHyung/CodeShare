import React, { useEffect, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';

const CodeEditor = ({ code, setCode, language}) => {
    const editorRef = useRef(null);

    const handleEditorChange = (value) => {
        setCode(value);
    };

    return (
        <Box sx={{ border: '1px solid #333', borderRadius: 1 }}>
            <Editor
                height='80vh'
                language={language}
                value={code}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                    automaticLayout: true,
                    tabSize: 4,
                    minimap: { enabled: false },
                }}
            />
        </Box>
    );
};

export default CodeEditor;
