package middleware

import (
	"os"

	"github.com/Nerzal/gocloak/v12"
	"github.com/gin-gonic/gin"
)

// CORSMiddleware ...
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

// AuthMiddleware ...
func AuthMiddleware(client *gocloak.GoCloak) gin.HandlerFunc {
	return (func(ctx *gin.Context) {
		clientId := os.Getenv("KEYCLOAK_CLIENT_ID")
		clientSecret := os.Getenv("KEYCLOAK_CLIENT_SECRET")
		clientMasterRealm := os.Getenv("KEYCLOAK_CLIENT_MASTER_REALM")

		token, err := client.LoginClient(ctx, clientId, clientSecret, clientMasterRealm)
		if err != nil {
			ctx.JSON(401, err.Error())
			ctx.Abort()
			return
		}

		ctx.Set("accessToken", token.AccessToken)
		ctx.Next()
	})
}
