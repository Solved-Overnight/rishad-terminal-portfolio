
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
  const onCompleteRef = useRef(onComplete);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onUpdateRef.current = onUpdate;
  });
  
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
    completedRef.current = false;
    setVisibleCount(0);
  }, [children]);

  // Interval timer for typewriter effect
  useEffect(() => {
    if (isStopped || totalLength === 0) return;
    if (visibleCount >= totalLength) return;

    const interval = setInterval(() => {
      setVisibleCount(prev => {
        const next = prev + step;
        if (next >= totalLength) {
          clearInterval(interval);
          return totalLength;
        }
        return next;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [totalLength, speed, step, isStopped, visibleCount]);

  // Handle completion and update callbacks safely in effect
  useEffect(() => {
    if (isStopped) return;

    if (totalLength === 0 || visibleCount >= totalLength) {
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
    } else if (visibleCount > 0) {
      onUpdateRef.current?.();
    }
  }, [visibleCount, totalLength, isStopped]);

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
      if (props.children === undefined || props.children === null) {
        return node;
      }

      if (typeof props.children === 'string') {
        const newChild = renderChildren(props.children, counter);
        return React.cloneElement(node, {
          ...props,
          children: typeof newChild === 'string' ? newChild : String(newChild ?? '')
        });
      }

      if (typeof props.children === 'number') {
        const newChild = renderChildren(props.children.toString(), counter);
        return React.cloneElement(node, {
          ...props,
          children: typeof newChild === 'string' ? newChild : String(newChild ?? '')
        });
      }

      const rawChildren = Array.isArray(props.children)
        ? props.children
        : React.Children.toArray(props.children);

      const newChildren = rawChildren.map((child: any, idx: number) => {
        const rendered = renderChildren(child, counter);
        if (React.isValidElement(rendered)) {
          const key = (rendered.key !== null && rendered.key !== undefined)
            ? rendered.key
            : ((React.isValidElement(child) && child.key !== null && child.key !== undefined)
                ? child.key
                : `tw-c-${idx}`);
          return React.cloneElement(rendered, { key });
        }
        return rendered;
      });

      const finalChildren = (!Array.isArray(props.children) && newChildren.length === 1) 
        ? newChildren[0] 
        : newChildren;

      return React.cloneElement(node, { ...props, children: finalChildren });
    }

    if (Array.isArray(node)) {
      return node.map((child, idx) => {
        const rendered = renderChildren(child, counter);
        if (React.isValidElement(rendered)) {
          const key = (rendered.key !== null && rendered.key !== undefined)
            ? rendered.key
            : ((React.isValidElement(child) && child.key !== null && child.key !== undefined)
                ? child.key
                : `tw-a-${idx}`);
          return React.cloneElement(rendered, { key });
        }
        return rendered;
      });
    }

    return node;
  };

  const isFinished = visibleCount >= totalLength;

  if (isFinished) {
      return <>{React.Children.toArray(children)}</>;
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
