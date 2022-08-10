package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/service"
)

// DumpToDcmTest ...
func DumpToDcmTest(c *gin.Context) {
	if err := service.CreateWorklist("24334", "OPT", models.Patient{}, models.User{}, models.DiagnosticProcedure{}); err != nil {
		c.JSON(500, err)
	}

	c.JSON(200, "Success")
}
