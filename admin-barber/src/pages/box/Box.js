import { useState, useEffect } from 'react'
import axios from 'axios'

import styles from '../../sass/box/Box.module.css'

function Box() {

    const [profit, setProfit] = useState(0)

    const courteousPrice = {
        'Apenas Corte': 35,
        'Corte e Bigode': 40,
        'Corte e Sobrancelha': 45,
        'Corte e Cavanhaque': 45,
        'Corte, Barba e Sobrancelha': 70,
        'Corte e Barba Completa': 60
    }

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/concluidos')

                const total = response.data.reduce((sum, agendamento) => {
                    const servico = agendamento.corte
                    return sum + courteousPrice[servico]
                })

                setProfit(total)
                console.log(profit)
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error)
                setProfit(0)
            }
        }
        fetchAgendamentos()
    }, [])


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