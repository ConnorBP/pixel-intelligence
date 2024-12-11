import { useNavigate } from "react-router-dom";

const ContextMenuItem = ({children, to, onClick}) => {

  const navigate = useNavigate();
  return (
    <li 
      onClick={() => {
      if (to) navigate(to);
      if (onClick) onClick();
      }}
      tabIndex={0}
    >{children}</li>
  )
}

export default ContextMenuItem