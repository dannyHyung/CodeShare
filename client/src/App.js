import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Box, Button, Grid, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Avatar, Typography } from '@mui/material';
import CodeEditor from './components/CodeEditor';
import QuestionField from './components/QuestionField';
import LanguageSelector from './components/LanguageSelector';
import RunButton from './components/RunButton';
import OutputBox from './components/OutputBox';
import UsernameDialog from './components/UsernameDialog';

const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000');

function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
        socket.emit('setUsername', storedUsername);
      } else {
        setIsDialogOpen(true);
      }
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

    socket.on('usersUpdate', (onlineUsers) => {
      setUsers(onlineUsers);
    });

    socket.on('codeOutput', (result) => {
      console.log(`Output received: ${result}`);
      setOutput(result);
    });

    socket.on('userTyping', ({ username, isTyping }) => {
      setTypingUsers(prev => {
        if (isTyping) {
          return [...new Set([...prev, username])];
        } else {
          return prev.filter(user => user !== username);
        }
      });
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
      socket.off('userTyping');
    };
  }, []);

  const runCode = () => {
    console.log(`Running code: ${code} in language: ${language}`);
    socket.emit('runCode', { code, language });
  };

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      localStorage.setItem('username', username);
      socket.emit('setUsername', username);
      setIsDialogOpen(false);
    }
  };

  const handleChange = (field) => (event) => {
    const value = field === 'code' ? event : event.target.value;
    if (field === 'code') {
      setCode(value);
      socket.emit('codeChange', value);
      socket.emit('userTyping', { username, isTyping: true });
      clearTimeout(window.typingTimeout);
      window.typingTimeout = setTimeout(() => {
        socket.emit('userTyping', { username, isTyping: false });
      }, 1000);
    } else if (field === 'language') {
      setLanguage(value);
      socket.emit('languageChange', value);
    } else if (field === 'question') {
      setQuestion(value);
      socket.emit('questionChange', value);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#141619', color: '#ffffff' }}>
      <UsernameDialog
        open={isDialogOpen}
        username={username}
        onUsernameChange={(e) => setUsername(e.target.value)}
        onSubmit={handleUsernameSubmit}
      />

      <Grid container spacing={2} sx={{ flexGrow: 1, p: 2 }}>
        <Grid item xs={8} sx={{ display: 'flex' }}>
          <QuestionField question={question} handleQuestionChange={handleChange('question')} />
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
          <LanguageSelector language={language} handleLanguageChange={handleChange('language')} />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ height: '100vh' }}>
        <Grid item xs={8}>
          <Paper sx={{ p: 2, bgcolor: '#2C2E3A' }}>
            <CodeEditor code={code} language={language} setCode={handleChange('code')} />
          </Paper>
        </Grid>
        <Grid item xs={4} sx={{ position: 'relative' }}>
          <OutputBox output={output} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt:2 }}>
            <RunButton runCode={runCode} />
          </Box>
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', p: 2 }}>
            <Box>
              {typingUsers.length > 0 && (
                <Typography sx={{ fontStyle: 'italic', color: '#0A21C0' }}>
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1, justifyContent: 'flex-end' }}>
              {users.map((user, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: user.color, width: 24, height: 24, mr: 1 }} />
                  <Typography>{user.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
