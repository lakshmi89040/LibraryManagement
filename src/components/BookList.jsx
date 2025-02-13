// BookList.jsx
import React from "react";
import BookCard from "./BookCard";

const BookList = ({ books }) => {
  return (
    <div className="row row-cols-1 row-cols-md-3 g-4">
      {books.map((book) => (
        <div className="col" key={book.id}>
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
};

export default BookList;
