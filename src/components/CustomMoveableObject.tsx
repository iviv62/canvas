import React, { ReactNode, CSSProperties } from 'react';

interface CustomMoveableObjectProps {
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * CustomMoveableObject allows users to pass custom style and HTML as children.
 * Example usage:
 * <CustomMoveableObject style={{...}}><div>Custom Content</div></CustomMoveableObject>
 */
const CustomMoveableObject: React.FC<CustomMoveableObjectProps> = ({ style, children }) => (
  <div style={{ position: 'relative', ...style }}>
    {children}
  </div>
);

export default CustomMoveableObject;
