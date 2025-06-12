import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from './layouts/Navbar'
import Home from './pages/home/Home'

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicos" element='' />
        <Route path="/agendar" element='' />
      </Routes>
    </Router>
  );
}

export default App;
