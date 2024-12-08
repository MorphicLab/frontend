import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Mock window.ethereum
const mockEthereum = {
  request: jest.fn().mockImplementation((args: { method: string }) => Promise.resolve([])),
  on: jest.fn().mockImplementation((event: string, callback: (accounts: string[]) => void) => {}),
  removeListener: jest.fn().mockImplementation((event: string, callback: (accounts: string[]) => void) => {}),
};

// Mock ethers provider
jest.mock('ethers', () => ({
  BrowserProvider: jest.fn().mockImplementation(() => ({
    lookupAddress: jest.fn().mockResolvedValue(null),
  })),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Suppress React Router warnings in tests
const originalConsoleWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: any[]) => {
    if (args[0]?.includes?.('React Router')) return;
    originalConsoleWarn(...args);
  };
});

afterAll(() => {
  console.warn = originalConsoleWarn;
});

const renderNavbar = () => {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Setup window.ethereum mock
    Object.defineProperty(window, 'ethereum', {
      value: mockEthereum,
      writable: true
    });
  });

  test('renders navbar with logo', () => {
    renderNavbar();
    expect(screen.getByText(/Morphic/i)).toBeInTheDocument();
  });

  test('shows and hides TOS menu on hover', () => {
    renderNavbar();
    const tosButton = screen.getByText(/TOS/i);
    const tosContainer = tosButton.closest('div');
    
    // Hover to open menu
    act(() => {
      fireEvent.mouseEnter(tosContainer!);
    });
    
    expect(screen.getByText(/TOS Services/i)).toBeInTheDocument();
    expect(screen.getByText(/TOS Operators/i)).toBeInTheDocument();
    
    // Hover out to close menu
    act(() => {
      fireEvent.mouseLeave(tosContainer!);
    });
    
    // Since we mocked framer-motion, the menu should disappear immediately
    expect(screen.queryByText(/TOS Services/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/TOS Operators/i)).not.toBeInTheDocument();
  });

  test('shows and hides Product menu on hover', () => {
    renderNavbar();
    const productButton = screen.getByText(/Product/i);
    const productContainer = productButton.closest('div');
    
    // Hover to open menu
    act(() => {
      fireEvent.mouseEnter(productContainer!);
    });
    
    expect(screen.getByText(/Morphic AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Morphic KMS/i)).toBeInTheDocument();
    
    // Hover out to close menu
    act(() => {
      fireEvent.mouseLeave(productContainer!);
    });
    
    // Since we mocked framer-motion, the menu should disappear immediately
    expect(screen.queryByText(/Morphic AI/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Morphic KMS/i)).not.toBeInTheDocument();
  });

  test('menu items have correct navigation links', () => {
    renderNavbar();
    
    // Open Products menu
    const productButton = screen.getByText(/Product/i);
    const productContainer = productButton.closest('div');
    
    act(() => {
      fireEvent.mouseEnter(productContainer!);
    });
    
    // Check navigation links
    const morphicAiLink = screen.getByText(/Morphic AI/i);
    const morphicKmsLink = screen.getByText(/Morphic KMS/i);
    
    expect(morphicAiLink).toHaveAttribute('href', '/morphic-ai');
    expect(morphicKmsLink).toHaveAttribute('href', '/morphic-kms');
  });
});
