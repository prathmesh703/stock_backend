# 🛍️ Streamoid Backend

A backend service for managing product data with CSV upload, search, and API access.

---

## 🚀 Tech Stack

- **Node.js** – JavaScript runtime  
- **Express** – Web framework for building APIs  
- **Prisma** – ORM for PostgreSQL  
- **PostgreSQL** – Relational database  
- **Docker & Docker Compose** – Containerization and orchestration

---

## ⚙️ Features

### 🧩 Products API

| Method | Endpoint | Description |
|---------|-----------|-------------|
| **GET** | `/products` | List all products |
| **GET** | `/products/search?brand=<query>` | Search products by name |
| **POST** | `/uploads` | Upload CSV file of products |

### 📦 CSV Upload
- Accepts a CSV file containing product data  
- Validates each row before inserting or updating records  
- Returns:
  - Count of successfully stored products  
  - List of failed rows with validation errors  

---

## 🧰 Setup & Usage

## env
- add your local 
- DATABASE_URL="postgresql://postgres:password@db:5432/streamoid"
- PORT=3000
## commands to start 
- docker-compose build
- docker-compose up
