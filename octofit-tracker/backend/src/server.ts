import express from 'express';
import { connectDatabase } from './config/database.js';
import apiRouter from './routes/api.js';

const app = express();
const port = Number(process.env.PORT) || 8000;

app.use(express.json());

app.use((_request, response, next) => {
  response.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  response.header('Access-Control-Allow-Headers', 'Content-Type');
  response.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (_request.method === 'OPTIONS') return response.sendStatus(204);
  next();
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'octofit-api', database: 'connected' });
});

app.use('/api', apiRouter);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ error: 'Internal server error' });
});

connectDatabase()
  .then(() => {
    app.listen(port, () => console.log(`OctoFit API listening on port ${port}`));
  })
  .catch((error) => {
    console.error('Unable to start API:', error);
    process.exit(1);
  });