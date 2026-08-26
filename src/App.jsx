import { useEffect } from 'react';
import {BrowserRouter,Routes,Route,useLocation} from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import MembersDashboard from './components/MembersDashboard';
import FullDetails from './components/FullDetails.jsx';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Chatbot from './pages/Chatbot';

import './styles/globals.css';
import './styles/animations.css';

function ScrollToTop(){const { pathname } = useLocation();
useEffect(() => {window.scrollTo(0, 0);}, [pathname]);
return null;
}

export default function App() {
return (
<BrowserRouter>
<ScrollToTop />
<Navbar />
<Routes>

<Route path="/" element={<Home />}/>
<Route path="/MembersDashboard" element={<MembersDashboard />}/>
<Route path="/FullDetails" element={<FullDetails />}/>
<Route path="/about" element={<About />}/>
<Route path="/services" element={<Services />}/>
<Route path="/contact" element={<Contact />}/>
<Route path="/chatbot" element={<Chatbot />}/>
<Route path="*" element={<Home />}/>
</Routes>
</BrowserRouter>
);
}