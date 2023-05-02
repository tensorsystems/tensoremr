package util

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// CheckAccessToken ...
func CheckAccessToken(c *gin.Context) {
	accessToken := c.GetString("accessToken")
	if accessToken == "" {
		ReqError(c, 401, "Not authorized to perform this action")
		return
	}
}

// ReqError ...
func ReqError(c *gin.Context, status int, message string) {
	c.String(http.StatusInternalServerError, message)
	c.Abort()
}
