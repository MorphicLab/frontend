import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, FormEvent, useEffect, useRef, useCallback } from 'react';
import features from '../config/features';
import emailjs from 'emailjs-com';
import emailjsConfig from '../config/emailjs';
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
    </div>
  );
};

export default Home;