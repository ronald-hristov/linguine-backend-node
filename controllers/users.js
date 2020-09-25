const bcrypt = require('bcrypt');
const users = []
const User = require('../models/user');

exports.getUsers = (request, response) => {
    response.json(users)
}

exports.createUser = async (request, response) => {
    try {
        const hashedPassword = await bcrypt.hash(request.body.password, 10)
        // console.log(hashedPassword)
        const user = new User(request.body.name, request.body.email, hashedPassword);
        user.save();
        response.status(201).send()
    } catch {
        response.status(500).send()
    }
}

exports.loginUser = async (request, response) => {
    const user = users.find(user => user.name = request.body.name);
    if (user == null) {
        return response.status(400).send('User not found')
    }

    try {
        if (await bcrypt.compare(request.body.password, user.password)) {
            response.status(200).send('yes');
        } else {
            response.status(400).send('no');
        }
    } catch {
        response.status(500).send();
    }
}