package database

import (
    "context"
    "log"
    "time"
    "os"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "github.com/joho/godotenv"
)

var Client *mongo.Client

func ConnectMongo() {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    uri := os.Getenv("MONGO_URI")
    clientOptions := options.Client().ApplyURI(uri)

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    client, err := mongo.Connect(ctx, clientOptions)
    if err != nil {
        log.Fatal(err)
    }

    if err := client.Ping(ctx, nil); err != nil {
        log.Fatal(err)
    }

    log.Println("Connected to MongoDB")
    Client = client
}

func GetCollection(collectionName string) *mongo.Collection {
    return Client.Database("testdb").Collection(collectionName)
}
