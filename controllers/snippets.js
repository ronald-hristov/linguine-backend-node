const Snippet = require('../models/snippet');
const Tag = require('../models/tag');

exports.get = (request, response, next) => {
    // all shared

    // if admin all
    Snippet.find()
        // .select('-_id')
        .populate('userId', 'name')
        .populate('likes.users.userId', 'name')
        .then(snippets => {
            snippets.map(snippet => {
                snippet.isLikedByCurrentUser(request.user);
                return snippet;
            })

            return snippets;
        })
        .then(snippets => {
            response.json(snippets)
        })
        .catch( error => {
            console.log(error)
            response.status(404).json({message: 'Snippets not found'})
        });

}

exports.getOne = (request, response, next) => {
    // if personal check admin or member
    const snippetId = request.params.snippetId;
    Snippet.findById(snippetId)
        // .select('-_id')
        .populate('userId', 'name')
        .then(snippet => {
            if (snippet) {
                snippet.isLikedByCurrentUser(request.user);
                snippet.populate('likes.users.userId', 'name')
                .execPopulate()
                .then(snippet => {
                    response.json(snippet)
                })
            } else {
                response.status(404).json({error: "Snippet not found"})
            }
        })
        .catch(error => {
            console.log(error)
            response.status(404).json({error: "Snippet not found"})
        });
}

// All snippets for the selected user
exports.getUsers = (request, response, next) => {
    // Check if current user or admin


    Snippet.find({userId: request.user._id})
        // .select('-_id')
        .populate('userId', 'name')
        .then(snippets => {
            response.json(snippets)
        })
        .catch(error => {
            response.status(400).json({error: "Snippets not found"})
        });
}

exports.create = (request, response, next) => {
    // check if member

    // create tags
    request.body.tags.forEach((item, index) => {
        Tag.findOne({name: item})
            .then(tag => {
                if (!tag) {
                    let tag = new Tag({name: item}).save();
                }
            })
            .catch(error => {

            });
    });


    // create snippet
    const snippet = new Snippet({
        contents: request.body.contents,
        tags: request.body.tags,
        type: request.body.type,
        likes: {
            users: []
        },
        userId: request.user
    });
    snippet.save()
        .then(result => {
            console.log('Snippet created')
            response.status(201).json({id: result._id})
        })
        .catch(error => {
            console.log(error);
            response.status(400).send()
        });

}

exports.update = (request, response, next) => {
    // check if member

    // used for like
}

exports.like = (request, response, next) => {
    // check if member

    // used for like
    const snippetId = request.params.snippetId;
    Snippet.findById(snippetId)
        // .select('-_id')
        // .populate('userId', 'name')
        .then(snippet => {
            if (!snippet) {
                response.status(404).json({error: "Snippet not found"})
            }

            if (!snippet.like(request.user)) {
                response.status(400).json({message: "Already liked"})
            }
            console.log(snippet);
            response.json({message: "Found something to like"})
        })
        .catch(error => {
            console.log(error);
            response.status(404).json({error: "Snippet not found"})
        });
}

exports.delete = (request, response, next) => {
    // admin
    const snippetId = request.params.snippetId;
    Snippet.findByIdAndDelete(snippetId)
        .then(snippet => {
            if (snippet) {
                response.status(200).send();
            } else {
                response.status(404).send();
            }
        })
        .catch(error => {
            response.status(404).send();
        });

}