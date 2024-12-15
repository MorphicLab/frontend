import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

  /**
   * Home page component.
   * 
   * This component renders the home page, with a background image, 
   * a Morphic logo, a title, a description, and two buttons 
   * to navigate to the TOS services page or the documentation page.
   * 
   * The component uses Framer Motion to animate the elements.
   * The animation is a fade-in and a slide-up from the bottom.
   * 
   * @returns The home page component.
   */
const Home = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center"
      style={{
        backgroundImage: 'url("/images/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
      
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
          Make your service trustless in days, with even lower operation cost
        </p>
        
        <motion.div 
          className="flex flex-col md:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
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
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </div>
  );
};

export default Home;