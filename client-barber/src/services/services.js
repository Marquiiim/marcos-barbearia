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

    const sql = 'SELECT DATE_FORMAT(data, "%Y-%m-%d") as data FROM pendentes WHERE data >= CURDATE() GROUP BY data';

    pool.query(sql, (err, result) => {

        if (err) {
            console.error('Error na query:', err)
            return res.status(500).json({ error: 'Error no servidor.' })
        }

        const datas = result.map(item =>
            new Date(item.data).toISOString().split('T')[0]
        );

        res.json(datas)
    })
})


app.post('/api/dados', (req, res) => {

    const { nome, corte, extra, data, horario } = req.body

    if (!nome || !corte || !data || !horario) return res.status(400).json({ error: 'Dados incompletos!' })

    pool.query('INSERT INTO pendentes (nome, corte, extra, data, horario) values (?, ?, ?, ?, ?)', [nome, corte, extra, data, horario], (err, result) => {

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