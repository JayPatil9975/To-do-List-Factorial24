# To-Do List App

A modern full-stack To-Do List application with user authentication, profile management, and a beautiful glassmorphic UI.

---

## Features

- **User Registration & Login**  
  Secure authentication with JWT and password hashing.

- **Personal To-Do List**  
  Each user manages their own tasks (add, edit, delete, complete).

- **Profile Modal**  
  Click the profile icon (top right) to view your info and logout.

- **Responsive & Modern UI**  
  Glassmorphic design using custom CSS.

---

## Tech Stack

- **Frontend:** React, CSS (no framework), Bootstrap (for legacy, can be removed)
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt

---

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB Atlas or local MongoDB

---

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd To-Do-List
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

- Create a `.env` file (optional, for secrets).
- Update `MONGO_URI` and `JWT_SECRET` in `server.js` as needed.

**Start the backend:**
```bash
npm start
```
Server runs on [http://localhost:8080](http://localhost:8080)

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

**Start the frontend:**
```bash
npm start
```
App runs on [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
backend/
  server.js
  package.json
  .gitignore
frontend/
  src/
    App.js
    App.css
    Login.js
    Register.js
    Profile.js
    auth.js
    index.js
    index.css
  public/
    index.html
  package.json
  .gitignore
```

---

## Usage

1. Register a new account.
2. Log in to access your personal to-do list.
3. Add, edit, complete, or delete tasks.
4. Click the profile icon (👤) at the top right to view your profile or logout.

---

## Customization

- **UI:**  
  Edit `App.css`, `Login.js`, `Register.js`, and `Profile.js` for styling.
- **Backend:**  
  Edit `server.js` for API logic and security.

---

## License

This project is for educational/demo purposes.  
Feel free to use and
