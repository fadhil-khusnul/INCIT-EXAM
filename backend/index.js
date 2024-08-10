const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');

const cookieSession = require("cookie-session");

const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');
dotenv.config();
// require('./config/passport'); // Ensure this comes after dotenv.config()

const app = express();
// app.use(
//     cookieSession({
//         name: "session",
//         keys: ["cyberwolve"],
//         maxAge: 24 * 60 * 60 * 100,
//     })
// );

// sequelize.sync({ force: true })
//     .then(() => console.log('Database & tables created!'))
//     .catch(err => console.log('Error syncing with PostgreSQL:', err));

// app.use(passport.initialize());
// app.use(passport.session());
// Middleware setup

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));


app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
});

app.use(express.json());

app.use(cookieParser());



app.use('/api/auth', authRoutes);
app.use('/api', dashboardRoute);

// Start the server
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));