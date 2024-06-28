// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { exec } = require('child_process');
const path = require('path');
const tmp = require('tmp');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Replace with your frontend URL if different
        methods: ["GET", "POST"]
    }
});

app.use(express.static(path.join(__dirname, '../client/build'))); // Serve React app

let currentCode = ''; // Store the current code
let currentLanguage = 'javascript';
let currentQuestion = '';

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.emit('codeChange', currentCode);
    socket.emit('initialLanguage', currentLanguage);
    socket.emit('questionChange', currentQuestion);

    socket.on('codeChange', (code) => {
        currentCode = code; // Update the current code
        // console.log(`Code received: ${code}`);
        socket.broadcast.emit('codeChange', code);
    });

    socket.on('languageChange', (language) => {
        currentLanguage = language;
        socket.broadcast.emit('languageChange', language);
    });

    socket.on('questionChange', (question) => {
        currentQuestion = question;
        socket.broadcast.emit('questionChange', question);
    });

    socket.on('runCode', ({code, language}) => {
        let command;

        switch (language) {
            case 'javascript':
                command = `node -e "${code.replace(/"/g, '\\"')}"`;
                break;
            case 'python':
                const tmpFilePython = tmp.fileSync({ postfix: '.py' });
                fs.writeFileSync(tmpFilePython.name, code);
                command = `python ${tmpFilePython.name}`;
                break;
            case 'java':
                const tmpFileJava = tmp.fileSync({ postfix: '.java' });
                fs.writeFileSync(tmpFileJava.name, code);
                command = `javac ${tmpFileJava.name} && java ${path.basename(tmpFileJava.name, '.java')}`;
                break;
            case 'csharp':
                const tmpFileCSharp = tmp.fileSync({ postfix: '.cs' });
                fs.writeFileSync(tmpFileCSharp.name, code);
                command = `mcs ${tmpFileCSharp.name} && mono ${path.basename(tmpFileCSharp.name, '.cs')}.exe`;
                break;
            case 'cpp':
                const tmpFileCpp = tmp.fileSync({ postfix: '.cpp' });
                fs.writeFileSync(tmpFileCpp.name, code);
                command = `g++ ${tmpFileCpp.name} -o ${tmpFileCpp.name}.out && ${tmpFileCpp.name}.out`;
                break;
            default:
                socket.emit('codeOutput', 'Unsupported language');
                return;
        }

        exec(command, (error, stdout, stderr) => {
            const result = error ? stderr : stdout;
            socket.emit('codeOutput', result);
            socket.broadcast.emit('codeOutput', result); // Broadcast to all clients
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
