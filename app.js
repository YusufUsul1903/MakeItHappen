import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import expressLayouts from 'express-ejs-layouts';

import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', taskRoutes);     
app.use('/', authRoutes);     

app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});