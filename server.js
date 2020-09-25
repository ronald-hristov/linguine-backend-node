const express = require('express');
const userRoutes = require('./routes/users');
const errorController = require('./controllers/error');

const app = express();

app.use(express.json());
app.use((request, response, next) => {
    console.log('In the middle');
    next();
})

app.use('/users', userRoutes);
app.use(errorController.get404);


app.listen(3000);