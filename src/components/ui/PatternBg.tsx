import { C } from '@/constants/theme';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function PatternBg({ children, className = '' }: Props) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: C.cream,
        backgroundImage: `
          repeating-linear-gradient(45deg,
            rgba(193,93,49,0.05) 0px, rgba(193,93,49,0.05) 2px,
            transparent 2px, transparent 14px),
          repeating-linear-gradient(-45deg,
            rgba(15,23,62,0.045) 0px, rgba(15,23,62,0.045) 2px,
            transparent 2px, transparent 14px)
        `,
      }}
    >
      {children}
    </div>
  );
}
