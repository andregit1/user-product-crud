package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func SeedData(client *mongo.Client) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Example: Seeding the Users collection
	usersCollection := client.Database("yourDatabaseName").Collection("users")

	// Check if data already exists
	count, err := usersCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		log.Fatalf("Failed to count documents: %v", err)
	}

	if count > 0 {
		log.Println("Users collection already seeded")
		return
	}

	// Sample data
	users := []interface{}{
		bson.M{"name": "Alice", "email": "alice@example.com", "role": "admin"},
		bson.M{"name": "Bob", "email": "bob@example.com", "role": "user"},
		bson.M{"name": "Charlie", "email": "charlie@example.com", "role": "user"},
	}

	productsCollection := client.Database("yourDatabaseName").Collection("products")

	products := []interface{}{
		bson.M{"name": "Laptop", "price": 999.99, "category": "Electronics"},
		bson.M{"name": "Smartphone", "price": 699.99, "category": "Electronics"},
		bson.M{"name": "Table", "price": 49.99, "category": "Furniture"},
	}

	_, err = productsCollection.InsertMany(ctx, products)
	if err != nil {
		log.Fatalf("Failed to seed products: %v", err)
	}
	log.Println("Seeded products collection successfully")

	_, err = usersCollection.InsertMany(ctx, users)
	if err != nil {
		log.Fatalf("Failed to seed users: %v", err)
	}
	log.Println("Seeded users collection successfully")
}
