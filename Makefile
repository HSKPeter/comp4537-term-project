api:
	@(cd services/backend-api && make dev)

auth:
	@(cd services/authentication/src && node server.js)

react:
	@(cd services/frontend && npm run start)