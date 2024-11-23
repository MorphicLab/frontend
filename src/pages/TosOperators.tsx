import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Clock } from 'lucide-react';

const TosOperators = () => {
  const operatorGuidelines = [
    {
      title: 'Operator Responsibilities',
      description: 'Guidelines for maintaining service quality and user trust',
      icon: Users
    },
    {
      title: 'Security Protocols',
      description: 'Required security measures and compliance standards',
      icon: Shield
    },
    {
      title: 'Service Hours',
      description: 'Operating hours and availability requirements',
      icon: Clock
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Operator Guidelines</h1>
          <p className="text-gray-300 text-lg mb-12">
            Essential information for Morphic platform operators to ensure consistent service delivery and maintain our high standards.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {operatorGuidelines.map((guideline, index) => (
              <motion.div
                key={guideline.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
              >
                <guideline.icon className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{guideline.title}</h3>
                <p className="text-gray-300">{guideline.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TosOperators;