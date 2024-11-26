import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Network, Lock, Users, Share2 } from 'lucide-react';
import PageBackground from '../components/PageBackground';

const MorphicKMS: React.FC = () => {
    const features = [
        {
            title: 'Decentralized Key Management',
            description: 'Distribute key management across multiple TEE nodes using threshold signatures',
            icon: Key
        },
        {
            title: 'Secure Enclaves',
            description: 'Leverage hardware-based TEE for maximum security guarantees',
            icon: Shield
        },
        {
            title: 'Multi-Party Computation',
            description: 'Advanced MPC protocols for distributed key generation and signing',
            icon: Network
        }
    ];

    const architectureComponents = [
        {
            title: 'TEE Network',
            description: 'A network of trusted execution environments providing secure computation',
            icon: Lock
        },
        {
            title: 'Threshold Signatures',
            description: 't-of-n signature scheme for distributed key management',
            icon: Users
        },
        {
            title: 'Key Sharding',
            description: 'Secure key distribution across multiple nodes',
            icon: Share2
        }
    ];

    return (
        <div className="pt-20 min-h-screen bg-gray-900">
            <PageBackground />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-morphic-primary via-morphic-accent to-morphic-light bg-clip-text text-transparent mb-6">
                        Morphic KMS
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        A decentralized key management system powered by trusted execution environments and threshold cryptography
                    </p>

                    {/* Features */}
                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-gray-800 rounded-lg p-8 hover:bg-gray-750 transition-colors text-center"
                            >
                                <feature.icon className="h-12 w-12 text-morphic-primary mx-auto mb-6" />
                                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                                <p className="text-gray-300">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Architecture Overview */}
                    <div className="mt-24">
                        <h2 className="text-3xl font-bold text-white mb-12">System Architecture</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {architectureComponents.map((component, index) => (
                                <motion.div
                                    key={component.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    className="bg-gray-800/50 rounded-lg p-6 text-left"
                                >
                                    <div className="flex items-center mb-4">
                                        <component.icon className="h-6 w-6 text-morphic-primary mr-3" />
                                        <h3 className="text-lg font-semibold text-white">{component.title}</h3>
                                    </div>
                                    <p className="text-gray-300">{component.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Technical Details */}
                    <div className="mt-24 text-left">
                        <h2 className="text-3xl font-bold text-white mb-8">Technical Details</h2>
                        <div className="bg-gray-800/50 rounded-xl p-8">
                            <h3 className="text-xl font-semibold text-white mb-4">Threshold Signature Scheme</h3>
                            <p className="text-gray-300 mb-6">
                                Our system implements a t-of-n threshold signature scheme where keys are distributed across multiple TEE nodes. 
                                This ensures that no single node has access to the complete key material, enhancing security through decentralization.
                            </p>
                            
                            <h3 className="text-xl font-semibold text-white mb-4">TEE Integration</h3>
                            <p className="text-gray-300 mb-6">
                                Each node in the network operates within a Trusted Execution Environment, providing hardware-level isolation 
                                and attestation capabilities. This ensures the integrity of computations and protects sensitive key material.
                            </p>

                            <h3 className="text-xl font-semibold text-white mb-4">Key Management Protocol</h3>
                            <p className="text-gray-300">
                                The system employs advanced multi-party computation protocols for key generation, signing, and rotation. 
                                All operations are performed in a distributed manner, maintaining security even if some nodes are compromised.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MorphicKMS; 