confirm-prod:
	@echo "Have you specified production mode in .env file? [y/N]" && read ans && [ $${ans:-N} = y ]

build: confirm-prod
	@sam build

run: build
	@sam local start-api --skip-pull-image

deploy: build
	@sam deploy

dev:
	@npm run dev