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

clear-test:
	docker compose -f docker-compose.test.yml down -v

update-db:
	pnpx prisma migrate dev
	pnpx prisma generate

seed-dev:
	docker exec -it music-sandbox-app-dev pnpm prisma db seed

seed-prod:
	docker exec -it music-sandbox-app-prod node dist/seed/seed.mjs
	
free-space:
	docker volume prune -f
	docker image prune -a -f
	docker container prune -f

get-mma-grooves: 
	docker exec music-sandbox-app-dev bash -c 'find /opt/mma/lib -name "*.mma" -exec python3 /opt/mma/mma.py -Dbo {} \; | grep -E "^[a-zA-Z0-9_-]+$" | sort -u' > all_grooves.txt