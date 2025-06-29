package middleware

import (
	"github.com/gin-gonic/gin"
)

func RobotMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Robots-Tag", "noindex, nofollow")

		c.Next()
	}
}
