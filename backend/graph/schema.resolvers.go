package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.63

import (
	"context"
	"errors"
	"fmt"

	"github.com/andregit1/user-product-crud/database"
	"github.com/andregit1/user-product-crud/graph/model"
	"github.com/andregit1/user-product-crud/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

// Register is the resolver for the register field.
func (r *mutationResolver) Register(ctx context.Context, name string, email string, password string) (*model.AuthPayload, error) {
	collection := database.GetCollection("users")

	// Check if user already exists
	var existingUser model.User
	err := collection.FindOne(ctx, bson.M{"email": email}).Decode(&existingUser)
	if err == nil {
		return nil, errors.New("email already in use")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Insert new user
	newUser := model.User{
		ID:       primitive.NewObjectID().Hex(),
		Name:     name,
		Email:    email,
		Password: string(hashedPassword),
	}
	_, err = collection.InsertOne(ctx, newUser)
	if err != nil {
		return nil, err
	}

	// Generate token
	token, err := utils.GenerateToken(newUser.ID)
	if err != nil {
		return nil, err
	}

	return &model.AuthPayload{Token: token, User: &newUser}, nil
}

// Login is the resolver for the login field.
func (r *mutationResolver) Login(ctx context.Context, email string, password string) (*model.AuthPayload, error) {
	collection := database.GetCollection("users")

	// Find user by email
	var user model.User
	err := collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// Compare password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// Generate token
	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &model.AuthPayload{Token: token, User: &user}, nil
}

// CreateUser is the resolver for the createUser field.
func (r *mutationResolver) CreateUser(ctx context.Context, name string, email string) (*model.User, error) {
	user := &model.User{
		ID:    primitive.NewObjectID().Hex(),
		Name:  name,
		Email: email,
	}

	collection := database.GetCollection("users")
	_, err := collection.InsertOne(ctx, user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UpdateUser is the resolver for the updateUser field.
func (r *mutationResolver) UpdateUser(ctx context.Context, id string, name *string, email *string) (*model.User, error) {
	collection := database.GetCollection("users")

	// Prepare update data
	updateData := bson.M{}
	if name != nil {
		updateData["name"] = *name
	}
	if email != nil {
		updateData["email"] = *email
	}

	if len(updateData) == 0 {
		return nil, errors.New("no fields provided for update")
	}

	// Update user in database
	filter := bson.M{"_id": id}
	update := bson.M{"$set": updateData}
	result := collection.FindOneAndUpdate(ctx, filter, update)

	var updatedUser model.User
	if err := result.Decode(&updatedUser); err != nil {
		return nil, errors.New("user not found")
	}

	return &updatedUser, nil
}

// DeleteUser is the resolver for the deleteUser field.
func (r *mutationResolver) DeleteUser(ctx context.Context, id string) (bool, error) {
	collection := database.GetCollection("users")

	// Delete user from database
	result, err := collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return false, err
	}

	if result.DeletedCount == 0 {
		return false, errors.New("user not found")
	}

	return true, nil
}

// CreateProduct is the resolver for the createProduct field.
func (r *mutationResolver) CreateProduct(ctx context.Context, name string, price float64, stock int32) (*model.Product, error) {
	product := &model.Product{
		ID:    primitive.NewObjectID().Hex(),
		Name:  name,
		Price: price,
		Stock: stock,
	}

	collection := database.GetCollection("products")
	_, err := collection.InsertOne(ctx, product)
	if err != nil {
		return nil, err
	}

	return product, nil
}

// UpdateProduct is the resolver for the updateProduct field.
func (r *mutationResolver) UpdateProduct(ctx context.Context, id string, name *string, price *float64, stock *int32) (*model.Product, error) {
	collection := database.GetCollection("products")

	// Prepare update data
	updateData := bson.M{}
	if name != nil {
		updateData["name"] = *name
	}
	if price != nil {
		updateData["price"] = *price
	}
	if stock != nil {
		updateData["stock"] = *stock
	}

	if len(updateData) == 0 {
		return nil, errors.New("no fields provided for update")
	}

	// Update product in database
	filter := bson.M{"_id": id}
	update := bson.M{"$set": updateData}
	result := collection.FindOneAndUpdate(ctx, filter, update)

	var updatedProduct model.Product
	if err := result.Decode(&updatedProduct); err != nil {
		return nil, errors.New("product not found")
	}

	return &updatedProduct, nil
}

// DeleteProduct is the resolver for the deleteProduct field.
func (r *mutationResolver) DeleteProduct(ctx context.Context, id string) (bool, error) {
	collection := database.GetCollection("products")

	// Delete product from database
	result, err := collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return false, err
	}

	if result.DeletedCount == 0 {
		return false, errors.New("product not found")
	}

	return true, nil
}

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	currentUserID := ctx.Value("userID").(string)
	collection := database.GetCollection("users")

	var users []*model.User
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var user model.User
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
		// Exclude the current user
		if user.ID != currentUserID {
			users = append(users, &user)
		}
	}
	return users, nil
}

// User is the resolver for the user field.
func (r *queryResolver) User(ctx context.Context, id string) (*model.User, error) {
	collection := database.GetCollection("users")

	// Create an ObjectID from the string ID
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %v", err)
	}

	// Find the user by ID
	var user model.User
	err = collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("error fetching user: %v", err)
	}

	return &user, nil
}

// Products is the resolver for the products field.
func (r *queryResolver) Products(ctx context.Context) ([]*model.Product, error) {
	var products []*model.Product
	collection := database.GetCollection("products")
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var product model.Product
		if err := cursor.Decode(&product); err != nil {
			return nil, err
		}
		products = append(products, &product)
	}

	return products, nil
}

// Product is the resolver for the product field.
func (r *queryResolver) Product(ctx context.Context, id string) (*model.Product, error) {
	collection := database.GetCollection("products")

	// Create an ObjectID from the string ID
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid product ID: %v", err)
	}

	// Find the product by ID
	var product model.Product
	err = collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&product)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("product not found")
		}
		return nil, fmt.Errorf("error fetching product: %v", err)
	}

	return &product, nil
}

// CurrentUser is the resolver for the currentUser field.
func (r *queryResolver) CurrentUser(ctx context.Context) (*model.User, error) {
	userID := ctx.Value("userID").(string)
	collection := database.GetCollection("users")

	var user model.User
	err := collection.FindOne(ctx, bson.M{"id": userID}).Decode(&user)
	if err != nil {
		return nil, errors.New("user not found")
	}

	return &user, nil
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
