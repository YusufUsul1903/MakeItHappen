import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  // Verwijder de '..' (indien die er stonden) en zorg dat het naar de juiste views map wijst
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/log-in', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'log-in.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'forgot-password.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
