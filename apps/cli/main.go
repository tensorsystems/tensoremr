package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/RediSearch/redisearch-go/redisearch"
	"github.com/jackc/pgx/v5"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/thirdpartyemailpassword"
	"github.com/supertokens/supertokens-golang/recipe/thirdpartyemailpassword/tpepmodels"
	"github.com/supertokens/supertokens-golang/recipe/usermetadata"
	"github.com/supertokens/supertokens-golang/recipe/userroles"
	"github.com/supertokens/supertokens-golang/supertokens"
	"github.com/tensorsystems/tensoremr/apps/cli/service"
	core_services "github.com/tensorsystems/tensoremr/apps/core/pkg/service"
	"github.com/urfave/cli/v2"
)

func main() {
	port := os.Getenv("APP_PORT")

	// SuperTokens
	apiBasePath := "/api/auth"
	websiteBasePath := "/auth"
	err := supertokens.Init(supertokens.TypeInput{
		Supertokens: &supertokens.ConnectionInfo{
			ConnectionURI: os.Getenv("SUPERTOKEN_URL"),
			APIKey:        os.Getenv("SUPERTOKEN_API_KEY"),
		},
		AppInfo: supertokens.AppInfo{
			AppName:         "tensoremr",
			APIDomain:       "http://localhost:" + port,
			WebsiteDomain:   os.Getenv("WEBSITE_DOMAIN"),
			APIBasePath:     &apiBasePath,
			WebsiteBasePath: &websiteBasePath,
		},
		RecipeList: []supertokens.Recipe{
			thirdpartyemailpassword.Init(&tpepmodels.TypeInput{}),
			session.Init(nil),
			usermetadata.Init(nil),
			userroles.Init(nil),
		},
	})

	if err != nil {
		panic(err.Error())
	}

	// open postgres
	postgresDb, err := OpenPostgres()
	if err != nil {
		log.Fatal("couldn't connect to postgres: ", err)
	}

	fhirService := core_services.FHIRService{Config: core_services.FHIRConfig{URL: os.Getenv("FHIR_BASE_URL") + "/fhir-server/api/v4/", Username: os.Getenv("FHIR_USERNAME"), Password: os.Getenv("FHIR_PASSWORD")}}
	practitionerService := core_services.PractitionerService{FHIRService: fhirService}
	authService := core_services.AuthService{}
	roleService := core_services.RoleService{}

	userService := core_services.UserService{
		FHIRService:         fhirService,
		PractitionerService: practitionerService,
		AuthService:         authService,
		RoleService:         roleService,
		Context:             context.Background(),
	}

	seedService := service.SeedService{
		UserService: userService,
		RoleService: roleService,
	}

	redisClient := redisearch.NewClient(os.Getenv("REDIS_ADDRESS"), os.Getenv("LOINC_INDEX"))
	loincService := service.LoincService{RedisClient: redisClient}
	idService := service.IdService{SqlDB: postgresDb}

	app := &cli.App{
		Commands: []*cli.Command{
			{
				Name:  "create-tables",
				Usage: "create database tables",
				Action: func(cCtx *cli.Context) error {
					if err := idService.CreatePatientTable(); err != nil {
						return err
					}

					if err := idService.CreateEncounterTable(); err != nil {
						return err
					}

					return nil
				},
			},
			{
				Name:  "loinc-import",
				Usage: "import loinc dataset into redis",
				Action: func(cCtx *cli.Context) error {
					err := loincService.ImportLoinc()
					if err == nil {
						fmt.Println("imported loinc successfully")
					}
					return err
				},
			},
			{
				Name:  "seed",
				Usage: "seed data",
				Subcommands: []*cli.Command{

					{
						Name:  "roles",
						Usage: "seed roles",
						Action: func(cCtx *cli.Context) error {
							err := seedService.SeedRoles(context.Background())
							if err == nil {
								fmt.Println("seeded roles successfully")
							}
							return err
						},
					},
					{
						Name:  "users",
						Usage: "seed users",
						Action: func(cCtx *cli.Context) error {
							err := seedService.SeedUsers(context.Background())
							if err == nil {
								fmt.Println("seeded users successfully")
							}
							return err
						},
					},
				},
			},
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}

func OpenPostgres() (*pgx.Conn, error) {
	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	connStr := fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=disable TimeZone=UTC password=%s", dbHost, dbPort, dbUser, dbName, dbPassword)

	return pgx.Connect(context.Background(), connStr)
}
