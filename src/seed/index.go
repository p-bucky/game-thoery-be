package seed

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"gameTheory.com/m/src/models"
)

func SeedData() {
	tables := []string{"opinions"}
	seedFunc := map[string]interface{}{
		"opinions": SeedOpinions,
	}

	for i := 0; i < len(tables); i++ {
		tableName := tables[i]
		path := fmt.Sprintf(".data/%s.json", tableName)

		data, err := os.ReadFile(path)
		if err != nil {
			log.Fatal("Failed to read JSON file:", err)
		}
		seedFunc[tableName].(func(interface{}))(data)
	}
}

func SeedOpinions(data interface{}) {
	type Values struct {
		Description string `json:"description"`
		IsActive    bool   `json:"is_active"`
	}

	type Opinion struct {
		Values Values `json:"values"`
	}

	var opinions []Opinion
	if err := json.Unmarshal(data.([]byte), &opinions); err != nil {
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
