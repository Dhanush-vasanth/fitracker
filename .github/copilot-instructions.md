# Fitness Tracker - Copilot Instructions

## Architecture Overview
MERN stack application with separate `client/` (React 19) and `server/` (Express 5 + MongoDB) directories. Both run independently and communicate via REST API at `http://localhost:8080/api/user`.

## Development Workflow
```bash
# Server (runs on port 8080)
cd server && npm start  # Uses nodemon for hot-reload

# Client (runs on port 3000)
cd client && npm start
```

**Environment Setup**: Server requires `.env` with `MONGODB_URI`, `JWT`, and `PORT=8080`.

## Key Patterns

### API & Authentication
- All protected routes use JWT Bearer token in `Authorization` header
- Token verification: [server/middleware/verifyToken.js](server/middleware/verifyToken.js) extracts user ID to `req.user.id`
- Error handling uses `createError(status, message)` from [server/error.js](server/error.js)
- Routes follow pattern: `/api/user/{endpoint}` defined in [server/routes/User.js](server/routes/User.js)

### Workout String Format
Workouts are added via multi-line string parsed in [server/controllers/User.js](server/controllers/User.js#L222):
```
#Category
Workout Name
3 sets x 15 reps
30kg
15mins
```

### Frontend Styling
- **Styled-components** for all CSS - see pattern in [client/src/App.js](client/src/App.js)
- Theme colors via `${({ theme }) => theme.property}` - theme defined in [client/src/utils/Themes.js](client/src/utils/Themes.js)
- Material-UI icons from `@mui/icons-material`, charts from `@mui/x-charts`

### Component Structure
- Pages in `client/src/pages/` - full page views (Dashboard, Workouts, etc.)
- Components in `client/src/components/` - reusable UI pieces
- Cards in `client/src/components/cards/` - dashboard widgets
- Data configs in `client/src/utils/data.js` - card definitions with keys matching API response

### MongoDB Patterns
- Mongoose models in [server/models/](server/models/) with timestamps enabled
- Workout documents reference User via `mongoose.Schema.Types.ObjectId`
- Dashboard aggregations use `$match`, `$group` for calorie calculations

## File Conventions
- Server uses ES modules (`"type": "module"` in package.json)
- React components use `.jsx` extension, utilities use `.js`
- Controller functions are exported individually, not as default

## Current State Notes
- Authentication flow UI exists but state management is hardcoded (`useState(true)` in App.js)
- Dashboard currently uses mock data - API integration needed
- Redux Toolkit installed but not yet wired up
