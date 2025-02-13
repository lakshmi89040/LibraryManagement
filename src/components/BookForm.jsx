// BookForm.jsx
import React, { useState } from "react";

const BookForm = ({ book = {}, onSubmit }) => {
  const [title, setTitle] = useState(book.title || "");
  const [author, setAuthor] = useState(book.author || "");
  const [price, setPrice] = useState(book.price || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, author, price: parseFloat(price) });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 shadow-sm rounded-3 border-0 bg-light"
    >
      <div className="mb-3">
        <label className="form-label">Title:</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Author:</label>
        <input
          type="text"
          className="form-control"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Price:</label>
        <input
          type="number"
          className="form-control"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-success">
        Save
      </button>
    </form>
  );
};

export default BookForm;
