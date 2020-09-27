const express = require('express');
const snippetsController = require('../controllers/snippets');

const router = express.Router();

// /api/snippets
router.get('', snippetsController.get);
router.get('/:snippetId', snippetsController.getOne);
router.get('/user/:userId', snippetsController.getUsers);
router.post('', snippetsController.create);
// router.patch('/:snippetId', snippetsController.update);
router.patch('/:snippetId/like', snippetsController.like);
router.delete('/:snippetId', snippetsController.delete);

module.exports = router;