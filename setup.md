docker-compose up --build

docker-compose exec backend npx prisma migrate dev --name init