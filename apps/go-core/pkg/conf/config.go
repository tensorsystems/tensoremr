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

package conf

import (
	"log"

	"github.com/caarlos0/env"
	"github.com/joho/godotenv"
)

// Configuration ...
type Configuration struct {
	AppEnv  string `env:"APP_ENV" envDefault:":local"`
	Address string `env:"ADDRESS" envDefault:":8080"`

	DBHost     string `env:"DB_HOST" envDefault:"emr-docker_db_1"`
	DBDriver   string `env:"DB_HOST" envDefault:"postgres"`
	DBUser     string `env:"DB_USER" envDefault:"postgres"`
	DBPassword string `env:"DB_PASSWORD" envDefault:"password"`
	DBName     string `env:"DB_NAME" envDefault:"emr"`
	DBPort     string `env:"DB_PORT" envDefault:"5432"`

	ElasticAddress string `env:"ELASTIC_ADDRESS"`
	JwtSecret      string `env:"JWT_SECRET"`
	JwtIssuer      string `env:"JWT_ISSUER"`
}

// NewConfig ...
func NewConfig(files ...string) (*Configuration, error) {
	err := godotenv.Load(files...)

	if err != nil {
		log.Printf("No .env file could be found %q\n", files)
	}

	cfg := Configuration{}
	err = env.Parse(&cfg)
	if err != nil {
		return nil, err
	}

	return &cfg, nil
}
