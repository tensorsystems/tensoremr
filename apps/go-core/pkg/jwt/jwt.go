/*
  Copyright 2021 Kidus Tiliksew

  This file is part of Tensor EMR.

  Tensor EMR is free software: you can redistribute it and/or modify
  it under the terms of the version 2 of GNU General Public License as published by
  the Free Software Foundation.

  Tensor EMR is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

package jwt

import (
	"errors"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
)

// Wrapper wraps the signing key and the issuer
type Wrapper struct {
	SecretKey       string
	Issuer          string
	ExpirationHours int64
}

// Claim adds email as a claim to the token
type Claim struct {
	ID       int
	Email    string
	Name     string
	UserType []string
	jwt.StandardClaims
}

// GenerateToken generates a jwt token
func (j *Wrapper) GenerateToken(user models.User) (signedToken string, err error) {
	var userTypes []string

	for _, e := range user.UserTypes {
		userTypes = append(userTypes, e.Title)
	}

	claims := &Claim{
		ID:       user.ID,
		Email:    user.Email,
		Name:     user.FirstName + " " + user.LastName,
		UserType: userTypes,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(j.ExpirationHours)).Unix(),
			Issuer:    j.Issuer,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err = token.SignedString([]byte(j.SecretKey))
	if err != nil {
		return
	}

	return
}

// ValidateToken validates the jwt token
//ValidateToken validates the jwt token
func (j *Wrapper) ValidateToken(signedToken string) (claims *Claim, err error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&Claim{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(j.SecretKey), nil
		},
	)

	if err != nil {
		return
	}

	claims, ok := token.Claims.(*Claim)
	if !ok {
		err = errors.New("Couldn't parse claims")
		return
	}

	if claims.ExpiresAt < time.Now().Local().Unix() {
		err = errors.New("JWT is expired")
		return
	}

	return

}
