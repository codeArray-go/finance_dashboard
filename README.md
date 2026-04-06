# Zorvyn Finance Dashboard Backend

This is the complete backend architecture for the Zorvyn finance dashboard. It is built using Node.js and allows users with admin access to manage financial records (income and expenses) securely. It features a multi-tenant organization system and Role-Based Access Control to ensure that only authorized users (Admin, Analyst, Viewer) can view or modify specific data.

## Key Features
- **Organization Isolation:** Users and their financial data are kept secure and separate based on their Organization ID.
- **Role-Based Access Control:** Three distinct roles (`admin`, `analyst`, `viewer`) control who can create, read, update, or delete records.
- **Advanced Data Analytics:** Uses PostgreSQL to calculate net balances, category-wise expenses, and monthly trends directly in the database.
- **High Performance:** Uses Redis caching to store user sessions, making authentication checks blazing fast.
- **Security:** Protected by JSON Web Tokens (JWT) inside HTTP-only cookies and Arcjet for rate limiting and bot detection.

## Tech Stack Used
- **Runtime:** Node.js, Express.js
- **Database:** PostgreSQL (with `pg` pool)
- **Cache:** Redis
- **Security:** bcrypt (password hashing), JWT (authentication), Arcjet (rate limiting)

---

## 📂 Folder Structure

```text
root/
├── src/
│   ├── controllers/      # Handles incoming HTTP requests and sends back responses
│   │   ├─ auth.controller.js
│   │   └─ data.controller.js
│   │
│   ├── lib/              # Database, Redis, and Arcjet setup/connections
│   │   ├─ arcjet.js
│   │   ├─ env.js
│   │   ├─ pool.js
│   │   ├─ redis.js
│   │   └─ schema.js
│   │
│   ├── middlewares/      # Security checks (JWT verification and Role Guards)
│   │   ├─ arcjet.middleware.js
│   │   ├─ auth.middleware.js
│   │   └─ roleGuard.middleware.js
│   │
│   ├── repositories/     # Database layer (Raw SQL queries)
│   │   ├─ auth.repository.js
│   │   └─ data.repository.js
│   │
│   ├── routes/           # Defines all the API endpoints
│   │   ├─ auth.routes.js
│   │   └─ data.routes.js
│   │
│   ├── services/         # Core logic and data validation
│   │   ├─ auth.service.js
│   │   └─ data.service.js
│   │
│   ├── utils/            # Helper functions (Hashing, Tokens, Validators)
│   │   ├─ hash.js
│   │   ├─ token.js
│   │   └─ validators.js
│   │
│   └── server.js         # Entry point to start the application
│
├── .env
├── package-lock.json
└── package.json
``` 
<br>

## **API references & Expected Payloads**
With help of following routes you could handle user login, registration, and role management related tasks. <br>

All endpoints, required roles, and exactly what data the frontend needs to send (Payload/Parameters) to make a successful request are mentioned in table below. <br>

*Note: All `POST` and `PATCH` requests expect data in JSON format.*

| Category | Method | Endpoint | Required Role | Data Location | Required Payload / Params | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/signUp` | *Public* | Body (JSON) | `fullName`, `email`, `password`, `orgName`, `role` | Registers a new user and creates a new organization for them. |
| **Auth** | `POST` | `/api/auth/login` | *Public* | Body (JSON) | `email`, `password`, `orgId`, `role` | Authenticates the user and sets a secure JWT cookie. |
| **Auth** | `POST` | `/api/auth/create` | `admin` | Body (JSON) | `fullName`, `email`, `password`, `role`, `orgId` | Adds a new user (analyst/viewer) into the admin's organization. |
| **Auth** | `PATCH` | `/api/auth/:id/role` | `admin` | URL Params & Body | **Params:** `id`, `orgId`<br>**Body:** `email`, `role` | Updates a specific user's role. |
| **Auth** | `PATCH` | `/api/auth/:id/status`| `admin` | URL Params & Body | **Params:** `id`<br>**Body:** `email`, `orgId`, `role`, `isActive` (boolean) | Toggles a user's account status (active/inactive) to allow or block access. |
| **Data** | `GET` | `/api/data/dashboard` | `admin`, `analyst`, `viewer` | Cookies | *(None - Uses JWT cookie)* | Gets basic details of the user and their records. |
| **Data** | `GET` | `/api/data/summery` | `admin`, `analyst` | Cookies | *(None - Uses JWT cookie)* | Gets total income, expenses, net balance, and category-wise totals. |
| **Data** | `GET` | `/api/data/recent` | `admin`, `analyst` | Cookies | *(None - Uses JWT cookie)* | Fetches the 5 most recently created records. |
| **Data** | `GET` | `/api/data/finance/trends`| `admin`, `analyst` | Cookies | *(None - Uses JWT cookie)* | Gets month-over-month income and expense trends for charts. |
| **Data** | `GET` | `/api/data/finance/records`| `admin`, `analyst` | URL Query | **Optional Filters:** `?type=`, `&category=`, `&startDate=`, `&endDate=` | Fetches all records. Supports dynamic query filters. |
| **Data** | `POST` | `/api/data/finance/create`| `admin` | Body (JSON) | `amount`, `type`, `category`, `desc`, `date` | Adds a new financial entry (income or expense). |
| **Data** | `POST` | `/api/data/finance/update`| `admin` | Body (JSON) | `id`, `amount`, `type`, `category`, `description`, `date` | Modifies the details of an existing financial record. |
| **Data** | `DELETE`| `/api/data/finance/:id` | `admin` | URL Params | **Params:** `id` | Permanently deletes a specific financial record. |


<br>

## **Run Project Locally**
To run project locally on your computer follow steps given below:- <br>

***Note:-** If you are testing this project with postman it is suggest you comment out arcjet middleware from route files as done in image below. Cause it could give you bot access denied as response.*
<img src="code.png" alt="helper image" width="600">

### **1. Prerequisites**
Installation of the following is mandatory:-
- Node.js
- PostgreSQL
- Redis

### **2. Environment Variables Setup**
Create a file naming `.env` in root directory of project. Copy and paste following text int0 it and replace text <> portion with your own links.

```
# Server Configuration
PORT=5000
CLIENT_URI= <your front-end url>

# Database Connections
POSTDB_URL=<your PostgreSql db url>
REDIS_URL=<your redis url>

# Security Keys
JWT_SECRET=<Your secret jwt key>
ARCJET_KEY=<your arcjet api key>
```
*Note:- If you are unable to get your postgreSQL db URL locally then use `postgresql://your_db_username:your_db_password@localhost:5432/your_database_name` and change credentials on your need basis.*

### **3. Installation & Execution**
Open your terminal, navigate to the project folder, and run:
```bash
npm install
npm run dev
```
