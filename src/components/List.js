import { Link } from "react-router-dom";
import { FaRegHandPointer } from "react-icons/fa";

const List = ({ title, link, active, onClick, small = false }) => {
  return (
    <nav>
      <Link to={link}>
        <h2
          onClick={onClick}
          style={
            active && !small
              ? { backgroundColor: "lightblue" }
              : active && small
              ? { backgroundColor: "lightblue", fontSize: "12px" }
              : !active && small
              ? { fontSize: "12px" }
              : null
          }
        >
          {title}
          {!active ? <FaRegHandPointer className="icon" /> : null}
        </h2>
      </Link>
    </nav>
  );
};
export default List;
