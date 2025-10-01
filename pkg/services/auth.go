package services

import (
	"errors"
	"time"

	"github.com/Damillora/phoebe/pkg/config"
	"github.com/Damillora/phoebe/pkg/database"
	"github.com/Damillora/phoebe/pkg/models"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

func Login(username string, password string) *database.User {
	user := GetUserFromUsername(username)

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil
	}
	return user
}

func CreateTokenPair(user *database.User) models.TokenPairModel {
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": user.Email,
		"name":  user.Username,
		"iss":   "phoebe-api",
		"sub":   user.ID,
		"aud":   "phoebe",
		"exp":   time.Now().Add(time.Minute * 15).Unix(),
	})
	jwtAccessToken, _ := accessToken.SignedString([]byte(config.CurrentConfig.AuthSecret))
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iss": "phoebe-api",
		"sub": user.ID,
		"aud": "refresh",
		"exp": time.Now().Add(time.Hour * 24 * 90).Unix(),
	})
	jwtRefreshToken, _ := refreshToken.SignedString([]byte(config.CurrentConfig.AuthSecret))

	post := database.UserToken{
		UserID:    user.ID,
		Token:     jwtRefreshToken,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	database.DB.Create(&post)

	return models.TokenPairModel{
		AccessToken:  jwtAccessToken,
		RefreshToken: jwtRefreshToken,
	}
}

func ValidateToken(signedToken string) (jwt.MapClaims, error) {
	claims := jwt.MapClaims{}

	_, err := jwt.ParseWithClaims(
		signedToken,
		claims,
		func(token *jwt.Token) (interface{}, error) {
			return []byte(config.CurrentConfig.AuthSecret), nil
		},
	)
	if err != nil {
		return nil, err
	}
	if !claims.VerifyAudience("phoebe", true) {
		return nil, errors.New("Incorrect type of token")
	}

	if !claims.VerifyExpiresAt(time.Now().Local().Unix(), true) {
		return nil, errors.New("Token is expired")
	}

	return claims, nil
}

func VerifyRefreshToken(id string, token string) bool {
	var userToken database.UserToken
	result := database.DB.Where("user_id = ? AND token = ?", id, token).First(&userToken)

	return result.Error == nil
}

func InvalidateRefreshToken(id string, token string) {
	var userToken database.UserToken
	database.DB.Where("user_id = ? AND token = ?", id, token).Delete(&userToken)
}

func ValidateRefreshToken(signedToken string) (jwt.MapClaims, error) {
	claims := jwt.MapClaims{}

	_, err := jwt.ParseWithClaims(
		signedToken,
		claims,
		func(token *jwt.Token) (interface{}, error) {
			return []byte(config.CurrentConfig.AuthSecret), nil
		},
	)
	if err != nil {
		return nil, err
	}
	if !claims.VerifyAudience("refresh", true) {
		return nil, errors.New("Incorrect type of token")
	}

	if !claims.VerifyExpiresAt(time.Now().Local().Unix(), true) {
		return nil, errors.New("Token is expired")
	}

	user := GetUser(claims["sub"].(string))
	if !VerifyRefreshToken(user.ID, signedToken) {
		return nil, errors.New("Refresh token not recorded")
	}

	return claims, nil
}
