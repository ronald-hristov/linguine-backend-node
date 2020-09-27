const bcrypt = require('bcrypt');
const User = require('../models/user');
const session = require('express-session')
const {body} = require('express-validator/check')

exports.getUsers = (request, response) => {
    User.find()
        .then(users => {
            response.json(users)
        })
        .catch();
}

exports.signup = (request, response) => {
    const hashedPassword = bcrypt
        .hash(request.body.password, 12)
        .then(hashedPassword => {
            const user = new User(
                {name: request.body.name, username: request.body.username, password: hashedPassword}
            );

            return user.save()
        })
        .then(result => {
            console.log('User created')
            response.status(201).send()
        })
        .catch(error => {
            console.log(error);
            response.status(400).send()
        });
}

exports.login = (request, response, next) => {
    // const user = users.find(user => user.name = request.body.name);
    let loadedUser;
    User.findOne({username: request.body.username})
        .then(user => {
            if (!user) {
                const error = new Error('A user with this username could not be found.');
                error.statusCode = 404;
                throw error;
            }

            loadedUser = user;
            return bcrypt.compare(request.body.password, user.password)
        })
        .then(validPassword => {
            if (!validPassword) {
                const error = new Error("Wrong password!");
                error.statusCode = 401;
                throw error;
            }
            request.session.isLoggedIn = true;
            request.session.user = loadedUser;
            response.status(200).send();
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.logout = (request, response) => {
    request.session.destroy(error => {
        console.log(error);
        response.status(200).send();
    });

}