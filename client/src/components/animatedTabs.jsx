import { motion } from "framer-motion";
import { useState } from "react";



export default function AnimatedTabs({tabs,activeTab,setActiveTab,layoutId='bubble',textColor='text-black',textHoverColor='text-gray-600',backgroundColor='bg-white',backgroundColorHover='bg-gray-100',activeTextColor}) {
  

  return (
    <div className="flex space-x-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`cursor-pointer ${
            activeTab === tab.id ? (activeTextColor || textColor) : `hover:${textHoverColor} ${textColor}`
          } relative rounded-full px-3 py-1.5 text-sm font-medium outline-sky-400 transition focus-visible:outline-2 z-20`}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId={layoutId}
              className={`absolute inset-0 z-10 ${backgroundColor}`}
              style={{ borderRadius: 9999 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-20">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
