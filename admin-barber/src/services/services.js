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
            horario,
            id
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
            horario,
            id
            FROM concluidos`
        )
        res.json(rows)
    } catch (err) {
        console.error('Error na consulta:', err)
        res.status(500).json({ error: 'Erro no servidor' })
    }
})

app.post('/api/concluido/:id', async (req, res) => {
    const { id } = req.params
    let connection

    try {
        connection = await pool.getConnection()
        await connection.beginTransaction()

        await connection.query(
            `INSERT INTO concluidos (nome, corte, extra, dia, horario, id)
            SELECT nome, corte, extra, dia, horario, id FROM PENDENTES WHERE id = ?`, [id]
        )

        await connection.query(
            `DELETE FROM PENDENTES WHERE id = ?`, [id]
        )

        await connection.commit()

        res.json({ success: true, message: `Registro transferido com sucesso!` })
    } catch (err) {
        if (connection) await connection.rollback()
        console.error('Erro na transação de dados:', err)
        res.status(500).json({ error: 'Falha ao processar a conclusão' })
    } finally {
        if (connection) connection.release()
    }
})

app.delete('/api/pendentes/:id', async (req, res) => {
    try {
        const { id } = req.params

        const [result] = await connection.query(
            'DELETE FROM pendentes WHERE id = ?', [id]
        )

        res.json({ message: 'Item deletado com sucesso!' })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar o item', error })
    }
})

app.listen(5001, () => {
    console.log('Servidor rodando na porta 5001')
})