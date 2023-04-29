import { Link } from "react-router-dom";
import { FaRegHandPointer } from "react-icons/fa";

const List = ({ title, link, active, onClick }) => {
  return (
    <nav>
      <Link to={link}>
        <h2
          onClick={onClick}
          style={active ? { backgroundColor: "lightblue" } : null}
        >
          {title}
          {!active ? <FaRegHandPointer className="icon" /> : null}
        </h2>
      </Link>
    </nav>
  );
};
export default List;
