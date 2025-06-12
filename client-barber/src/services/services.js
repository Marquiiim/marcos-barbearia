const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

require('dotenv').config()

const app = express()
app.use(cors())
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

    const sql = 'SELECT * FROM pendentes'

    pool.query(sql, (err, result) => {

        if (err) {
            console.error('Error na query:', err)
            return res.status(500).json({ error: 'Error no servidor.' })
        }

        res.json(result)
    })
})


app.post('/api/dados', (req, res) => {

    const { nome, corte, extra, dia, horario } = req.body

    pool.query('INSERT INTO pendentes (nome, corte, extra, dia, horario) values (?, ?, ?, ?, ?)', [nome, corte, extra, dia, horario], (err, result) => {

        if (err) {

            if (err.code == 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Corte já agendado.' })

            }

            console.error('Error no MySQL:', err)

            return res.status(500).json({ error: 'Erro interno no servidor.' })

        }
        res.json({ message: 'Dados inseridos com sucesso!' })
    })
})

app.listen(5000, () => {
    console.log('Servidor rodando na porta 5000')
})