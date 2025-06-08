import { SVGProps } from 'react';

export default function ChatBot(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.96 9.96 0 01-4.587-1.112l-3.826 1.067a1.001 1.001 0 01-1.242-1.241l1.067-3.826A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2zm0 6a1 1 0 100 2 1 1 0 000-2zm-3 1a1 1 0 102 0 1 1 0 00-2 0zm6 0a1 1 0 102 0 1 1 0 00-2 0zm-6.362 5.01A3.988 3.988 0 0112 15a3.988 3.988 0 013.362-1.99.75.75 0 01.695 1.329A2.5 2.5 0 0112 15a2.5 2.5 0 01-2.057-.66.75.75 0 01.695-1.33z" />
    </svg>
  );
}
