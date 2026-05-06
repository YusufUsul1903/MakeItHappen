import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Log elke aanvraag om te zien of de server überhaupt iets doet
app.use((req, res, next) => {
  console.log(`Aanvraag ontvangen voor: ${req.url}`);
  next();
});

// Statische bestanden (CSS, JS, Images)
// Dit zorgt dat /css/styles.css wordt gezocht in __dirname/public/css/styles.css
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'views', 'index.html');
  console.log(`Bestand verzenden: ${indexPath}`);
  res.sendFile(indexPath);
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

// Error handling voor als een route niet bestaat
app.use((req, res) => {
  res.status(404).send('Pagina niet gevonden. Controleer je mappenstructuur.');
});

app.listen(port, () => {
  console.log(`Server succesvol gestart op http://localhost:${port}`);
  console.log(`Huidige map (__dirname): ${__dirname}`);
});