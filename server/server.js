const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

const conversations = new Map();

app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: 'You are a coding assistant. Focus on programming tasks, code generation, debugging, and explanations. Keep responses relevant to coding.' },
                { role: 'user', content: prompt }
            ],
        });
        res.json({ code: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

io.on('connection', (socket) => {
    console.log('User connected');
    const userId = socket.id;
    conversations.set(userId, [{ role: 'system', content: 'You are a coding assistant. Focus on programming tasks, code generation, debugging, and explanations. Keep responses relevant to coding.' }]);

    socket.on('sendMessage', async (data) => {
        const userMessages = conversations.get(userId) || [];
        userMessages.push({ role: 'user', content: data.message });
        try {
            const response = await openai.chat.completions.create({
                model: 'llama-3.1-8b-instant',
                messages: userMessages,
            });
            const agentMessage = response.choices[0].message.content;
            userMessages.push({ role: 'assistant', content: agentMessage });
            socket.emit('receiveMessage', { message: agentMessage });
        } catch (error) {
            console.error('Groq API error:', error);
            socket.emit('receiveMessage', { message: 'Error generating response.' });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        conversations.delete(userId);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});