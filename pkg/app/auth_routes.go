package app

import (
	"net/http"

	"github.com/Damillora/phoebe/pkg/models"
	"github.com/Damillora/phoebe/pkg/services"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func InitializeAuthRoutes(g *gin.Engine) {
	g.POST("/api/auth/login", createToken)
	g.POST("/api/auth/token", createTokenRefresh)
}

func createToken(c *gin.Context) {
	var model models.LoginFormModel
	err := c.ShouldBindJSON(&model)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
		c.Abort()
		return
	}

	validate := validator.New()
	err = validate.Struct(model)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
		c.Abort()
		return
	}

	user := services.Login(model.Username, model.Password)

	if user != nil {
		token := services.CreateTokenPair(user)
		c.JSON(http.StatusOK, models.TokenResponse{
			AccessToken:  token.AccessToken,
			RefreshToken: token.RefreshToken,
		})

	} else {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Code:    http.StatusUnauthorized,
			Message: "Wrong username or password",
		})
	}
}

func createTokenRefresh(c *gin.Context) {
	tokenReq := models.TokenReadModel{}
	c.BindJSON(&tokenReq)

	// Parse takes the token string and a function for looking up the key.
	// The latter is especially useful if you use multiple keys for your application.
	// The standard is to use 'kid' in the head of the token to identify
	// which key to use, but the parsed token (head and claims) is provided
	// to the callback, providing flexibility.
	claims, err := services.ValidateRefreshToken(tokenReq.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Code:    http.StatusUnauthorized,
			Message: err.Error(),
		})
	}
	user := services.GetUser(claims["sub"].(string))
	tokenPair := services.CreateTokenPair(user)

	services.InvalidateRefreshToken(user.ID, tokenReq.RefreshToken)

	c.JSON(http.StatusOK, models.TokenResponse{
		AccessToken:  tokenPair.AccessToken,
		RefreshToken: tokenPair.RefreshToken,
	})
}
