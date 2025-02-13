// EditBook.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BookForm from "../components/BookForm";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/book/${id}`)
      .then((response) => setBook(response.data))
      .catch((error) => console.error("Error fetching book:", error));
  }, [id]);

  const handleSubmit = (updatedBook) => {
    axios
      .put(`http://localhost:8080/book/${id}`, updatedBook)
      .then(() => {
        alert("Book updated successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error updating book:", error);
        alert("Failed to update the book. Please try again.");
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm rounded-3 border-0">
            <div className="card-body">
              <h2 className="text-center text-primary mb-4">Edit Book</h2>
              {book ? (
                <BookForm book={book} onSubmit={handleSubmit} />
              ) : (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBook;
