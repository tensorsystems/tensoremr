package main

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/rest"
	"github.com/pocketbase/pocketbase/tools/types"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/controllers"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/repository"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/seeds"
)

type Server struct {
}

func main() {
	fmt.Println(`
  Copyright 2021 Kidus Tiliksew

  This program is part of Tensor EMR.

  Tensor EMR is free software: you can redistribute it and/or modify
  it under the terms of the version 2 of GNU General Public License as published by
  the Free Software Foundation.

  Tensor EMR is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
	`)

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	app := pocketbase.New()

	app.OnRecordBeforeCreateRequest().Add(func(e *core.RecordCreateEvent) error {
		if e.Record.TableName() == "schedules" {
			data := e.Record.Data()

			startPeriod := data["startPeriod"].(types.DateTime).Time()
			endPeriod := data["endPeriod"].(types.DateTime).Time()

			if startPeriod.Before(time.Now()) {
				return rest.NewBadRequestError("Invalid date", errors.New("Invalid date"))
			}

			repo := repository.NewScheduleRepository(app.DB().DB())
			count, err := repo.CountByEndPeriod(startPeriod, endPeriod)
			if err != nil {
				return err
			}

			if count > 0 {
				return rest.NewBadRequestError("Other schedules exists for this resource in this time period", errors.New("Other schedules exists for this resource in this time period"))
			}
		}

		return nil
	})

	app.OnBeforeServe().Add(func(data *core.ServeEvent) error {
		if err := SeedDb(app.DB().DB()); err != nil {
			return err
		}

		return nil
	})

	app.OnBeforeServe().Add(func(data *core.ServeEvent) error {
		data.Router.AddRoute(echo.Route{
			Method:  http.MethodPost,
			Path:    "/api/appointments",
			Handler: controllers.CreateAppointment,
		})
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}

}

func SeedDb(db *sql.DB) (error error) {
	codingRepository := repository.NewCodingRepository(db)
	seeder := seeds.NewSeeder(codingRepository, &http.Client{})

	// Organization Types
	if err := seeder.SeedCodeSystem(
		"http://terminology.hl7.org/CodeSystem/organization-type",
		"https://www.hl7.org/fhir/codesystem-organization-type.json",
	); err != nil {
		error = err
	}

	// Identifier Types
	if err := seeder.SeedCodeSystem(
		"http://terminology.hl7.org/CodeSystem/v2-0203",
		"https://terminology.hl7.org/3.1.0/CodeSystem-v2-0203.json",
	); err != nil {
		error = err
	}

	// Contact Types
	if err := seeder.SeedCodeSystem(
		"http://terminology.hl7.org/CodeSystem/contactentity-type",
		"https://www.hl7.org/fhir/codesystem-contactentity-type.json",
	); err != nil {
		error = err
	}

	// Service Category
	if err := seeder.SeedCodeSystem(
		"http://terminology.hl7.org/CodeSystem/service-category",
		"https://www.hl7.org/fhir/codesystem-service-category.json",
	); err != nil {
		error = err
	}

	// Service Type
	if err := seeder.SeedCodeSystem(
		"http://terminology.hl7.org/CodeSystem/service-type",
		"https://www.hl7.org/fhir/codesystem-service-type.json",
	); err != nil {
		error = err
	}

	// Practice code
	if err := seeder.SeedValueSet(
		"http://hl7.org/fhir/ValueSet/c80-practice-codes",
		"https://www.hl7.org/fhir/valueset-c80-practice-codes.json",
	); err != nil {
		error = err
	}

	// Appointment reason
	if err := seeder.SeedCodeSystem(
		"http://terminology.hl7.org/CodeSystem/v2-0276",
		"https://terminology.hl7.org/3.1.0/CodeSystem-v2-0276.json",
	); err != nil {
		error = err
	}

	// Appointment reason
	if err := seeder.SeedCodeSystem(
		"http://hl7.org/fhir/slotstatus",
		"https://www.hl7.org/fhir/codesystem-slotstatus.json",
	); err != nil {
		error = err
	}

	// Resource Types
	if err := seeder.SeedCodeSystem(
		"http://hl7.org/fhir/resource-types",
		"https://hl7.org/fhir/codesystem-resource-types.json",
	); err != nil {
		error = err
	}

	return nil
}
