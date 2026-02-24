require('dotenv').config();

const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const mongoString = process.env.DATABASE_URL

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
const routes = require('./routes');

app.use(express.json());
app.use(cors());

app.use('/api', routes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})