# Todo App Backend (NestJS)

An **online task management service** built with **NestJS**, **Prisma**, and **PostgreSQL (Supabase)**, where each user has their **own personal account**.  
Users can **create, view, edit, and delete tasks**, optionally adding due dates, and filter/paginate their task lists.

---

## Features

- **User Authentication:** Register, Login, Logout, View Profile
- **Task Management (Todos):**
  - Create, view, update, delete tasks
  - Filter tasks by status, query text, due date
  - Pagination support
- **Secure:** JWT-based authentication
- **API Documentation:** Swagger UI

---

## Installation

1. Clone the repo:

```bash
git clone https://github.com/your-username/todo-backend.git
cd todo-backend
````

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Setup your `.env` file:

```env
JWT_SECRET="<SECRET_KEY>"
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.com:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.com:5432/postgres"
```

4. Apply Prisma migrations:

```bash
npx prisma migrate dev
```

5. Run the application:

```bash
npm run start:dev
```

The server should start on `http://localhost:3000`.

---

## Using Swagger UI

Swagger UI is automatically generated from your controllers and DTOs.

1. Open your browser and navigate to:

```
http://localhost:3000/api-docs
```

2. **Authentication:**

   * Click the **Authorize** button (top-right)
   * Enter your JWT token like this:

```
<your_jwt_token_here>
```

* You can obtain this token by logging in via `/auth/login`.

3. Now you can test any protected endpoints directly in the Swagger UI.

4. For endpoints with **pagination**:

   * Use the `page` and `limit` query parameters.
   * Example: `/todo?page=2&limit=5` will show the second page of results with 5 tasks per page.

---

## Example Requests (Postman / Swagger)

* **Register:** `POST /auth/register` with `{ email, password }`
* **Login:** `POST /auth/login` with `{ email, password }`
* **Create Todo:** `POST /todo` with `{ title, description?, dueDate? }`
* **Get Todos:** `GET /todo?status=PENDING&page=1&limit=10`
* **Edit Todo:** `PATCH /todo/:id` with `{ title?, description?, status?, dueDate? }`
* **Delete Todo:** `DELETE /todo/:id`

> All Todo routes are **JWT-protected**.

---

## Project Structure

```
src/
 ├─ auth/         # Authentication module (controller, service, guard, DTOs)
 ├─ todo/         # Todo module (controller, service, DTOs)
 ├─ users/        # User module (service, DTOs)
 ├─ prisma/       # Prisma schema and migrations
 └─ app.module.ts # Root module
```

---

## License

This project is licensed under the [MIT](./LICENSE)
