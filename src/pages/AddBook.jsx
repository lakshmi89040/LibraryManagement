// AddBook.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BookForm from "../components/BookForm";

const AddBook = () => {
  const navigate = useNavigate();

  const handleSubmit = (book) => {
    axios
      .post("http://localhost:8080/books", book)
      .then(() => {
        alert("Book added successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error adding book:", error);
        alert("Failed to add the book. Please try again.");
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm rounded-3 border-0">
            <div className="card-body">
              <h2 className="text-center text-success mb-4">Add New Book</h2>
              <BookForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
