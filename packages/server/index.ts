import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';

const app = express();
app.use(express.json());

app.get('/', (_: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello world' });
});

app.post('/api/chat', chatController.sendMessage);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
