import React from 'react';
import { motion } from 'framer-motion';
import { Book, Code, Terminal, FileText } from 'lucide-react';
import PageBackground from '../components/PageBackground';

const Docs = () => {
  const sections = [
    {
      title: 'Quick Start Guide',
      description: 'Get up and running with Morphic in minutes',
      icon: Book
    },
    {
      title: 'API Reference',
      description: 'Complete API documentation with examples',
      icon: Code
    },
    {
      title: 'CLI Documentation',
      description: 'Command-line interface usage and commands',
      icon: Terminal
    },
    {
      title: 'Integration Guides',
      description: 'Step-by-step guides for integrating Morphic',
      icon: FileText
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      <PageBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Documentation</h1>
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-gray-300 text-lg">
              Everything you need to know about implementing and using Morphic in your projects.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer"
              >
                <section.icon className="h-8 w-8 text-cyan-300 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{section.title}</h3>
                <p className="text-gray-300">{section.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 p-6 bg-gray-800 rounded-lg"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Need Help?</h3>
            <p className="text-gray-300 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <button className="px-6 py-2 bg-cyan-400 hover:bg-cyan-500 text-white rounded-md transition-colors">
              Contact Support
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Docs;