import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TosServices from './pages/TosServices';
import TosOperators from './pages/TosOperators';
import TosDetail from './pages/TosDetail';
import Product from './pages/Product';
import Docs from './pages/Docs';
import SignIn from './pages/SignIn';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tos-services" element={<TosServices />} />
          <Route path="/tos-services/:id" element={<TosDetail />} />
          <Route path="/tos-operators" element={<TosOperators />} />
          <Route path="/product" element={<Product />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;