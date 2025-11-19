# Coding Agent Web App

A MERN stack application that provides a coding assistant using OpenAI's API and real-time chat with Socket.io.

## Features

- Real-time chat interface
- Code generation using OpenAI GPT
- Modern React frontend
- Express backend with Socket.io

## Setup

1. Clone the repository.
2. In the server directory, create a .env file with your OpenAI API key: `OPENAI_API_KEY=your_key`
3. Install dependencies: `npm install` in both server and client directories.
4. Start the server: `cd server && npm start`
5. Start the client: `cd client && npm start`

## Usage

Open http://localhost:3000 in your browser. Type a coding question or prompt, and the agent will respond with generated code or explanations.