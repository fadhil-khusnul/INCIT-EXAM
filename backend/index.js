const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const passport = require('passport');

require('./config/passport');
dotenv.config();
const session = require('express-session');


const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());