// DataTable.jsx
import { Link } from "react-router-dom";
import axios from "axios";

function DataTable({ data, setData }) {
  // DataTable.jsx
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      axios
        .delete(`http://localhost:8080/book/${id}`) // Use /book instead of /books
        .then(() => {
          setData(data.filter((item) => item.id !== id));
          alert("Book deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting book:", error);
          alert(
            "Failed to delete the book. Please check the console for details."
          );
        });
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover table-bordered align-middle">
        <thead className="table-primary">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Action</th>
            <th>Id</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td>{item.author}</td>
              <td>${item.price}</td>
              <td>
                <Link
                  to={`/edit/${item.id}`}
                  className="btn btn-outline-primary btn-sm me-2"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
              <td>{item.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
