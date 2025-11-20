import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';
import boardsRouter from './routes/boards.js';
import handleTrelloWebhook from './webhookHandler.js';

const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions))


app.use('/api/tasks', tasksRouter);
app.use('/api/boards', boardsRouter);

app.head('/trello/webhook', handleTrelloWebhook);
app.post('/trello/webhook', handleTrelloWebhook);


app.get('/', async (req, res) => {
  res.status(200).json({ status: 'running' })
})

const server = http.createServer(app);

const io = new Server(server,
  {
    cors: { origin: '*' }
  }
);

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connected: ', socket.id);

  socket.on("joinBoard", (boardId) => {
    console.log(`Socket ${socket.id} joined board ${boardId}`);
    socket.join(boardId);
  });

  socket.on("leaveBoard", (boardId) => {
    socket.leave(boardId);
    console.log(`Socket ${socket.id} left board ${boardId}`);
  });

  socket.on('disconnect', () =>
    console.log('Client disconnected: ', socket.id)
  );
});


const PORT = process.env.PORT;

server.listen(PORT, () =>
  console.log(`Backend running on port ${PORT}`)
);
