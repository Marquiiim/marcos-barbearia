import styles from '../../sass/clients/Clients.module.css'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState, useEffect } from 'react'
import axios from 'axios'

function Clients() {

    const [Agendamentos, setAgendamentos] = useState([])

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/pendentes')
                setAgendamentos(response.data)
                console.log(response.data)
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error)
            }
        }
        fetchAgendamentos()
    }, [])

    const checkCompleted = async (nome) => {
        try {
            const response = await axios.post(`http://localhost:5001/api/concluido/${nome}`)
            setAgendamentos(prev => prev.filter(ag => ag.nome !== nome))
            console.log(response.data)
        } catch (error) {
            console.error("Error ao concluir agendamento:", error)
        }
    }

    const formatDateTime = (dateStr, timeStr) => {
            const date = new Date(`${dateStr}T${timeStr}`)
            return format(date, "dd/MM/yyyy HH:mm", {locale: ptBR})
    }

    return (
        <section className={styles.container}>
            <div className={styles.content}>
                <ul>
                    {Agendamentos.map(Agendamento =>
                        <li key={Agendamento.nome}>
                            <span>{Agendamento.nome}</span>
                            <ul>
                                <li data-label="Tipo de corte:">{Agendamento.corte}</li>
                                <li data-label="Extra:">{Agendamento.extra}</li>
                                <li data-label="Data:">{formatDateTime(Agendamento.dia, Agendamento.horario)}</li>
                                <div className={styles.actions}>
                                    <button className={`${styles.btn} ${styles['btn-success']}`}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            checkCompleted(Agendamento.nome)
                                        }}
                                    >
                                        Concluído
                                    </button>
                                    <button className={`${styles.btn} ${styles['btn-warning']}`}>
                                        Não compareceu
                                    </button>
                                    <button className={`${styles.btn} ${styles['btn-danger']}`}>
                                        Excluir
                                    </button>
                                </div>
                            </ul>
                        </li>
                    )}
                </ul>
            </div>
        </section>
    )
}

export default Clients