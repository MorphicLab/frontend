import React from 'react';

const PageBackground: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black -z-10" />
      
      <div className="fixed inset-0 opacity-30 -z-5">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-morphic-primary rounded-full mix-blend-multiply filter blur-[128px] animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-morphic-secondary rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-morphic-accent rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000" />
      </div>
      
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10" />
    </>
  );
};

export default PageBackground; 