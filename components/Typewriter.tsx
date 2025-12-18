
import React, { useState, useEffect, useMemo, useRef } from 'react';

interface TypewriterProps {
  children: React.ReactNode;
  speed?: number;
  step?: number;
  onComplete?: () => void;
  onUpdate?: () => void;
  isStopped?: boolean;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  children, 
  speed = 5, 
  step = 1,
  onComplete,
  onUpdate,
  isStopped = false
}) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const completedRef = useRef(false);
  
  const getTextLength = (node: React.ReactNode): number => {
    if (typeof node === 'string') return node.length;
    if (typeof node === 'number') return node.toString().length;
    if (node === null || typeof node === 'boolean' || typeof node === 'undefined') return 0;
    
    if (React.isValidElement(node)) {
      const props = node.props as { children?: React.ReactNode };
      return props.children ? getTextLength(props.children) : 0;
    }
    
    if (Array.isArray(node)) {
      return node.reduce((acc, child) => acc + getTextLength(child), 0);
    }
    
    return 0;
  };

  const totalLength = useMemo(() => getTextLength(children), [children]);

  useEffect(() => {
    if (isStopped) return;

    if (totalLength === 0) {
        setVisibleCount(0);
        if (!completedRef.current) {
            completedRef.current = true;
            onComplete?.();
        }
        return;
    }

    const interval = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= totalLength) {
          clearInterval(interval);
          if (!completedRef.current) {
              completedRef.current = true;
              onComplete?.();
          }
          return totalLength;
        }
        
        const next = prev + step;
        onUpdate?.();
        return next;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [totalLength, speed, step, onComplete, onUpdate, isStopped]);

  const renderChildren = (node: React.ReactNode, counter: { val: number }): React.ReactNode => {
    if (typeof node === 'string') {
      const len = node.length;
      if (counter.val >= len) {
        counter.val -= len;
        return node;
      }
      if (counter.val <= 0) {
         return '';
      }
      const slice = node.substring(0, counter.val);
      counter.val = 0;
      return slice;
    }
    
    if (typeof node === 'number') {
        return renderChildren(node.toString(), counter);
    }

    if (node === null || typeof node === 'boolean' || typeof node === 'undefined') return node;

    if (React.isValidElement(node)) {
      const props = node.props as any;
      if (!props.children) {
        return node;
      }

      const children = React.Children.toArray(props.children);
      const newChildren = children.map(child => renderChildren(child, counter));
      return React.cloneElement(node, { ...props, children: newChildren });
    }

    if (Array.isArray(node)) {
      return node.map(child => renderChildren(child, counter));
    }

    return node;
  };

  const isFinished = visibleCount >= totalLength;

  if (isFinished) {
      return <>{children}</>;
  }

  const counterRef = { val: visibleCount };
  
  return (
    <>
        {renderChildren(children, counterRef)}
        {!isStopped && (
            <span className="inline-block bg-terminal-green w-[10px] h-5 align-text-bottom animate-blink ml-[1px]" />
        )}
    </>
  );
};
