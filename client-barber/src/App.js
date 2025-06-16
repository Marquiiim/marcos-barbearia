import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from './layouts/Navbar'
import Home from './pages/home/Home'
import Servicos from './pages/servicos/Servicos'
import Agendar from './pages/agendar/Agendar'

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/agendar" element={<Agendar />} />
      </Routes>
    </Router>
  );
}

export default App;
