import React, { ElementType } from 'react';
import './StarBorder.css';

interface StarBorderProps<T extends ElementType = 'button'> {
  as?: T;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler;
  title?: string;
  [key: string]: any;
}

const StarBorder = <T extends ElementType = 'button'>({
  as: Component = 'button' as T,
  className = '',
  color = '#4af626',
  speed = '4s',
  thickness = 1,
  children,
  style,
  ...rest
}: StarBorderProps<T>) => {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...style,
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div className="inner-content">{children}</div>
    </Component>
  );
};

export default StarBorder;
