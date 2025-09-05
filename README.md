# Gitterdun - Kids' Chore Tracking App

[![codecov](https://codecov.io/github/spudly/gitterdun/graph/badge.svg?token=LybARijPwy)](https://codecov.io/github/spudly/gitterdun)

A comprehensive web application for tracking kids' chores with gamification
features, built with Express 4 and modern web technologies.

## 🚀 Features

### Core Functionality

- **Chore Management**: Create, edit, delete, and assign chores
- **User Management**: Admin and user roles with different permissions
- **Goal Setting**: Personal goal tracking for users
- **Points System**: Reward-based point system with bonuses and penalties
- **Streak Tracking**: Maintain daily chore completion streaks
- **Badge System**: Achievement badges for milestones
- **Leaderboard**: Competitive ranking system
- **Notifications**: Real-time updates and reminders

### Chore Types

- **Required**: Essential daily tasks
- **Bonus**: Optional tasks for extra points
- **Recurring**: Tasks with iCalendar RFC 5545 compatible recurrence rules
- **One-time**: Single occurrence tasks

### Admin Features

- Create and manage chores
- Assign chores to users
- Approve/reject completed chores
- Manage user accounts
- System analytics and settings
- Bonus/penalty point assignment

### User Features

- View assigned chores
- Mark chores as completed
- Set personal goals
- Track progress and achievements
- View leaderboard rankings
- Manage notifications

## 🛠️ Tech Stack

- **Backend**: Express 4, Node.js, TypeScript
- **Frontend**: Vanilla JavaScript with Alpine.js, Tailwind CSS
- **Database**: PostgreSQL with raw SQL queries
- **Authentication**: bcrypt password hashing
- **Security**: Helmet, CORS, Morgan logging
- **UI Components**: Font Awesome icons, responsive design

## 📁 Project Structure

```
src/
├── server.ts              # Express server entry point
├── routes/                # API route handlers
│   ├── auth.ts           # Authentication endpoints
│   ├── chores.ts         # Chore management
│   ├── goals.ts          # Goal tracking
│   └── leaderboard.ts    # Leaderboard data
├── lib/                   # Utility libraries
│   ├── db.ts             # PostgreSQL connection
│   └── schema.sql        # Database schema
└── types/                 # TypeScript definitions
    └── index.ts          # All type interfaces

public/                    # Static frontend files
├── index.html            # Main HTML page
└── js/
    └── app.js            # Frontend JavaScript
```

## 🗄️ Database Schema

The application uses a PostgreSQL database with the following main tables:

- **users**: User accounts and profiles
- **chores**: Chore definitions and metadata
- **chore_assignments**: User-chore relationships and completion status
- **goals**: Personal user goals
- **badges**: Achievement badges
- **user_badges**: User badge relationships
- **rewards**: Available rewards
- **user_rewards**: Claimed rewards
- **notifications**: User notifications

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd giterdone
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables** Create a `.env` file in the `src` directory:

   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/gitterdun
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Set up the database**

   ```bash
   # Connect to your PostgreSQL database
   psql -d your_database_name -f src/lib/schema.sql
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser** Navigate to
   [http://localhost:3000](http://localhost:3000)

### Database Setup

The application includes a complete SQL schema file (`src/lib/schema.sql`) that
creates all necessary tables, indexes, and default data. Run this file against
your PostgreSQL database to set up the complete schema.

## 📱 Usage

### For Admins

1. **Create Chores**: Use the Admin panel to create new chores with point values
2. **Assign Users**: Assign chores to specific users or make them available to
   all
3. **Review Submissions**: Approve or reject completed chores with bonus/penalty
   points
4. **Monitor Progress**: View analytics and user statistics

### For Users

1. **View Chores**: See assigned chores in the dashboard
2. **Complete Tasks**: Mark chores as completed when finished
3. **Set Goals**: Create personal achievement goals
4. **Track Progress**: Monitor points, streaks, and badges
5. **Compete**: View leaderboard rankings

## 🔧 Configuration

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: JWT token secret (for future authentication)

### Customization

- Modify point values in the admin panel
- Adjust badge requirements in the database
- Customize notification settings
- Configure streak bonus multipliers

## 🚀 Deployment

### Production Deployment

1. Set up a PostgreSQL database (e.g., on Supabase, Railway, or AWS RDS)
2. Update the `DATABASE_URL` environment variable
3. Run the schema file to create tables
4. Build the application: `npm run build`
5. Start the production server: `npm start`

### Environment Setup

- Set `NODE_ENV=production`
- Configure proper CORS origins
- Set up SSL/TLS certificates
- Configure reverse proxy (nginx, Apache) if needed

## 🔒 Security Features

- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- CORS configuration for API endpoints
- Helmet.js for security headers
- Morgan for request logging

## 🎯 Future Enhancements

- **Authentication**: JWT-based user authentication with sessions
- **Real-time Updates**: WebSocket integration for live notifications
- **Mobile App**: React Native companion app
- **Advanced Analytics**: Detailed reporting and insights
- **Integration**: Calendar and reminder app integrations
- **Multi-language**: Internationalization support
- **Offline Support**: Service worker for offline functionality
- **Email Notifications**: SMTP integration for email alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation in the code comments

## 🙏 Acknowledgments

- Built with Express 4 and Node.js
- Frontend powered by Alpine.js and Tailwind CSS
- Icons from Font Awesome
- Database design inspired by modern web applications
- UI/UX patterns from leading productivity apps

---

**Gitterdun** - Making chores fun and rewarding for kids! 🎉

# Testing sequenced precommit tasks
