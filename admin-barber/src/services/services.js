const express = require('express')
const mysql2 = require('mysql2/promise')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

const pool = mysql2.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

app.get('/api/pendentes', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
            nome,
            corte,
            extra,
            DATE_FORMAT(dia, '%d/%m/%Y') AS dia_formatado,
            horario
            FROM pendentes`
        )
        res.json(rows)
    } catch (err) {
        console.error('Error na consulta:', err)
        res.status(500).json({ error: 'Erro no servidor' })
    }
})

app.get('/api/concluidos', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
            nome,
            corte,
            extra,
            DATE_FORMAT(dia, '%d/%m/%Y') AS dia_formatado,
            horario
            FROM concluidos`
        )
        res.json(rows)
    } catch (err) {
        console.error('Error na consulta:', err)
        res.status(500).json({ error: 'Erro no servidor' })
    }
})

app.post('/api/concluido/:nome', async (req, res) => {
    const { nome } = req.params
    let connection

    try {
        connection = await pool.getConnection()
        await connection.beginTransaction()

        await connection.query(
            `INSERT INTO concluidos (nome, corte, extra, dia, horario)
            SELECT nome, corte, extra, dia, horario FROM PENDENTES WHERE nome = ?`, [nome]
        )

        await connection.query(
            `DELETE FROM PENDENTES WHERE nome = ?`, [nome]
        )

        await connection.commit()

        res.json({ success: true, message: `Registro '${nome}' concluído com sucesso!` })
    } catch (err) {
        if (connection) await connection.rollback()
        console.error('Erro na transação de dados:', err)
        res.status(500).json({ error: 'Falha ao processar a conclusão' })
    } finally {
        if (connection) connection.release()
    }
})


app.listen(5001, () => {
    console.log('Servidor rodando na porta 5001')
})