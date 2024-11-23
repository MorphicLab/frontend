import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div 
      className="min-h-screen relative flex items-center justify-center"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-4"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.02, 1],
            rotate: [0, 1, -1, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="inline-block mb-6"
        >
          <Sparkles className="h-16 w-16 text-blue-500" />
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Welcome to Morphic
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8">
          Transform your digital experience with next-generation AI technology
        </p>
        
        <motion.div 
          className="flex flex-col md:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors">
            Get Started
          </button>
          <button className="px-8 py-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-colors">
            Learn More
          </button>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </div>
  );
};

export default Home;