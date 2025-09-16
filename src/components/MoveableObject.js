import React, { useRef, useEffect, useState } from 'react';

const MoveableObject = ({ id, x, y, width, height, color, type, onMove, onRemove }) => {
  const objectRef = useRef(null);
  const shadowRootRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
      let startX, startY, initialX, initialY;

      // Use refs to always get latest state
      const isDraggingRef = { current: false };
      const dragOffsetRef = { current: { x: 0, y: 0 } };

      const handleMouseMove = (e) => {
        if (!isDraggingRef.current) return;
        e.preventDefault();
        const newX = e.clientX - dragOffsetRef.current.x;
        const newY = e.clientY - dragOffsetRef.current.y;
        // Constrain to canvas bounds
        const maxX = 800 - width;
        const maxY = 600 - height;
        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));
        container.style.left = `${constrainedX}px`;
        container.style.top = `${constrainedY}px`;
      };

      const handleMouseUp = () => {
        if (isDraggingRef.current) {
          isDraggingRef.current = false;
          setIsDragging(false);
          container.style.transform = 'scale(1)';
          container.style.zIndex = 'auto';
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          const finalX = parseInt(container.style.left, 10);
          const finalY = parseInt(container.style.top, 10);
          onMove(id, finalX, finalY);
        }
      };

      const handleMouseDown = (e) => {
        e.preventDefault();
        isDraggingRef.current = true;
        setIsDragging(true);
        startX = e.clientX;
        startY = e.clientY;
        initialX = parseInt(container.style.left, 10);
        initialY = parseInt(container.style.top, 10);
        dragOffsetRef.current = {
          x: e.clientX - initialX,
          y: e.clientY - initialY
        };
        setDragOffset({
          x: e.clientX - initialX,
          y: e.clientY - initialY
        });
        container.style.transform = 'scale(1.05)';
        container.style.zIndex = '1000';
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      };

      const handleMouseEnter = () => {
        removeButton.style.display = 'flex';
        container.style.transform = 'scale(1.02)';
      };

      const handleMouseLeave = () => {
        if (!isDraggingRef.current) {
          removeButton.style.display = 'none';
          container.style.transform = 'scale(1)';
        }
      };

      const handleRemoveClick = (e) => {
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
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, []);

  // Update position when props change
  useEffect(() => {
    if (shadowRootRef.current) {
      const container = shadowRootRef.current.querySelector('div');
      if (container) {
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;
      }
    }
  }, [x, y]);

  return <div ref={objectRef} style={{ position: 'absolute' }}></div>;
};

export default MoveableObject;