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
    <nav className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Hexagon className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Morphic
            </span>
          </Link>

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
                        to="/product"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        Morphic-AI
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/docs" className="text-gray-300 hover:text-white transition-colors">
              Docs
            </Link>

            <Link
              to="/signin"
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;