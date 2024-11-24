import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Lock } from 'lucide-react';

const Product = () => {
  const features = [
    {
      title: 'Advanced AI Processing',
      description: 'State-of-the-art machine learning algorithms for intelligent data processing',
      icon: Brain
    },
    {
      title: 'Real-time Analysis',
      description: 'Lightning-fast processing with immediate insights',
      icon: Zap
    },
    {
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and security protocols',
      icon: Lock
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-morphic-primary to-morphic-accent bg-clip-text text-transparent mb-6">
            Morphic AI
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Next-generation artificial intelligence platform for enterprise solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-800 rounded-lg p-8 hover:bg-gray-750 transition-colors text-center"
            >
              <feature.icon className="h-12 w-12 text-cyan-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <button className="px-8 py-3 rounded-full bg-cyan-400 hover:bg-cyan-500 text-white font-semibold transition-colors">
            Get Started with Morphic AI
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Product;