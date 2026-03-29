import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Pricing from './Pricing';
import AMLCheck from './Amlcheck'
import Faq from './Faq';
import Contact from './Contact';
import Check from './Check';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        {/* This is your "Home" page */}
        <Route path="/" element={<AMLCheck />} />
        
        {/* This is your "Pricing" page */}
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contacts" element={<Contact />} />
        <Route path="/check" element={<Check />} />
      </Routes>
    </BrowserRouter>
    // <AMLCheck/>
  )
}

export default App
