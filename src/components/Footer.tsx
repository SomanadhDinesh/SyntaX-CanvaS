import React, { useState, useEffect } from 'react';

interface FooterProps {
  onSecretTrigger: () => void;
}

export function Footer({ onSecretTrigger }: FooterProps) {
  const [sequence, setSequence] = useState<string[]>([]);
  const targetSequence = ['m', 's', 'd'];

  useEffect(() => {
    if (sequence.length >= targetSequence.length) {
      // check if last 3 match
      const lastThree = sequence.slice(-3);
      if (lastThree.every((char, index) => char === targetSequence[index])) {
        onSecretTrigger();
        setSequence([]);
      }
    }
  }, [sequence, onSecretTrigger]);

  const handleLetterClick = (letter: string) => {
    setSequence((prev) => {
      const next = [...prev, letter];
      if (next.length > 5) return next.slice(-5);
      return next;
    });
  };

  return (
    <footer className="mt-auto flex items-center justify-between py-6 px-10 border-t border-zinc-800 bg-[#0C0C0E]">
      <div className="flex items-center space-x-6 text-xs uppercase tracking-widest font-semibold text-zinc-500">
        <span>KRNL.</span>
      </div>
      
      <div className="flex items-center space-x-8">
        {/* Hidden Login Trigger Area */}
        <div className="text-[10px] text-zinc-700/60 cursor-default flex space-x-[1px] select-none tracking-widest uppercase items-center">
          <span>Syste</span>
          <span onClick={() => handleLetterClick('m')} className="hover:text-zinc-600 transition-colors cursor-pointer">m</span>
          <span> </span>
          <span>Admini</span>
          <span onClick={() => handleLetterClick('s')} className="hover:text-zinc-600 transition-colors cursor-pointer">s</span>
          <span>trative </span>
          <span onClick={() => handleLetterClick('d')} className="hover:text-zinc-600 transition-colors cursor-pointer">d</span>
          <span>ashboard</span>
        </div>
      </div>
    </footer>
  );
}
