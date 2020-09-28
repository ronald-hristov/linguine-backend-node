const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const snippetSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    contents: {
        type: String,
        required: true,
    },
    likes: {
        users: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },

            }
        ],
    },
    tags: {
        type: Array,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true
    },
    isLiked: {
        type: Boolean,
        required: false,
    }
});

snippetSchema.methods.like = function (user) {
    const userIndex = this.likes.users.findIndex(likeUser => {
        return likeUser.userId.toString() === user._id.toString();
    });

    const updatedLikesUsers = [...this.likes.users];

    if (userIndex >= 0) {
        return;
    }

    updatedLikesUsers.push({
        userId: user._id,
        opa: 1
    });

    this.likes = {
        users: updatedLikesUsers
    };

    return this.save();
}

snippetSchema.methods.isLikedByCurrentUser = function (user) {
    const userIndex = this.likes.users.findIndex(likeUser => {
        return likeUser.userId._id.toString() === user._id.toString();
    });

    this.isLiked = (userIndex >= 0);
    return this.isLiked;
}

module.exports = mongoose.model('Snippet', snippetSchema);