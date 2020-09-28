const Tag = require('../models/tag');

exports.get = (request, response, next) => {
    Tag.find()
        .then(tags => {
            return response.json(tags);
        })
        .catch( error => {
            console.log(error)
            response.status(404).json({message: 'Tags not found'})
        });

}