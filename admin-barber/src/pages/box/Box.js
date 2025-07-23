import { useState, useEffect } from 'react'
import axios from 'axios'

import styles from '../../sass/box/Box.module.css'

function Box() {

    const [AgendamentosConcluidos, setAgendamentosConcluidos] = useState([])
    const [profit, setProfit] = useState(0)

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/concluidos')
                setAgendamentosConcluidos(response.data)
                setProfit(calculateProfit(response.data.length))
                console.log(response.data)
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error)
                setProfit(0)
            }
        }
        fetchAgendamentos()
    }, [])

    const calculateProfit = (quantity) => {
        return quantity * 35
    }

    return (
        <section className={styles.container}>
            <div className={styles.content}>
                <span>
                    Lucro atual:
                </span>
                <span>
                    R$ {profit.toLocaleString('pt-BR')}
                </span>
            </div>
        </section>
    )
}

export default Box