import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [tosMenuOpen, setTosMenuOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <nav className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/images/morphic-logo-sm.png"
                alt="Morphic"
              />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-morphic-primary to-morphic-secondary bg-clip-text text-transparent">
                Morphic
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>

            <div className="relative" onMouseEnter={() => setTosMenuOpen(true)} onMouseLeave={() => setTosMenuOpen(false)}>
              <button className="flex items-center text-gray-300 hover:text-white transition-colors">
                TOS <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <AnimatePresence>
                {tosMenuOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={menuVariants}
                    className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5"
                  >
                    <div className="py-1">
                      <Link
                        to="/tos-services"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        TOS Services
                      </Link>
                      <Link
                        to="/tos-operators"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        TOS Operators
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" onMouseEnter={() => setProductMenuOpen(true)} onMouseLeave={() => setProductMenuOpen(false)}>
              <button className="flex items-center text-gray-300 hover:text-white transition-colors">
                Product <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <AnimatePresence>
                {productMenuOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={menuVariants}
                    className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5"
                  >
                    <div className="py-1">
                      <Link
                        to="/morphic-ai"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        Morphic-AI
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/developer" className="text-gray-300 hover:text-white transition-colors">
              Developer
            </Link>

            <Link to="/docs" className="text-gray-300 hover:text-white transition-colors">
              Docs
            </Link>

            <div className="flex items-center">
              <Link
                to="/signin"
                className="ml-8 px-4 py-2 rounded-lg bg-gradient-to-r from-morphic-primary to-morphic-accent text-white hover:from-morphic-accent hover:to-morphic-primary transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;