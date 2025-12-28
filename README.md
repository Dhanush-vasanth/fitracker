# FitTracker 💪

A full-stack MERN application for tracking workouts and fitness progress.

## 🌐 Live Demo

- **Frontend**: [https://fitracker-frontend.onrender.com](https://fitracker-frontend.onrender.com)
- **Backend API**: [https://fitracker-4.onrender.com](https://fitracker-4.onrender.com)

## Features

- 🔐 User Authentication (Sign Up/Sign In)
- 📊 Dashboard with workout analytics
- 💪 Add and track workouts
- 📈 Visual charts for progress tracking
- 📅 Date-wise workout filtering
- 🎯 Calorie burn calculations

## Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Styled Components
- Material-UI
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fitness-tracker
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT=your_jwt_secret_key
   PORT=8080
   ```

5. **Start the application**

   **Start the server (from server directory):**
   ```bash
   npm start
   # or
   node index.js
   ```

   **Start the client (from client directory):**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/user/signup` - User registration
- `POST /api/user/signin` - User login

### Workouts
- `GET /api/user/dashboard` - Get dashboard data
- `GET /api/user/workout` - Get workouts by date
- `POST /api/user/workout` - Add new workout

## Workout Format

When adding workouts, use this format:
```
#Category
Workout Name
Sets x Reps (e.g., 3 sets x 15 reps)
Weight (e.g., 30kg)
Duration (e.g., 15mins)
```

Example:
```
#chest
pushups
3 sets x 15 reps
30kg
15mins
```

## Project Structure

```
fitness-tracker/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   └── api/
│   └── package.json
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.