import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import expressLayouts from 'express-ejs-layouts';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB verbonden'))
    .catch(err => console.error('❌ MongoDB fout:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', taskRoutes);
app.use('/', authRoutes);

app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});