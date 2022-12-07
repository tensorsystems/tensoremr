package util

import "github.com/gin-gonic/gin"

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
	c.JSON(status, gin.H{
		"message": message,
	})
	c.Abort()
}
