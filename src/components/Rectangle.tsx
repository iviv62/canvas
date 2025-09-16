import React, { ReactNode, CSSProperties } from 'react';

interface RectangleProps {
  width: number | string;
  height: number | string;
  color: string;
  children?: ReactNode;
}

const Rectangle: React.FC<RectangleProps> = ({ width, height, color, children }) => (
  <div
    style={{
      width: width,
      height: height,
      backgroundColor: color,
      borderRadius: 4,
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

export default Rectangle;
