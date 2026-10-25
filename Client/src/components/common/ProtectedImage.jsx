import React from 'react'

const ProtectedImage = ({ src, alt, className, style, ...props }) => {
  const handleContextMenu = (e) => e.preventDefault();
  const handleDragStart = (e) => e.preventDefault();

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      style={{ ...style, userSelect: 'none', WebkitUserDrag: 'none' }}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      draggable={false}
      {...props}
    />
  )
}

export default ProtectedImage