package routes

import (
	room_controller "gameTheory.com/m/src/controllers/room-controller"
	"github.com/gin-gonic/gin"
)

func groupRouter(baseRouter *gin.RouterGroup) {

	baseRouter.GET("/room", room_controller.GetAllRoom)
}

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	versionRouter := r.Group("/api/v1")
	groupRouter(versionRouter)

	return r
}
