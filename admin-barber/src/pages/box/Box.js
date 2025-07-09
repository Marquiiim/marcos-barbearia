import styles from '../../sass/box/Box.module.css'

function Box() {

    return (
        <section className={styles.container}>
            <ul className={styles.content}>
                <li>
                    <span>
                        Lucro diário:
                    </span>
                    <span>
                        23123
                    </span>
                </li>
                <li>
                    <span>
                        Lucro semanal:
                    </span>
                    <span>
                        12341
                    </span>
                </li>
                <li>
                    <span>
                        Lucro anual:
                    </span>
                    <span>
                        8776
                    </span>
                </li>
            </ul>
        </section>
    )
}

export default Box