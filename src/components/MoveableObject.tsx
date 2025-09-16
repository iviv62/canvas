import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ObjectType } from './Canvas';

interface MoveableObjectProps {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type: ObjectType;
  onMove: (id: number, newX: number, newY: number) => void;
  onRemove: (id: number) => void;
}

interface DragOffset {
  x: number;
  y: number;
}

const MoveableObject: React.FC<MoveableObjectProps> = ({ 
  id, x, y, width, height, color, type, onMove, onRemove 
}) => {
  const objectRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 });
  const dragStateRef = useRef<{ isDragging: boolean; offset: DragOffset }>({
    isDragging: false,
    offset: { x: 0, y: 0 }
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStateRef.current.isDragging) return;
    
    e.preventDefault();
    const newX = e.clientX - dragStateRef.current.offset.x;
    const newY = e.clientY - dragStateRef.current.offset.y;
    
    // Constrain to canvas bounds
    const maxX = 800 - width;
    const maxY = 600 - height;
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    if (shadowRootRef.current) {
      const container = shadowRootRef.current.querySelector('div') as HTMLDivElement;
      if (container) {
        container.style.left = `${constrainedX}px`;
        container.style.top = `${constrainedY}px`;
      }
    }
  }, [width, height]);

  const handleMouseUp = useCallback(() => {
    if (dragStateRef.current.isDragging) {
      setIsDragging(false);
      dragStateRef.current.isDragging = false;
      
      if (shadowRootRef.current) {
        const container = shadowRootRef.current.querySelector('div') as HTMLDivElement;
        if (container) {
          container.style.transform = 'scale(1)';
          container.style.zIndex = 'auto';
          
          const finalX = parseInt(container.style.left, 10);
          const finalY = parseInt(container.style.top, 10);
          onMove(id, finalX, finalY);
        }
      }
    }
  }, [id, onMove]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (objectRef.current && !shadowRootRef.current) {
      // Create Shadow DOM
      shadowRootRef.current = objectRef.current.attachShadow({ mode: 'open' });
      
      // Create the content container
      const container = document.createElement('div');
      container.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${width}px;
        height: ${height}px;
        cursor: pointer;
        user-select: none;
        transition: transform 0.1s ease;
      `;

      // Create the shape element
      const shape = document.createElement('div');
      shape.style.cssText = `
        width: 100%;
        height: 100%;
        background-color: ${color};
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 12px;
        color: white;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
      `;

      // Style based on type
      switch (type) {
        case 'circle':
          shape.style.borderRadius = '50%';
          break;
        case 'triangle':
          shape.style.background = 'transparent';
          shape.style.width = '0';
          shape.style.height = '0';
          shape.style.borderLeft = `${width/2}px solid transparent`;
          shape.style.borderRight = `${width/2}px solid transparent`;
          shape.style.borderBottom = `${height}px solid ${color}`;
          shape.style.display = 'block';
          break;
        default: // rectangle
          shape.style.borderRadius = '4px';
      }

      // Add shape type text
      if (type !== 'triangle') {
        shape.textContent = type.toUpperCase();
      }

      // Create remove button
      const removeButton = document.createElement('button');
      removeButton.textContent = '×';
      removeButton.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        width: 20px;
        height: 20px;
        border: none;
        border-radius: 50%;
        background-color: #ff4757;
        color: white;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        line-height: 1;
        z-index: 1000;
      `;

      container.appendChild(shape);
      container.appendChild(removeButton);
      shadowRootRef.current.appendChild(container);

      // Add event listeners
      const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        dragStateRef.current.isDragging = true;
        
        // Calculate offset from mouse to top-left of container
        const offset = {
          x: e.clientX - parseInt(container.style.left, 10),
          y: e.clientY - parseInt(container.style.top, 10)
        };
        
        setDragOffset(offset);
        dragStateRef.current.offset = offset;

        container.style.transform = 'scale(1.05)';
        container.style.zIndex = '1000';
      };

      const handleMouseEnter = () => {
        removeButton.style.display = 'flex';
        container.style.transform = 'scale(1.02)';
      };

      const handleMouseLeave = () => {
        if (!dragStateRef.current.isDragging) {
          removeButton.style.display = 'none';
          container.style.transform = 'scale(1)';
        }
      };

      const handleRemoveClick = (e: MouseEvent) => {
        e.stopPropagation();
        onRemove(id);
      };

      // Attach event listeners
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      removeButton.addEventListener('click', handleRemoveClick);

      // Cleanup function
      return () => {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
        removeButton.removeEventListener('click', handleRemoveClick);
      };
    }
  }, [id, x, y, width, height, color, type, onRemove]);

  // Update position when props change
  useEffect(() => {
    if (shadowRootRef.current) {
      const container = shadowRootRef.current.querySelector('div') as HTMLDivElement;
      if (container && !dragStateRef.current.isDragging) {
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;
      }
    }
  }, [x, y]);

  return <div ref={objectRef} style={{ position: 'absolute' }}></div>;
};

export default MoveableObject;