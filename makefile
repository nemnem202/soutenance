dev:
	docker compose --env-file .env.dev -f docker-compose.dev.yml up --build
test:
	docker compose --env-file .env.test.local -f docker-compose.test.yml up --build
ci:
	docker compose --env-file .env.prod -f docker-compose.ci.yml up --build --exit-code-from app
prod:
	docker compose --env-file .env.prod -f docker-compose.prod.yml up --build
	
clear-dev:
	docker compose -f docker-compose.dev.yml down -v
clear-prod:
	docker compose -f docker-compose.prod.yml down -v

update-db:
	pnpx prisma migrate deploy

free-space:
	docker volume prune -f
	docker image prune -a -f
	docker container prune -f