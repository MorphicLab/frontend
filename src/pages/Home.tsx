import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, FormEvent, useEffect, useRef, useCallback } from 'react';
import features from '../config/features';
import emailjs from 'emailjs-com';
import emailjsConfig from '../config/emailjs';
import socialMedia from '../config/socialMedia';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

  /**
   * Home page component.
   * 
   * This component renders the home page, with a background image, 
   * a Morphic logo, a title, a description, buttons to navigate,
   * and a waiting list signup form.
   * 
   * The component uses Framer Motion to animate the elements.
   * The animation is a fade-in and a slide-up from the bottom.
   * 
   * @returns The home page component.
   */
const Home = () => {
  const navigate = useNavigate();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Handle form submission with real email sending
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Prepare template parameters for EmailJS
      const templateParams = {
        from_name: name || 'Anonymous User',
        to_email: emailjsConfig.defaultRecipient,
        user_email: email,
        project_name: projectName || 'Not specified',
        message: description || 'No description provided',
        subscribed: isSubscribed ? 'Yes' : 'No'
      };
      
      console.log('Sending email with params:', templateParams);
      
      // Send email using EmailJS
      const response = await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        templateParams
      );
      
      console.log('Email sent successfully:', response);
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setName('');
      setEmail('');
      setProjectName('');
      setDescription('');
      setIsSubscribed(false);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to send email. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(emailjsConfig.userId);
  }, []);

  // Reference to the waiting list section for scrolling
  const waitingListRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll to waiting list section
  const scrollToWaitingList = () => {
    waitingListRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Particles initialization
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);
  
  // Particles loaded callback
  const particlesLoaded = useCallback(async () => {
    console.log('Particles loaded');
  }, []);
  
  // SVG background elements
  const svgElements = [
    { id: 'blockchain', path: '/images/svg/blockchain.svg', position: 'top-10 right-10', size: 'w-32 h-32' },
    { id: 'ai-neural', path: '/images/svg/ai-neural.svg', position: 'bottom-20 left-10', size: 'w-36 h-36' },
    { id: 'defi', path: '/images/svg/defi.svg', position: 'top-20 left-20', size: 'w-32 h-32' },
    { id: 'trustless', path: '/images/svg/trustless.svg', position: 'bottom-10 right-20', size: 'w-36 h-36' }
  ];

  return (
    <div className="relative flex flex-col items-center">
      {/* High-tech animated background with particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        className="fixed inset-0"
        options={{
          background: {
            color: {
              value: '#0d1117',
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: ['#46dce1', '#2dc3c8', '#b4f0f5'],
            },
            links: {
              color: '#46dce1',
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: {
                default: 'bounce',
              },
              random: true,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60, // Reduced for better performance
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: ['circle', 'triangle', 'polygon', 'square'],
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
      
      {/* Advanced circuit pattern overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <object 
          type="image/svg+xml" 
          data="/images/svg/circuit-pattern.svg" 
          className="w-full h-full"
          aria-hidden="true"
        />
      </div>
      
      {/* Thematic SVG elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {svgElements.map((element) => (
          <motion.div 
            key={element.id}
            className={`absolute ${element.position} ${element.size} opacity-70`}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.4, 0.7, 0.4],
              scale: [0.95, 1.05, 0.95],
              rotate: element.id === 'blockchain' ? [0, 5, 0] : 
                     element.id === 'ai-neural' ? [0, -5, 0] : 0
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: 'easeInOut',
              times: [0, 0.5, 1]
            }}
          >
            <object
              type="image/svg+xml"
              data={element.path}
              className="w-full h-full"
              aria-hidden="true"
            />
          </motion.div>
        ))}
      </div>
      
      {/* Enhanced glowing orbs for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-morphic-primary/10 filter blur-3xl"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full bg-morphic-accent/10 filter blur-3xl"
          animate={{
            x: [0, -70, 70, 0],
            y: [0, 70, -70, 0],
            scale: [1, 0.8, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>
      
      {/* Hero Section - Full height with vertical centering */}
      <section className="relative min-h-screen w-full flex items-center justify-center pt-16 px-4">

      {/* No need for overlay div as we have a new background */}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-4"
      >
        <div className="relative w-32 h-32 mx-auto mb-6">
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
            className="w-full h-full"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img 
              src="/images/morphic-logo-sm.png" 
              alt="Morphic"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 0 transparent)',
                WebkitFilter: 'drop-shadow(0 0 0 transparent)',
              }}
            />
          </motion.div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-morphic-primary to-morphic-accent bg-clip-text text-transparent">
          Trustlessness as a Service
        </h1>
        
        <p className="text-xl md:text-1xl text-gray-300 max-w-2xl mx-auto mb-8">
          Make your service trustless, with even lower operation cost
        </p>
        
        <motion.div 
          className="flex flex-col md:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {features.SHOW_ALL_PAGES && (
            <>
              <button 
                onClick={() => navigate('/tos-services')} 
                className="px-8 py-3 rounded-full bg-cyan-400 hover:bg-cyan-500 text-white font-semibold transition-colors"
              >
                Explore More
              </button>
              <button 
                onClick={() => navigate('/docs')} 
                className="px-8 py-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-colors"
              >
                Learn More
              </button>
            </>
          )}
          {!features.SHOW_ALL_PAGES && (
            <button 
              className="px-8 py-3 rounded-full bg-cyan-400 hover:bg-cyan-500 text-white font-semibold transition-colors"
              onClick={scrollToWaitingList}
            >
              Join Waiting List
            </button>
          )}
        </motion.div>
      </motion.div>

      </section>
      
      {/* Product Concept Section - Visualizing Morphic's Trustless Transformation */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center py-24 px-4 border-t border-gray-800/50">
        {/* Subtle background for the product concept section */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm"></div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-6xl mx-auto px-4 text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-morphic-primary to-morphic-accent bg-clip-text text-transparent">
            Transform Your App into a Trustless Service
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Deploy your containerized application to Morphic's blockchain network powered by Trusted Execution Environment (TEE) nodes
          </p>
        </motion.div>
        
        {/* Visualization of the transformation process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
        >
          {/* Step 1: Containerized App */}
          <motion.div 
            className="bg-gray-900/60 backdrop-blur-md rounded-xl p-8 border border-gray-800 flex flex-col items-center text-center"
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(70, 220, 225, 0.1)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-24 h-24 mb-6 relative">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-full h-full"
              >
                <svg viewBox="0 0 24 24" className="w-full h-full text-morphic-primary">
                  <path fill="currentColor" d="M21,18H3V6H21M21,4H3A2,2 0 0,0 1,6V18A2,2 0 0,0 3,20H21A2,2 0 0,0 23,18V6A2,2 0 0,0 21,4M5,8.5A1.5,1.5 0 0,1 6.5,7A1.5,1.5 0 0,1 8,8.5A1.5,1.5 0 0,1 6.5,10A1.5,1.5 0 0,1 5,8.5M17.5,17A1.5,1.5 0 0,1 16,15.5A1.5,1.5 0 0,1 17.5,14A1.5,1.5 0 0,1 19,15.5A1.5,1.5 0 0,1 17.5,17M17,11H7V9H17V11Z" />
                </svg>
              </motion.div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Containerized App</h3>
            <p className="text-gray-300">
              Start with your existing containerized application, ready for deployment
            </p>
          </motion.div>
          
          {/* Step 2: Deployment Process with Animation */}
          <motion.div 
            className="bg-gray-900/60 backdrop-blur-md rounded-xl p-8 border border-gray-800 flex flex-col items-center text-center relative overflow-hidden"
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(70, 220, 225, 0.1)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
              <motion.div
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute inset-0"
                style={{ 
                  backgroundImage: 'url("/images/svg/circuit-pattern.svg")', 
                  backgroundSize: '200%',
                }}
              />
            </div>
            
            <div className="w-24 h-24 mb-6 relative">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-full h-full"
              >
                <svg viewBox="0 0 24 24" className="w-full h-full text-morphic-accent">
                  <path fill="currentColor" d="M17,17H7V7H17M21,11V9H19V7C19,5.89 18.1,5 17,5H15V3H13V5H11V3H9V5H7C5.89,5 5,5.89 5,7V9H3V11H5V13H3V15H5V17A2,2 0 0,0 7,19H9V21H11V19H13V21H15V19H17A2,2 0 0,0 19,17V15H21V13H19V11M13,13H11V11H13Z" />
                </svg>
              </motion.div>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-white">Deploy to Morphic Network</h3>
            <p className="text-gray-300">
              Deploy your application to our blockchain network powered by secure TEE nodes
            </p>
            
            {/* Animated arrow indicators */}
            <div className="hidden lg:block absolute -left-4 top-1/2 transform -translate-y-1/2">
              <motion.div
                animate={{ x: [-5, 5, -5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-morphic-primary">
                  <path d="M13 7L18 12L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 7L11 12L6 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
            
            <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
              <motion.div
                animate={{ x: [-5, 5, -5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-morphic-primary">
                  <path d="M13 7L18 12L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 7L11 12L6 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Step 3: Trustless App */}
          <motion.div 
            className="bg-gray-900/60 backdrop-blur-md rounded-xl p-8 border border-gray-800 flex flex-col items-center text-center"
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(70, 220, 225, 0.1)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-24 h-24 mb-6 relative">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
                className="w-full h-full"
              >
                <svg viewBox="0 0 24 24" className="w-full h-full text-morphic-primary">
                  <path fill="currentColor" d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z" />
                </svg>
              </motion.div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Trustless Service</h3>
            <p className="text-gray-300 mb-4">
              Your application is automatically transformed into a trustless service
            </p>
          </motion.div>
        </motion.div>
        
        {/* Trustless Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 w-full max-w-6xl mx-auto"
        >
          <div className="bg-gray-900/40 backdrop-blur-md rounded-xl p-8 border border-gray-800">
            <h3 className="text-2xl font-bold mb-6 text-center text-white">
              Key Trustless Properties
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Decentralized */}
              <motion.div 
                className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                whileHover={{ scale: 1.02, borderColor: 'rgba(70, 220, 225, 0.5)' }}
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 mr-3 text-morphic-primary">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,12A9,9 0 0,1 12,3A9,9 0 0,1 21,12A9,9 0 0,1 12,21A9,9 0 0,1 3,12M12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19M8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8A4,4 0 0,0 8,12Z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white">Decentralized</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  Distributed across multiple independent nodes, eliminating single points of failure
                </p>
              </motion.div>
              
              {/* Verifiable */}
              <motion.div 
                className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                whileHover={{ scale: 1.02, borderColor: 'rgba(70, 220, 225, 0.5)' }}
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 mr-3 text-morphic-primary">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white">Verifiable</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  All operations can be cryptographically verified through secure attestation
                </p>
              </motion.div>
              
              {/* Available */}
              <motion.div 
                className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                whileHover={{ scale: 1.02, borderColor: 'rgba(70, 220, 225, 0.5)' }}
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 mr-3 text-morphic-primary">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5A2,2 0 0,0 17,3M12,7A2,2 0 0,1 14,9A2,2 0 0,1 12,11A2,2 0 0,1 10,9A2,2 0 0,1 12,7Z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white">Available</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  High availability through redundant nodes and automatic failover mechanisms
                </p>
              </motion.div>
              
              {/* Finalizable */}
              <motion.div 
                className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                whileHover={{ scale: 1.02, borderColor: 'rgba(70, 220, 225, 0.5)' }}
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 mr-3 text-morphic-primary">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white">Finalizable</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  Transactions reach definitive completion with guaranteed consistency
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Waiting List Section - Separate full section */}
      <section className="relative w-full min-h-screen flex items-center justify-center py-24 px-4 border-t border-gray-800/50">
        {/* Subtle background for the waiting list section */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-800/50 backdrop-blur-sm"></div>
      <motion.div 
        ref={waitingListRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-2xl mx-auto px-4"
      >
        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl p-8 border border-gray-800">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-morphic-primary to-morphic-accent bg-clip-text text-transparent">
            Join Our Waiting List
          </h2>
          
          <p className="text-gray-300 mb-6">
            Interested in our services? Join our waiting list to be notified when we launch.
          </p>
          
          {isSubmitted ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-16 h-16 bg-morphic-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-morphic-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
              <p className="text-gray-300">
                Your information has been submitted successfully. We'll be in touch soon!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-morphic-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  placeholder="Email*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-morphic-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <input
                  type="text"
                  placeholder="Project Name (Optional)"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-morphic-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <textarea
                  placeholder="Description of your needs"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-morphic-primary focus:border-transparent resize-none"
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="subscribe"
                  checked={isSubscribed}
                  onChange={(e) => setIsSubscribed(e.target.checked)}
                  className="h-4 w-4 text-morphic-primary focus:ring-morphic-primary border-gray-700 rounded"
                />
                <label htmlFor="subscribe" className="ml-2 block text-sm text-gray-300">
                  Sign up for our email list for updates, promotions, and more.
                </label>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-3 rounded-md bg-gradient-to-r from-morphic-primary to-morphic-accent hover:from-morphic-accent hover:to-morphic-primary text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Join Waiting List'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
      </section>
      
      {/* Social Media Links Section */}
      <section className="relative w-full py-12 px-4 border-t border-gray-800/50">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-morphic-primary to-morphic-accent bg-clip-text text-transparent">
              Connect With Us
            </h3>
            <p className="text-gray-300 mb-6">
              Follow us on social media to stay updated with the latest news and developments
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, staggerChildren: 0.1 }}
          >
            {/* Social Media Links - Dynamically generated from config */}
            {Object.entries(socialMedia).map(([platform, data]) => (
              <motion.a
                key={platform}
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gray-800/80 hover:bg-gray-700/80 rounded-full transition-all duration-300 backdrop-blur-sm border border-gray-700/50 hover:border-morphic-primary/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Platform-specific icons */}
                {platform === 'x' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                )}
                {platform === 'telegram' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-white">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                )}
                {/* For future platforms, add more conditional icons here */}
                
                <span className="text-white font-medium">{data.displayName}</span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;