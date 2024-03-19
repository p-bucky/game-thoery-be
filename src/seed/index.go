package seed

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"gameTheory.com/m/src/models"
)

type Values struct {
	Description string `json:"description"`
	IsActive    bool   `json:"is_active"`
}

type Opinion struct {
	Values Values `json:"values"`
}

func SeedData() {
	data, err := os.ReadFile(".data/opinions.json")
	if err != nil {
		log.Fatal("Failed to read JSON file:", err)
	}

	var opinions []Opinion
	if err := json.Unmarshal(data, &opinions); err != nil {
		log.Fatal("Failed to unmarshal JSON data", err)
	}

	models.Database.Exec("DELETE FROM opinions")

	for i := 0; i < len(opinions); i++ {
		models.Database.Create(&models.Opinion{
			Description: opinions[i].Values.Description,
			IsActive:    opinions[i].Values.IsActive,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		})
	}

}
