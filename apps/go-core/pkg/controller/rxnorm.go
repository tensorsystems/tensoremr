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

package controller

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

// GetDrugs ...
func GetDrugs(c *gin.Context) {
	medicationName := c.Query("name")

	if len(medicationName) == 0 {
		c.String(http.StatusInternalServerError, fmt.Sprintf("error: %s", "No medication name"))
	}

	s := strings.Split(medicationName, " ")
	value := strings.Join(s, "%20")

	baseUrl := os.Getenv("RXNORM_ADDRESS")

	url := baseUrl + "/REST/drugs.json?name=" + value
	resp, err := http.Get(url)
	if err != nil {
		c.String(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)

	if err != nil {
		c.String(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
	}

	respString := string(body)

	var jsonMap map[string]interface{}
	json.Unmarshal([]byte(respString), &jsonMap)

	c.JSON(200, jsonMap)
}

// GetDrugInteractions ...
func GetDrugIntractions(c *gin.Context) {
	rxCuis := c.Query("rxcuis")

	if len(rxCuis) == 0 {
		c.String(http.StatusInternalServerError, fmt.Sprintf("error: %s", "No medication name"))
	}

	s := strings.Split(rxCuis, " ")
	value := strings.Join(s, "%20")

	baseUrl := os.Getenv("RXNORM_ADDRESS")

	url := baseUrl + "/REST/interaction/list.json?rxcuis=" + value

	resp, err := http.Get(url)
	if err != nil {
		c.String(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)

	if err != nil {
		c.String(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
	}

	respString := string(body)

	var jsonMap map[string]interface{}
	json.Unmarshal([]byte(respString), &jsonMap)

	c.JSON(200, jsonMap)
}
