import React, { ReactNode, CSSProperties } from 'react';

interface CircleProps {
  width: number | string;
  height: number | string;
  color: string;
  children?: ReactNode;
}

const Circle: React.FC<CircleProps> = ({ width, height, color, children }) => (
  <div
    style={{
      width: width,
      height: height,
      backgroundColor: color,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: 12,
      color: 'white',
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
      position: 'relative',
    } as CSSProperties}
  >
    {children}
  </div>
);

export default Circle;
