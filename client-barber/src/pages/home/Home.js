import { Link } from 'react-router-dom'

import styles from '../../sass/pages/Home.module.css'
import LogoBarber from '../../images/MarcosBarbearia.png'

function Home() {

    return (
        <section className={styles.container}>
            <div className={styles.content}>
                <div className={styles.content_logo}>
                    <img src={LogoBarber} alt='Logo Marcos Barbearia' />
                </div>
                <div className={styles.content_frase}>
                    <p>
                        Estilo que fala por você.
                    </p>
                </div>
                <Link to='/agendar' className={styles.button_agendar}>
                    <button>
                        Agendar agora
                    </button>
                </Link>
            </div>
        </section>
    )
}

export default Home