import React, { useRef, useEffect, useState } from 'react';
import MoveableObject from './MoveableObject';
import './Canvas.css';

export interface CanvasObject {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type: 'rectangle' | 'circle' | 'triangle';
}

export type ObjectType = 'rectangle' | 'circle' | 'triangle';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [nextId, setNextId] = useState<number>(1);

  useEffect(() => {
    // Initialize with some default objects
    const initialObjects: CanvasObject[] = [
      {
        id: 1,
        x: 100,
        y: 100,
        width: 80,
        height: 80,
        color: '#ff6b6b',
        type: 'rectangle'
      },
      {
        id: 2,
        x: 300,
        y: 150,
        width: 80,
        height: 80,
        color: '#4ecdc4',
        type: 'circle'
      },
      {
        id: 3,
        x: 500,
        y: 200,
        width: 80,
        height: 80,
        color: '#45b7d1',
        type: 'triangle'
      }
    ];
    setObjects(initialObjects);
    setNextId(4);
  }, []);

  const handleObjectMove = (id: number, newX: number, newY: number): void => {
    setObjects(prevObjects =>
      prevObjects.map(obj =>
        obj.id === id ? { ...obj, x: newX, y: newY } : obj
      )
    );
  };

  const addObject = (type: ObjectType): void => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newObject: CanvasObject = {
      id: nextId,
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50,
      width: 80,
      height: 80,
      color: randomColor,
      type: type
    };
    
    setObjects(prevObjects => [...prevObjects, newObject]);
    setNextId(nextId + 1);
  };

  const removeObject = (id: number): void => {
    setObjects(prevObjects => prevObjects.filter(obj => obj.id !== id));
  };

  return (
    <div className="canvas-container">
      <div className="controls">
        <button onClick={() => addObject('rectangle')}>Add Rectangle</button>
        <button onClick={() => addObject('circle')}>Add Circle</button>
        <button onClick={() => addObject('triangle')}>Add Triangle</button>
      </div>
      
      <div className="canvas" ref={canvasRef}>
        {objects.map(obj => (
          <MoveableObject
            key={obj.id}
            id={obj.id}
            x={obj.x}
            y={obj.y}
            width={obj.width}
            height={obj.height}
            color={obj.color}
            type={obj.type}
            onMove={handleObjectMove}
            onRemove={removeObject}
          />
        ))}
      </div>
    </div>
  );
};

export default Canvas;