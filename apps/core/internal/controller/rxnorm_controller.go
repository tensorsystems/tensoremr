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
	"github.com/gin-gonic/gin"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
	"github.com/tensorsystems/tensoremr/apps/core/internal/util"
)

type RxNormController struct {
	RxNormService service.RxNormService
}

func NewRxNormController(RxNormService service.RxNormService) RxNormController {
	return RxNormController{
		RxNormService: RxNormService,
	}
}


// Suggest ...
func (r *RxNormController) Suggest(c *gin.Context) {
	term := c.Query("term")

	suggestions, err := r.RxNormService.Suggest(term)
	if err != nil {
		util.ReqError(c, 500, err.Error())
		return
	}

	c.JSON(200, suggestions)
}

// GetApproximateTerms ...
func (r *RxNormController) GetApproximateTerms(c *gin.Context) {
	term := c.Query("term")

	approximateTerms, err := r.RxNormService.GetApproximateTerms(term)
	if err != nil {
		util.ReqError(c, 500, err.Error())
		return
	}

	c.JSON(200, approximateTerms)
}

// GetAllRelatedInfo ...
func (r *RxNormController) GetAllRelatedInfo(c *gin.Context) {
	rxcui := c.Param("rxcui")

	approximateTerms, err := r.RxNormService.GetAllRelatedInfo(rxcui)
	if err != nil {
		util.ReqError(c, 500, err.Error())
		return
	}

	c.JSON(200, approximateTerms)
}
