const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { exec } = require('child_process');
const path = require('path');
const tmp = require('tmp');
const fs = require('fs');
const cors = require('cors');
const app = express();

const server = http.createServer(app);

const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['https://codeshare-5ewf.onrender.com'];
const io = socketIo(server, {
    cors: {
        origin: allowedOrigins, // Replace with your frontend URL if different
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: allowedOrigins, // Replace with your frontend URL if different
    methods: ["GET", "POST"]
}));

app.use(express.static(path.join(__dirname, '../client/build'))); // Serve React app

let currentCode = ''; // Store the current code
let currentLanguage = 'javascript';
let currentQuestion = '';
let onlineUsers = {};

const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const broadcastUsersUpdate = () => {
    io.emit('usersUpdate', Object.values(onlineUsers));
};

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.emit('codeChange', currentCode);
    socket.emit('initialLanguage', currentLanguage);
    socket.emit('questionChange', currentQuestion);

    socket.on('setUsername', (username) => {
        onlineUsers[socket.id] = { name: username, color: generateRandomColor() };
        broadcastUsersUpdate();
    });

    socket.on('codeChange', (code) => {
        currentCode = code; // Update the current code
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

    socket.on('runCode', ({ code, language }) => {
        let command;
        let cleanupCallback = () => { }; // Initialize with an empty function

        switch (language) {
            case 'javascript':
                const tmpFileJs = tmp.fileSync({ postfix: '.js' });
                fs.writeFileSync(tmpFileJs.name, code);
                command = `node ${tmpFileJs.name}`;
                cleanupCallback = () => tmpFileJs.removeCallback();
                break;
            case 'python':
                const tmpFilePython = tmp.fileSync({ postfix: '.py' });
                fs.writeFileSync(tmpFilePython.name, code);
                command = `python ${tmpFilePython.name}`;
                cleanupCallback = () => tmpFilePython.removeCallback();
                break;
            case 'java':
                const classNameMatch = code.match(/public\s+class\s+(\w+)/);
                if (!classNameMatch) {
                    socket.emit('codeOutput', 'Invalid Java code: no public class found');
                    return;
                }
                const className = classNameMatch[1];
                const tmpFileJava = tmp.fileSync({ postfix: `.java` });
                const javaFilePath = path.join(path.dirname(tmpFileJava.name), `${className}.java`);
                fs.writeFileSync(javaFilePath, code);
                command = `javac ${javaFilePath} && java -cp ${path.dirname(javaFilePath)} ${className}`;
                cleanupCallback = () => {
                    tmpFileJava.removeCallback();
                    const classFile = path.join(path.dirname(javaFilePath), `${className}.class`);
                    if (fs.existsSync(classFile)) {
                        fs.unlinkSync(classFile);
                    }
                    if (fs.existsSync(javaFilePath)) {
                        fs.unlinkSync(javaFilePath);
                    }
                };
                break;
            case 'cpp':
                const tmpFileCpp = tmp.fileSync({ postfix: '.cpp' });
                fs.writeFileSync(tmpFileCpp.name, code);
                command = `g++ ${tmpFileCpp.name} -o ${tmpFileCpp.name}.out && ${tmpFileCpp.name}.out`;
                cleanupCallback = () => {
                    tmpFileCpp.removeCallback();
                    const exeFile = `${tmpFileCpp.name}.out`;
                    if (fs.existsSync(exeFile)) {
                        fs.unlinkSync(exeFile);
                    }
                };
                break;
            default:
                socket.emit('codeOutput', 'Unsupported language');
                return;
        }

        exec(command, (error, stdout, stderr) => {
            const result = error ? stderr : stdout;
            socket.emit('codeOutput', result);
            socket.broadcast.emit('codeOutput', result); // Broadcast to all clients
            cleanupCallback(); // Clean up temporary files
        });
    });

    socket.on('userTyping', ({ username, isTyping }) => {
        socket.broadcast.emit('userTyping', { username, isTyping });
    });

    socket.on('disconnect', () => {
        delete onlineUsers[socket.id];
        broadcastUsersUpdate();
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
