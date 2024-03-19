package main

import (
	"gameTheory.com/m/src/models"
	"gameTheory.com/m/src/routes"
	"gameTheory.com/m/src/seed"
	"gameTheory.com/m/src/utils"
)

func main() {
	utils.LoadEnv()
	models.OpenDatabaseConnection()
	models.AutoMigrate()
	seed.SeedData()
	router := routes.SetupRoutes()

	router.Run(":8080")
}
