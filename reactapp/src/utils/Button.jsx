import React from 'react'

function Button({ btnName, className, type, onClick, disabled, title, style }) {
  return (
    <button className={className} type={type} onClick={onClick} disabled={disabled} title={title} style={style}>{btnName}</button>
  )
}

export default Button