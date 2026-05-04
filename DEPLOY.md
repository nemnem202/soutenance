# Deployment — Music Sandbox

## Requirements

- A **Linux** machine
- **Docker** installed ([official guide](https://docs.docker.com/engine/install/))
- **Docker Compose** installed — bundled natively with Docker Desktop, otherwise install it separately ([official guide](https://docs.docker.com/compose/install/))
- A **Google Cloud Console** account (for OAuth2 authentication)
- A **Cloudinary** account (for image and midifiles storage)

---

## 1. Create the `docker-compose.deploy.yml` file

Create a `docker-compose.deploy.yml` file at the root of the project and paste the following content:

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: music-sandbox-db-deploy
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      retries: 5
  app:
    image: ghcr.io/nemnem202/music-sandbox:latest
    container_name: music-sandbox-app-deploy
    depends_on:
      db:
        condition: service_healthy
    environment:
      NODE_ENV: prod
    env_file:
      - .env
    ports:
      - "${APP_PORT}:3000"
    command: ["sh", "-c", "pnpm prisma migrate deploy && node ./dist/server/index.mjs"]
    restart: unless-stopped
```

---

## 2. Create the `.env` file

Create a `.env` file in the same directory as `docker-compose.deploy.yml` and fill in the values according to the template below.

```dotenv
# Database
POSTGRES_USER=USER_EXAMPLE
POSTGRES_PASSWORD=PASSWORD_EXAMPLE
POSTGRES_DB=DB_EXAMPLE
DATABASE_URL=postgresql://USER_EXAMPLE:PASSWORD_EXAMPLE@db:5432/DB_EXAMPLE?schema=public

# Application
APP_PORT=3000
TOKEN_SECRET=EXAMPLE_SECRET_KEY

# Google OAuth2
GOOGLE_CLIENT_ID=EXAMPLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=EXAMPLE_CLIENT_SECRET
GOOGLE_REDIRECT_PATH=/api/auth/callback
APP_BASE_URL=http://domain.com

# Cloudinary
CLOUD_API_KEY=EXAMPLE_API_KEY
CLOUD_API_SECRET=EXAMPLE_API_SECRET
CLOUD_IMAGE_FOLDER_NAME=EXAMPLE_FOLDER
CLOUD_NAME=EXAMPLE_NAME
```

### Google OAuth2 variables

`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `GOOGLE_REDIRECT_PATH` correspond to the credentials of the OAuth2 application created in the **Google Cloud Console**.

To get them: Google Cloud Console → *APIs & Services* → *Credentials* → create an *OAuth 2.0 Client ID*. The `GOOGLE_REDIRECT_PATH` must be registered as an authorized redirect URI in the console (e.g. `http://domain.com/api/auth/callback`).

### Cloudinary variables

`CLOUD_API_KEY`, `CLOUD_API_SECRET`, `CLOUD_NAME` and `CLOUD_IMAGE_FOLDER_NAME` are available in your **Cloudinary** account dashboard (*Settings* → *API Keys*). `CLOUD_IMAGE_FOLDER_NAME` is the name of the folder where images will be stored.

---

## 3. Start the application

Once both files are created and the `.env` is filled in, start the containers:

```bash
docker compose -f docker-compose.deploy.yml up --build
```

The application starts and Prisma migrations are applied automatically when the `app` container launches.

---

## 4. Seed the database

Once the application is running, execute the seed inside the `app` container:

```bash
docker exec -it music-sandbox-app-deploy node dist/seed/seed.mjs
```