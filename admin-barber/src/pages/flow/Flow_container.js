import styles from '../../sass/flow/Flow_container.module.css'
import Barbearia from '../../images/MarcosBarbearia.png'

import Clients from '../clients/Clients'
import Box from '../box/Box'

function Flow_container() {

    return (
        <section>
            <div className={styles.left_info}>
                <Clients />
            </div>
            <div className={styles.right_info}>
                <Box />
                <img src={Barbearia} alt='Imagem Barbearia' />
            </div>
        </section>
    )
}

export default Flow_container