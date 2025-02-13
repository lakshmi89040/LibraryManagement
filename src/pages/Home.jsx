// // Home.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import BookList from "../components/BookList";

// const Home = () => {
//   const [books, setBooks] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:8080/books")
//       .then((response) => setBooks(response.data))
//       .catch((error) => console.error("Error fetching books:", error));
//   }, []);

//   return (
//     <div className="container mt-4">
//       <h1 className="text-center text-primary mb-4">Book List</h1>
//       <BookList books={books} />
//     </div>
//   );
// };

// export default Home;

// Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/books")
      .then((response) => setBooks(response.data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center text-primary mb-4">Book List</h1>
      <DataTable data={books} setData={setBooks} />
    </div>
  );
};

export default Home;
