# Full-Stack Store Review Application

## Project Description

This is a full-stack web application that serves as a platform for users to submit and manage ratings for various stores. The application features a complete authentication system and role-based access control, providing distinct functionalities for three different user roles: System Administrator, Normal User, and Store Owner.

### Key Features:

*   **Role-Based Dashboards:** Each user role has a unique dashboard tailored to their permissions and needs.
*   **System Administrator:** Can manage the entire platform, including adding new users (of any role) and stores. They have access to an overview dashboard with site-wide statistics and can view, filter, and sort lists of all users and stores.
*   **Normal User:** Can sign up, log in, browse and search for stores, submit or modify ratings (from 1 to 5), and update their own password.
*   **Store Owner:** Can log in to view a dashboard specific to their store, showing its average rating and a detailed list of all users who have submitted a rating.

### Tech Stack:

*   **Backend:** Node.js, Express.js, Sequelize (ORM), PostgreSQL
*   **Frontend:** React.js (Vite), React Router, Axios
*   **Authentication:** JWT (JSON Web Tokens)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v16 or later)
*   npm
*   PostgreSQL

### Installation

1.  **Clone the repository** (or download the source code).

2.  **Backend Setup**
    *   Navigate to the `backend` directory: `cd backend`
    *   Install the dependencies: `npm install`
    *   Set up your environment variables:
        *   Copy the `.env.example` file to a new file named `.env`.
        *   Edit the `.env` file with your local PostgreSQL database credentials. You will need to have a database created (e.g., `CREATE DATABASE roxiler_assessment;`).
    *   Start the backend server: `npm run dev`
    *   The server will be running on `http://localhost:3001`.

3.  **Frontend Setup**
    *   In a new terminal, navigate to the `frontend` directory: `cd frontend`
    *   Install the dependencies: `npm install`
    *   Start the frontend development server: `npm run dev`
    *   The application will be running on `http://localhost:5173` (or another port if 5173 is busy).

### Database Management

To help with development and testing, the following scripts are available in the `backend` directory:

*   **`npm run db:reset`**: This command will **drop all existing tables** in your database and then **recreate them** based on the application's models.

*   **`npm run db:seed`**: This command will populate your database with essential initial data, including a default administrator user. This is crucial for setting up a testing environment.
    *   **Default Admin Credentials:**
        *   **Email:** `admin@gmail.com`
        *   **Password:** `AdminPassword1!`