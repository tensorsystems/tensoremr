[<img src="./logo.png" width="250"/>](./logo.png)

ℹ️ *This project is in active development and is not production ready. Contributions are welcome*


# Setting up for development 

## Prerequisites

- Go 
    - Any recent version of Go should work
- Node
    - Any recent version of Node should, however version v18.12.0 is recommended
- Docker 

## Setup 

1. Run the command `yarn` or `npm install` in the project root
2. Run `docker-compose up` in `docker/dev`. This will setup `postgres`, `redis`, `pgadmin`, and `supertokens`
3. Run `yarn nx serve cli seed roles`. This will seed necessary roles in supertokens 
4. Run `yarn nx serve cli seed users`. This will seed some users. Checkout the user management dashboard `http://localhost:8081/api/auth/dashboard` after seeding 

### FHIR Server

Tensor EMR uses FHIR to store clinical data natively. Since the FHIR model is standardized, you may be able to use any FHIR sever in production. However, Tensor EMR is currently being developed with LinuxForHealth’s FHIR server built on Java. Go ahead and install that on your machine.

After installation, you'll need to change some configuration files before starting the server. Replaces the following configs with the ones provided in [here](https://github.com/tensorsystems/tensoremr/blob/main/config/FHIR)

1. [datasources.xml](https://github.com/tensorsystems/tensoremr/blob/main/config/FHIR/datasources.xml) found in `defaultServer/configDropins/defaults/datasources.xml`
2. [extension-search-parameters.json](https://github.com/tensorsystems/tensoremr/blob/main/config/FHIR/extension-search-parameters.json) found in `defaultServer/config/default/extension-search-parameters.json`
3. [fhir-server-config.json](https://github.com/tensorsystems/tensoremr/blob/main/config/FHIR/fhir-server-config.json) found in `defaultServer/config/default/fhir-server-config.json`
4. [server.xml](https://github.com/tensorsystems/tensoremr/blob/main/config/FHIR/server.xml) found in `defaultServer/server.xml`

### Snowstorm

Tensor EMR uses SNOMED-CT for terminology. Snowstorm is a terminology server that provides support for SNOMED-CT. You may install it here 

https://github.com/IHTSDO/snowstorm

**Note:** You will need to acquire the release files from snomed to start the server https://www.snomed.org/get-snomed 

### LOINC

LOINC is another termonology standard that provides coding for various observations as well as provide forms.

We access their resources using their FHIR API service. You'll need to go to their [website](https://loinc.org/fhir/) and get a username and password. 

After getting a username and password, update the loinc fields in the [core-service environment variables file](https://github.com/tensorsystems/tensoremr/blob/main/apps/core/.env)

After that, run `yarn nx serve loinc-import` in the project root 
