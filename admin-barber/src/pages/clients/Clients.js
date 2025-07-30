import styles from '../../sass/clients/Clients.module.css'

import { useState, useEffect } from 'react'
import axios from 'axios'

function Clients() {

    const [Agendamentos, setAgendamentos] = useState([])

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/pendentes')
                setAgendamentos(response.data)
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error)
            }
        }
        fetchAgendamentos()
    }, [])

    const checkCompleted = async (id) => {
        try {
            const response = await axios.post(`http://localhost:5001/api/concluido/${id}`)

            if (response.data.success) {
                setAgendamentos(prev => prev.filter(ag => ag.id !== id))
                alert('Agendamento concluído e transferido com sucesso!')
            } else {
                alert('Falha ao excluir: ' + (response.data.error || 'Erro desconhecido'))
            }
        } catch (error) {
            console.error("Error ao concluir agendamento:", error)
        }
    }

    const deleteSchedule = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5001/api/pendentes/${id}`)

            if (response.data.success) {
                setAgendamentos(prev => prev.filter(ag => ag.id !== id))
                alert('Agendamento concluído com sucesso!')
            } else {
                alert('Falha ao excluir: ' + (response.data.error || 'Erro desconhecido'))
            }
        } catch (error) {
            console.error("Error ao excluir agendamento:", error)
            alert('Erro ao excluir o agendamento. Verifique o console para detalhes.')
        }
    }

    return (
        <section className={styles.container}>
            <div className={styles.content}>
                <ul>
                    {Agendamentos.length > 0 ? (
                        Agendamentos.map(Agendamento =>
                            <li key={Agendamento.id}>
                                <span>{Agendamento.nome}</span>
                                <ul>
                                    <li data-label="Tipo de corte:">{Agendamento.corte}</li>
                                    <li data-label="Extra:">{Agendamento.extra}</li>
                                    <li data-label="Data:">{Agendamento.dia_formatado} - {Agendamento.horario}</li>
                                    <div className={styles.actions}>
                                        <button className={`${styles.btn} ${styles['btn-success']}`}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                checkCompleted(Agendamento.id)
                                            }}
                                        >
                                            Concluído
                                        </button>
                                        <button className={`${styles.btn} ${styles['btn-warning']}`}>
                                            Não compareceu
                                        </button>
                                        <button className={`${styles.btn} ${styles['btn-danger']}`}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                deleteSchedule(Agendamento.id)
                                            }}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </ul>
                            </li>
                        )) : (
                        <div className="alert alert-danger" role="alert">
                            Sem cortes no momento, aguardando agendamentos.
                        </div>
                    )}
                </ul>
            </div>
        </section>
    )
}

export default Clients