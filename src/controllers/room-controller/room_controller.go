package room_controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllRoom(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Startups fetched successfully", "status": "success"})
}
