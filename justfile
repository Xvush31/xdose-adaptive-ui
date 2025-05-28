# Justfile pour automatiser les tâches courantes du projet

dev:
	npm run dev

test:
	npm run test

lint:
	npx eslint .

format:
	npm run format

build:
	npm run build

coverage:
	npm run coverage

deploy:
	npx vercel --prod

optimize-images:
	node scripts/optimize-images.cjs
