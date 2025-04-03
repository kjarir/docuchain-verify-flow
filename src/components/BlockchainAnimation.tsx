
import React from "react";

const BlockchainAnimation = () => {
  return (
    <div className="relative h-40 w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-around">
        {/* First row of blockchain nodes */}
        <div className="flex items-center">
          <div className="blockchain-node"></div>
          <div className="blockchain-connection w-16"></div>
          <div className="blockchain-node"></div>
          <div className="blockchain-connection w-16"></div>
          <div className="blockchain-node"></div>
        </div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-around mt-10">
        {/* Second row of blockchain nodes */}
        <div className="flex items-center">
          <div className="blockchain-node"></div>
          <div className="blockchain-connection w-12"></div>
          <div className="blockchain-node"></div>
          <div className="blockchain-connection w-12"></div>
          <div className="blockchain-node"></div>
          <div className="blockchain-connection w-12"></div>
          <div className="blockchain-node"></div>
        </div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-around mt-20">
        {/* Third row of blockchain nodes */}
        <div className="flex items-center">
          <div className="blockchain-node"></div>
          <div className="blockchain-connection w-20"></div>
          <div className="blockchain-node"></div>
          <div className="blockchain-connection w-20"></div>
          <div className="blockchain-node"></div>
        </div>
      </div>
      
      {/* Vertical connections */}
      <div className="absolute left-1/4 top-0 h-full flex flex-col items-center">
        <div className="blockchain-node"></div>
        <div className="blockchain-connection w-px h-10"></div>
        <div className="blockchain-node"></div>
        <div className="blockchain-connection w-px h-10"></div>
        <div className="blockchain-node"></div>
      </div>
      
      <div className="absolute right-1/4 top-0 h-full flex flex-col items-center">
        <div className="blockchain-node"></div>
        <div className="blockchain-connection w-px h-10"></div>
        <div className="blockchain-node"></div>
        <div className="blockchain-connection w-px h-10"></div>
        <div className="blockchain-node"></div>
      </div>
    </div>
  );
};

export default BlockchainAnimation;
