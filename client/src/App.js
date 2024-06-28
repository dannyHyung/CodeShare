import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Box, Button, Grid, Paper, Typography, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CodeEditor from './components/CodeEditor';
import QuestionField from './components/QuestionField';
import LanguageSelector from './components/LanguageSelector';
import RunButton from './components/RunButton';
import OutputBox from './components/OutputBox';


const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000');

function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('initialCode', (initialCode) => {
      setCode(initialCode);
    });

    socket.on('initialLanguage', (initialLanguage) => {
      setLanguage(initialLanguage);
    });

    socket.on('codeChange', (newCode) => {
      console.log(`Code updated: ${newCode}`);
      setCode(newCode);
    });

    socket.on('questionChange', (newQuestion) => {
      console.log(`Question updated: ${newQuestion}`);
      setQuestion(newQuestion);
    });

    socket.on('languageChange', (newLanguage) => {
      setLanguage(newLanguage);
    });

    socket.on('codeOutput', (result) => {
      console.log(`Output received: ${result}`);
      setOutput(result);
    });

    socket.emit('requestCode');
    socket.emit('requestQuestion');
    socket.emit('requestLanguage');

    return () => {
      socket.off('connect');
      socket.off('initialCode');
      socket.off('initialLanguage');
      socket.off('codeChange');
      socket.off('questionChange');
      socket.off('languageChange');
      socket.off('codeOutput');
    };
  }, []);

  const runCode = () => {
    console.log(`Running code: ${code} in language: ${language}`);
    socket.emit('runCode', { code, language });
  };

  const handleChange = (field) => (event) => {
    const value = field === 'code' ? event : event.target.value;
    if (field === 'code') {
      setCode(value);
      socket.emit('codeChange', value);
    } else if (field === 'language') {
      setLanguage(value);
      socket.emit('languageChange', value);
    } else if (field === 'question') {
      setQuestion(value);
      socket.emit('questionChange', value);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#1e1e1e', color: '#ffffff' }}>
      <Grid container spacing={2} sx={{ flexGrow: 1, p: 2 }}>
        <Grid item xs={8} sx={{ display: 'flex' }}>
          <QuestionField question={question} handleQuestionChange={handleChange('question')} />
        </Grid>
        <Grid item xs={4} sx={{}}>
          <LanguageSelector language={language} handleLanguageChange={handleChange('language')} />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ height: '100vh' }}>
        <Grid item xs={8}>
          <Paper sx={{ p: 2, bgcolor: '#2d2d2d' }}>
            <CodeEditor code={code} language={language} setCode={handleChange('code')} />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <OutputBox output={output} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <RunButton runCode={runCode} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
