import { Link } from "react-router-dom"
import '../sass/layout/Navbar.css'

function Navbar() {

    return (
        <nav>
            <ul>
                <li>
                    <Link to='/'>
                        Inicio
                    </Link>
                </li>
                <li>
                    <Link to='/servicos'>
                        Serviços
                    </Link>
                </li>
                <li>
                    <Link to='/agendar'>
                        Agendar
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar