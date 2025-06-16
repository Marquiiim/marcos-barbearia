import { Link } from "react-router-dom"

import styles from '../../sass/pages/Servicos.module.css'

const ServiceItem = ({ name }) => (
    <li>
        {name}
        <div>
            <Link to='/agendar'>
                <button aria-label={`Agendar serviço de ${name}`}>
                    Agendar agora
                </button>
            </Link>
        </div>
    </li>
)

function Servicos() {

    const courteousServices = [
        "Apenas corte",
        "Corte e bigode",
        "Corte e sobrancelha",
        "Corte e cavanhaque",
        "Corte, barba e sobrancelha",
        "Corte e barba completa"
    ]

    const extrasServices = [
        "Pigmentação",
        "Limpeza facial",
        "Acabamento"
    ]

    return (
        <section className={styles.container}>
            <div className={styles.content}>
                <div className={styles.services_courteous}>
                    <h1>
                        Serviços de corte
                    </h1>

                    <ul>
                        {courteousServices.map(service => (
                            <ServiceItem key={service} name={service} />
                        ))}
                    </ul>
                </div>

                <div className={styles.services_extras}>
                    <h1>
                        Serviços extras
                    </h1>

                    <ul>
                        {extrasServices.map(service => (
                            <ServiceItem key={service} name={service} />
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default Servicos