import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, ChevronDown } from 'lucide-react';
import { ethers } from 'ethers';

// 添加 window.ethereum 类型声明
declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string }) => Promise<string[]>;
            on: (event: string, callback: (accounts: string[]) => void) => void;
            removeListener: (event: string, callback: (accounts: string[]) => void) => void;
        };
    }
}

const Navbar = () => {
  const [tosMenuOpen, setTosMenuOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const productMenu = [
    { name: 'Morphic AI', href: '/morphic-ai' },
    { name: 'Morphic KMS', href: '/morphic-kms' }
  ];

  // 获取 ENS 信息
  const fetchEnsInfo = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const ensName = await provider.lookupAddress(address);
      if (ensName) {
        setEnsName(ensName);
        const resolver = await provider.getResolver(ensName);
        if (resolver) {
          const avatar = await resolver.getText('avatar');
          if (avatar) {
            setAvatarUrl(avatar);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch ENS info:', error);
    }
  };

  // 获取 MetaMask 头像
  const fetchMetaMaskAvatar = async () => {
    try {
    //   // @ts-expect-error MetaMask API
    //   const avatar = await window.ethereum.request({
    //     method: 'eth_getAvatar',
    //     params: [account]
    //   });
      // TODO: try a better way to get avatar
      const avatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7He1Qrc4Owv8p4En5L1Pq3Sp5TfJS94yKBg&s';
      if (avatar) {
        setAvatarUrl(avatar);
      }
    } catch (error) {
      console.error('Failed to fetch MetaMask avatar:', error);
    }
  };

  // 连接钱包
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setAccount(accounts[0]);
      await fetchMetaMaskAvatar();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  // 监听账户变化
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await fetchMetaMaskAvatar();
      } else {
        setAccount(null);
        setAvatarUrl(null);
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  // 检查是否已连接钱包
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (!window.ethereum) return;
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await fetchMetaMaskAvatar();
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    };

    checkWalletConnection();
  }, []);

  return (
    <nav className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo - 固定宽度 */}
          <div className="w-48">
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

          {/* Navigation Items - 固定宽度并右对齐内容 */}
          <div className="hidden md:flex flex-1 justify-end">
            <div className="w-[500px] flex items-center justify-end">
              <div className="flex items-center space-x-8">
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
                          {productMenu.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/docs" className="text-gray-300 hover:text-white transition-colors">
                  Docs
                </Link>
              </div>
            </div>

            {/* Wallet Button/Account Info - 固定宽度 */}
            <div className="w-48 flex justify-end">
              {account ? (
                <div className="relative" onMouseEnter={() => setAccountMenuOpen(true)} onMouseLeave={() => setAccountMenuOpen(false)}>
                  <div className="ml-8 flex items-center bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors cursor-pointer">
                    <div className="flex items-center px-3 py-1.5">
                      {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt="MetaMask Avatar" 
                          className="w-7 h-7 rounded-full ring-2 ring-morphic-primary/20"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-morphic-primary to-morphic-accent flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {account.slice(2, 4).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="ml-2 text-sm font-medium text-white">
                        {`${account.slice(0,6)}...`}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <AnimatePresence>
                    {accountMenuOpen && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={menuVariants}
                        className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 py-1"
                      >
                        <button
                          onClick={() => navigate('/developer')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                        >
                          <span className="flex-1">Develop</span>
                        </button>
                        <div className="border-t border-gray-700 my-1"></div>
                        <button
                          onClick={() => {
                            setAccount(null);
                            setAvatarUrl(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center"
                        >
                          <span className="flex-1">Disconnect</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-morphic-primary to-morphic-accent text-white hover:from-morphic-accent hover:to-morphic-primary transition-all duration-300"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;