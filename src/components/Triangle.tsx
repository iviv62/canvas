import React, { CSSProperties } from 'react';

interface TriangleProps {
  width: number;
  height: number;
  color: string;
}

const Triangle: React.FC<TriangleProps> = ({ width, height, color }) => (
  <div
    style={{
      width: 0,
      height: 0,
      borderLeft: `${width / 2}px solid transparent`,
      borderRight: `${width / 2}px solid transparent`,
      borderBottom: `${height}px solid ${color}`,
      display: 'block',
      position: 'relative',
    } as CSSProperties}
  />
);

export default Triangle;
