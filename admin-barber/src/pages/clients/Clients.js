import styles from '../../sass/clients/Clients.module.css'

function Clients() {

    return (
        <section className={styles.container}>
            <div className={styles.content}>
                <ul>
                    <li>
                        <span>João Silva</span>
                        <ul>
                            <li data-label="Tipo de corte:">Corte e Barba Completa</li>
                            <li data-label="Extra:">Pigmentação</li>
                            <li data-label="Data:">15/07/2023 - 14:30</li>
                            <div className={styles.actions}>
                                <button className={`${styles.btn} ${styles['btn-success']}`}>
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

                    <li>
                        <span>João Silva</span>
                        <ul>
                            <li data-label="Tipo de corte:">Corte e Barba Completa</li>
                            <li data-label="Extra:">Pigmentação</li>
                            <li data-label="Data:">15/07/2023 - 14:30</li>
                            <div className={styles.actions}>
                                <button className={`${styles.btn} ${styles['btn-success']}`}>
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

                    <li>
                        <span>João Silva</span>
                        <ul>
                            <li data-label="Tipo de corte:">Corte e Barba Completa</li>
                            <li data-label="Extra:">Pigmentação</li>
                            <li data-label="Data:">15/07/2023 - 14:30</li>
                            <div className={styles.actions}>
                                <button className={`${styles.btn} ${styles['btn-success']}`}>
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
                </ul>
            </div>
        </section>
    )
}

export default Clients