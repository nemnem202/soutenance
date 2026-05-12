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
	@echo "=== Containers arrêtés ==="
	docker container prune -f

	@echo "=== Images inutilisées ==="
	docker image prune -a -f

	@echo "=== Volumes orphelins ==="
	docker volume prune -f

	@echo "=== Networks inutilisés ==="
	docker network prune -f

	@echo "=== Cache de build (BuildKit) ==="
	docker buildx prune -a -f

	@echo "=== Logs des containers (truncate) ==="
	@for cid in $$(docker ps -q); do \
		log=$$(docker inspect --format='{{.LogPath}}' $$cid); \
		if [ -n "$$log" ] && [ -f "$$log" ]; then \
			truncate -s 0 $$log && echo "Log vidé : $$log"; \
		fi \
	done

	@echo "=== Résumé espace récupéré ==="
	docker system df

get-mma-grooves: 
	docker exec music-sandbox-app-dev bash -c 'find /opt/mma/lib -name "*.mma" -exec python3 /opt/mma/mma.py -Dbo {} \; | grep -E "^[a-zA-Z0-9_-]+$" | sort -u' > all_grooves.txt