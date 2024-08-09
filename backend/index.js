const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const sequelize = require('./config/database');

require('./config/passport');
dotenv.config();
const session = require('express-session');


// sequelize.sync({ force: true })
//     .then(() => console.log('Database & tables created!'))
//     .catch(err => console.log('Error syncing with PostgreSQL:', err));

const app = express();

app.use(express.json());
app.use(cookieParser());


const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());