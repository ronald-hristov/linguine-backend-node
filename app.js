const express = require('express');
const authRoutes = require('./routes/auth');
const snippetsRoutes = require('./routes/snippets');
const tagsRoutes = require('./routes/tags');
const errorController = require('./controllers/error');
const session = require('express-session');
const helmet = require('helmet')

const mongoose = require('mongoose');
const User = require('./models/user')

const app = express();

app.use(express.json());
app.use(helmet());
app.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false}))

// User session
app.use((request, response, next) => {
    if (!request.session.user) {
        return next();
    }
    User.findById(request.session.user._id)
        .then(user => {
            request.user = user;
            if (!user) {
                response.status(500).json({'error': 'User no found'})
                console.log('User not found');
            }
            next();
        })
        .catch(err => {
            console.log(err)
            response.status(500).json({'error': 'User no found'})
        });
});

app.use('/api/auth', authRoutes);
app.use('/api/snippets', snippetsRoutes);
app.use('/api/tags', tagsRoutes);

// Handle errors
app.use((error, request, response, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    response.status(status).json({ message: message, data: data });
});

app.use(errorController.get404);


mongoose
    .connect(process.env.MONGO_URI)
    .then(result => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(error => {
        console.log(error);
        throw error;
    });