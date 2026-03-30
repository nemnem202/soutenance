dev:
	docker compose --env-file .env.dev -f docker-compose.dev.yml up --build
ci:
	docker compose --env-file .env.prod -f docker-compose.ci.yml up --build --exit-code-from app