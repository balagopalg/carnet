# SAWTOOTH-CARNET
A simple sawtooth "carnet" transaction family example (processor + client)

# INTRODUCTION

This is a minimal example of a sawtooth 1.0 application. This example demonstrates, a common usecase, where a insurane agent can register vehicle insurance details and claimed policy details and a customer can view those details.

An insurance agent can:
1. register vehicle insurance details
2. register the claimed policy details of the particular vehicle
A customer can:
4. view the detailed history of the vehicle regarding its insurance policy.

The vehicle is identified by a registration number and a corresponding public key. The vehicle details, is stored at an address, derived from SHA 512 hash of vehicle's registration number public key and the carnet transaction family namespace.

# Components
The application is built in two parts:
1. The client application written in js, written in: carnetclient.js file. 

2. The Transaction Processor is written in js using javascript-sawtooth-sdk. 
------

**JAVASCRIPT CLIENT NOTE**

The client is written in Javascript using node.js. The `app.js` is the main javascript file from where the `main` function call occurs. Handlebars are used for templating, client related CSS and JavaScript code is written in public folder and server related files are written in `router/` folder. Running the `carnet-build-client-js.yaml` launches the client, which is accessible at `localhost:3000`. 

How to use the simplewallet UI:

1. Build and start the Docker containers:

`docker-compose -f carnet-build-client-js.yaml up`

2. Open bash shell in `carnet-client-js` container:

`docker exec -it carnet-client-js bash`

3. Create user account for any vehicleno:

`sawtooth keygen kl028674`

4. Open new browser tab and go to `http://localhost:3000`

5.login the agent register/claim option using username : carnet and password: carnet

6. login using the vehicle register number kl028674

7. perform the register or claim option

8.The view option can be accessed by customer by login using the vehicle register number.
------


# Pre-requisites

This example uses docker-compose and Docker containers. If you do not have these installed please follow the instructions here: https://docs.docker.com/install/

**NOTE:**
The preferred OS environment is Ubuntu 16.04.3 LTS x64. Although, other linux distributions which support Docker should work. 
If you have Windows please install [Docker Toolbox for Windows](https://docs.docker.com/toolbox/toolbox_install_windows/) or [Docker for Windows](https://docs.docker.com/docker-for-windows/), based on your OS version.

**NOTE:**
The minimum version of Docker Engine necessary is 17.03.0-ce. Linux distributions often ship with older versions of Docker.

[Here's a gist](https://gist.github.com/askmish/76e348e34d93fc22926d7d9379a0fd08) detailing steps on installing docker and docker-compose.

### Working with proxies


# Usage

To launch the client, you could do this:
```bash
docker exec -it carnet-client bash

You can locate the right Docker client container name using `docker ps`.


