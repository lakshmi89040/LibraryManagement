package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Book represents the structure of our book data
type Book struct {
	ID     primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title  string            `bson:"title" json:"title"`
	Author string            `bson:"author" json:"author"`
	Price  float64           `bson:"price" json:"price"`
}

// BookHandler handles all book-related operations
type BookHandler struct {
	// MongoDB collection to store books
	collection *mongo.Collection
}

// Setup creates a new BookHandler with MongoDB connection
func Setup() (*BookHandler, error) {
	// Connect to MongoDB
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		return nil, err
	}

	// Check if connection is successful
	err = client.Ping(context.Background(), nil)
	if err != nil {
		return nil, err
	}

	// Get the books collection
	collection := client.Database("bookstore").Collection("books")
	return &BookHandler{collection: collection}, nil
}

// Helper function to create timeout context
func createTimeout() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), 10*time.Second)
}

// getAllBooks returns all books from the database
func (h *BookHandler) getAllBooks(c *gin.Context) {
	ctx, cancel := createTimeout()
	defer cancel()

	// Find all books
	var books []Book
	cursor, err := h.collection.Find(ctx, bson.M{}) // SELCT * FROM books
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch books"})
		return
	}
	defer cursor.Close(ctx)

	// Load books into slice
	err = cursor.All(ctx, &books)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load books"})
		return
	}

	c.JSON(http.StatusOK, books)
}

// addBook adds a new book to the database
func (h *BookHandler) addBook(c *gin.Context) {
	ctx, cancel := createTimeout()
	defer cancel()

	// Get book data from request
	var book Book
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book data"})
		return
	}

	// Insert book into database
	result, err := h.collection.InsertOne(ctx, book)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add book"})
		return
	}

	// Set the generated ID and return the book
	book.ID = result.InsertedID.(primitive.ObjectID)
	c.JSON(http.StatusCreated, book)
}

// getBookByID finds a specific book by ID
func (h *BookHandler) getBookByID(c *gin.Context) {
	ctx, cancel := createTimeout()
	defer cancel()

	// Convert string ID to MongoDB ObjectID
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	// Find the book
	var book Book
	err = h.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&book)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}

	c.JSON(http.StatusOK, book)
}

// updateBook updates an existing book
func (h *BookHandler) updateBook(c *gin.Context) {
	ctx, cancel := createTimeout()
	defer cancel()

	// Convert string ID to MongoDB ObjectID
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	// Get updated book data from request
	var book Book
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book data"})
		return
	}

	// Update the book
	update := bson.M{
		"$set": bson.M{
			"title":  book.Title,
			"author": book.Author,
			"price":  book.Price,
		},
	}
	result, err := h.collection.UpdateOne(ctx, bson.M{"_id": id}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update book"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}

	book.ID = id
	c.JSON(http.StatusOK, book)
}

// deleteBook removes a book from the database
func (h *BookHandler) deleteBook(c *gin.Context) {
	ctx, cancel := createTimeout()
	defer cancel()

	// Convert string ID to MongoDB ObjectID
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid book ID"})
		return
	}

	// Delete the book
	result, err := h.collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete book"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}

	c.Status(http.StatusNoContent)
}

func main() {
	// Set up the book handler
	bookHandler, err := Setup()
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	// Create a new Gin router
	router := gin.Default()

	// Set up CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}))

	// Set up routes
	router.GET("/books", bookHandler.getAllBooks)
	router.POST("/books", bookHandler.addBook)
	router.GET("/book/:id", bookHandler.getBookByID)
	router.PUT("/book/:id", bookHandler.updateBook)
	router.DELETE("/book/:id", bookHandler.deleteBook)

	// Start the server
	log.Println("Server starting on http://localhost:8080")
	router.Run(":8080")
}