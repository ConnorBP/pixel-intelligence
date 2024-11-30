const ContextMenuItem = ({children, onClick}) => {
  return (
    <li onClick={onClick}>{children}</li>
  )
}

export default ContextMenuItem