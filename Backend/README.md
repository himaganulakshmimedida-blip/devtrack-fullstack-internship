# DevTrack – Backend REST API

DevTrack is a project and task management backend built using Node.js, Express.js and MongoDB.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- MongoDB Node.js Driver
- CORS
- dotenv

## Project Setup

### 1. Install Dependencies

```bash
npm install
### 2. Environment Variables

Create a `.env` file in the Backend folder:

```env
MONGODB_URI=your_mongodb_connection_string
## API Endpoints

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get a user by ID |
| POST | `/api/users` | Create a new user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create a new project |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get a task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### AI

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai` | Generate AI response |

### HTTP Status Codes

- `200` — Request successful
- `201` — Resource created successfully
- `400` — Invalid input
- `404` — Resource not found
- `500` — Server error