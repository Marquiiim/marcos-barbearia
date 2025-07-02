const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

require('dotenv').config()

const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json())

const pool = mysql.createPool({

    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

})

pool.getConnection((err) => {

    if (err) {
        console.error('Error ao conectar no MySQL:', err.message)
        process.exit(1)
    }

    console.log('Conectando ao MySQL!')

})


pool.on('error', (err) => {

    console.error('Error no Pool MySQL:', err)

    if (err.code == 'PROTOCOL_CONECTION_LOST') {
        console.log('Reconectando...')

    } else {
        throw err
    }
})


app.get('/api/dados', (req, res) => {
    const sql = 'SELECT DATE_FORMAT(dia, "%Y-%m-%d") as dia, horario FROM pendentes WHERE dia >= CURDATE()';

    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Error na query:', err);
            return res.status(500).json({ error: 'Error no servidor.' });
        }

        res.json(result);
    });
});


app.post('/api/dados', async (req, res) => {
    const { nome, corte, extra, dia, horario } = req.body;

    if (!nome || !corte || !dia || !horario) {
        return res.status(400).json({ error: 'Dados incompletos!' });
    }

    try {
        const [existing] = await pool.query(
            'SELECT * FROM pendentes WHERE dia = ? AND horario = ?',
            [dia, horario]
        );

        if (existing.length > 0) {
            return res.status(409).json({ error: 'Horário já agendado!' });
        }

        await pool.query(
            'INSERT INTO pendentes (nome, corte, extra, dia, horario) VALUES (?, ?, ?, ?, ?)',
            [nome, corte, extra, dia, horario]
        );

        res.json({ message: 'Agendamento realizado com sucesso!' });
    } catch (err) {
        console.error('Erro no MySQL:', err);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.listen(5000, () => {
    console.log('Servidor rodando na porta 5000')
})