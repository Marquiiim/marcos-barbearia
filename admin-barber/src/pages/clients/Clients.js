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

    return (
        <section className={styles.container}>
            <div className={styles.content}>
                <ul>
                    {Agendamentos.length > 0 ? (
                        Agendamentos.map(Agendamento =>
                            <li key={Agendamento.nome}>
                                <span>{Agendamento.nome}</span>
                                <ul>
                                    <li data-label="Tipo de corte:">{Agendamento.corte}</li>
                                    <li data-label="Extra:">{Agendamento.extra}</li>
                                    <li data-label="Data:">{Agendamento.dia_formatado} - {Agendamento.horario}</li>
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
                        )) : (
                        <div class="alert alert-danger" role="alert">
                            Sem cortes no momento, aguardando agendamentos.
                        </div>
                    )}
                </ul>
            </div>
        </section>
    )
}

export default Clients