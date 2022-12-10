# Copyright 2021 Kidus Tiliksew

# This file is part of Tensor EMR.

# Tensor EMR is free software: you can redistribute it and/or modify
# it under the terms of the version 2 of GNU General Public License as published by
# the Free Software Foundation.

# Tensor EMR is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.


PROJECT_NAME := "tensoremr-server"
PKG := "github.com/Tensor-Systems/emr-server"
MAIN_FILE := "main.go"
PKG_LIST := $(shell go list ./...)
GO_FILES := $(shell find . -name '*.go' | grep -v _test.go)

VERSION := 1.0.0

LINTERS := \
	github.com/rakyll/gotest \
	golang.org/x/lint/golint \
	honnef.co/go/tools/cmd/staticcheck

.PHONY: all init dep build clean test coverage coverhtml lint golint vet staticcheck

all: build

lint: testdep ## Lint files
	@golint -set_exit_status ${PKG_LIST}

vet: testdep ## Checks correctness 
	@go vet ${PKG_LIST}

test: ## Run unit tests
	@go test -short ${PKG_LIST}

test-coverage: ## Run tests with coverage
	@go test -short -coverprofile cover.out -covermode=atomic ${PKG_LIST} 
	@cat cover.out >> coverage.txt

test-int: ## Run unit and integration tests
	@go test -short -tags=integration ${PKG_LIST}

coverage: ## Generate global code coverage report
	./scripts/coverage.sh;

dep: ## Get dependencies
	@go mod tidy

testdep: ## Get dev dependencies
	@go get -v $(LINTERS)

run:
	@go build -o ./bin/$(PROJECT_NAME) ./$(MAIN_FILE) && ./bin/$(PROJECT_NAME)
	
build: dep ## Build the binary file
	@go build -o ./bin/$(PROJECT_NAME) ./$(MAIN_FILE)

clean: ## Remove previous build
	@rm -f ./bin

help: ## Display this help screen
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}

