package seed

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"gameTheory.com/m/src/models"
)

func SeedData() {
	tables := []string{"opinions"}

	for i := 0; i < len(tables); i++ {
		tableName := tables[i]
		path := fmt.Sprintf(".data/%s.json", tableName)

		data, err := os.ReadFile(path)
		if err != nil {
			log.Fatal("Failed to read JSON file:", err)
		}

		var SeedData []interface{}

		if err := json.Unmarshal(data, &SeedData); err != nil {
			log.Fatal("Failed to unmarshal JSON data", err)
		}

		models.Database.Exec(fmt.Sprintf("DELETE FROM %s", tableName))

		for i := 0; i < len(SeedData); i++ {
			if val, ok := SeedData[i].(map[string]interface{}); ok {
				if vl, ok := val["values"].(map[string]interface{}); ok {
					if des := vl["description"].(string); ok {

						fmt.Println(des)
					}
				}
			}
		}
	}
}
