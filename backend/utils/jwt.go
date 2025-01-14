package utils

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/joho/godotenv"
)

var (
	jwtSecret       []byte
	tokenExpiration time.Duration
)

// parseDuration parses a duration string that can include h, d, ms, s
// Example inputs: "24h", "7d", "1000ms", "3600s"
func parseDuration(duration string) (time.Duration, error) {
	// Handle empty duration
	if duration == "" {
		return 0, fmt.Errorf("duration cannot be empty")
	}

	// Convert to lowercase for consistent handling
	duration = strings.ToLower(duration)

	// Handle days specially since they're not supported by time.ParseDuration
	if strings.HasSuffix(duration, "d") {
		days, err := strconv.Atoi(strings.TrimSuffix(duration, "d"))
		if err != nil {
			return 0, fmt.Errorf("invalid day format: %v", err)
		}
		return time.Duration(days) * 24 * time.Hour, nil
	}

	// For other durations (h, ms, s), use standard time.ParseDuration
	return time.ParseDuration(duration)
}

// init loads and validates environment variables
func init() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Get and validate JWT_SECRET
	jwtSecret = []byte(os.Getenv("JWT_SECRET"))
	if len(jwtSecret) == 0 {
		log.Fatal("JWT_SECRET is not set in .env")
	}

	// Get and parse TOKEN_EXPIRATION
	expiration := os.Getenv("TOKEN_EXPIRATION")
	if expiration == "" {
		log.Fatal("TOKEN_EXPIRATION is not set in .env")
	}

	var err error
	tokenExpiration, err = parseDuration(expiration)
	if err != nil {
		log.Fatalf("Invalid TOKEN_EXPIRATION format: %v", err)
	}
}

// GenerateToken creates a new JWT token with the specified user ID
func GenerateToken(userID string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(tokenExpiration).Unix(),
		"iat":     time.Now().Unix(), // Added issued at time
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// ValidateToken checks if a JWT token is valid and returns the parsed token
func ValidateToken(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Validate signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})
}

// GetUserIDFromToken extracts the user ID from a validated token
func GetUserIDFromToken(token *jwt.Token) (string, error) {
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", fmt.Errorf("invalid token claims")
	}

	userID, ok := claims["user_id"].(string)
	if !ok {
		return "", fmt.Errorf("user_id not found in token")
	}

	return userID, nil
}
