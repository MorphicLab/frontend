import React from 'react';

const PageBackground: React.FC = () => {
  return (
    <>
      {/* 渐变背景 */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black -z-10" />
      
      {/* 动态光效 */}
      <div className="fixed inset-0 opacity-30 -z-5">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000" />
      </div>
      
      {/* 网格效果 */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10" />
    </>
  );
};

export default PageBackground; 