const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.get('/api/dados', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT DATE_FORMAT(dia, "%Y-%m-%d") as dia, horario FROM pendentes WHERE dia >= CURDATE()'
        );
        res.json(rows);
    } catch (err) {
        console.error('Erro na consulta:', err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

app.post('/api/dados', async (req, res) => {
    const { nome, corte, extra, dia, horario } = req.body;

    if (!nome || !corte || !dia || !horario) {
        return res.status(400).json({ error: 'Dados incompletos' });
    }

    try {
        const [existing] = await pool.query(
            'SELECT * FROM pendentes WHERE dia = ? AND horario = ?',
            [dia, horario]
        );

        if (existing.length > 0) {
            return res.status(409).json({ error: 'Horário já agendado' });
        }

        const [result] = await pool.query(
            'INSERT INTO pendentes (nome, corte, extra, dia, horario) VALUES (?, ?, ?, ?, ?)',
            [nome, corte, extra || null, dia, horario]
        );

        res.json({
            success: true,
            message: 'Agendamento realizado com sucesso',
            id: result.insertId
        });

    } catch (err) {
        console.error('Erro no MySQL:', err.message);
        res.status(500).json({ error: 'Erro ao processar agendamento' });
    }
});

app.listen(5000, () => {
    console.log('Servidor rodando na porta 5000');
});