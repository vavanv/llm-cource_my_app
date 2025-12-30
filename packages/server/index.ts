import express from 'express';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (_: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello world' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
