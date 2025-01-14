package database

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func SeedData(client *mongo.Client) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	db := os.Getenv("MONGO_DB_NAME")
	if db == "" {
		log.Fatal("MONGO_DB_NAME environment variable is not set")
	}

	// Seed users collection
	seedCollection(ctx, client, db, "users", []interface{}{
		bson.M{"name": "Alice", "email": "alice@example.com", "role": "admin"},
		bson.M{"name": "Bob", "email": "bob@example.com", "role": "user"},
		bson.M{"name": "Charlie", "email": "charlie@example.com", "role": "user"},
	})

	// Seed products collection
	seedCollection(ctx, client, db, "products", []interface{}{
		bson.M{"name": "Laptop", "price": 999.99, "category": "Electronics"},
		bson.M{"name": "Smartphone", "price": 699.99, "category": "Electronics"},
		bson.M{"name": "Table", "price": 49.99, "category": "Furniture"},
	})
}

func seedCollection(ctx context.Context, client *mongo.Client, dbName, collectionName string, data []interface{}) {
	collection := client.Database(dbName).Collection(collectionName)

	count, err := collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		log.Fatalf("Failed to count documents in collection %s: %v", collectionName, err)
	}

	if count > 0 {
		log.Printf("Collection '%s' is already seeded", collectionName)
		return
	}

	_, err = collection.InsertMany(ctx, data)
	if err != nil {
		log.Fatalf("Failed to seed collection '%s': %v", collectionName, err)
	}

	log.Printf("Seeded collection '%s' successfully", collectionName)
}
