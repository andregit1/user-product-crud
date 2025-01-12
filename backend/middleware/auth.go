package middleware

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"strings"

	"github.com/andregit1/user-product-crud/utils"
	"github.com/golang-jwt/jwt/v4"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Allow GET requests for the playground
		if r.Method == http.MethodGet {
			next.ServeHTTP(w, r)
			return
		}

		// For POST requests, we need to check if it's a public operation
		if r.Method == http.MethodPost {
			body, err := io.ReadAll(r.Body)
			if err != nil {
				http.Error(w, "Error reading request body", http.StatusBadRequest)
				return
			}
			// Restore the body for subsequent reads
			r.Body = io.NopCloser(strings.NewReader(string(body)))

			// Try to parse the request body
			var requestBody struct {
				Query string `json:"query"`
			}
			if err := json.Unmarshal(body, &requestBody); err != nil {
				// If we can't parse the body, it might be a malformed request
				http.Error(w, "Invalid request body", http.StatusBadRequest)
				return
			}

			// Check if this is a public operation (register or login)
			if isPublicOperation(requestBody.Query) {
				next.ServeHTTP(w, r)
				return
			}

			// For authenticated operations, check the token
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "Authorization header is missing", http.StatusUnauthorized)
				return
			}

			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			token, err := utils.ValidateToken(tokenString)
			if err != nil || !token.Valid {
				http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
				return
			}

			// Add user ID to context
			claims := token.Claims.(jwt.MapClaims)
			userID := claims["user_id"].(string)
			ctx := context.WithValue(r.Context(), "userID", userID)
			next.ServeHTTP(w, r.WithContext(ctx))
			return
		}

		// Handle other HTTP methods
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	})
}

// isPublicOperation checks if the operation is public (register or login)
func isPublicOperation(query string) bool {
	query = strings.ToLower(query)
	return strings.Contains(query, "mutation") &&
		(strings.Contains(query, "register") || strings.Contains(query, "login"))
}
