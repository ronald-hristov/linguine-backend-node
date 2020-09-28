const express = require('express');
const tagsController = require('../controllers/tags');

const router = express.Router();

// /api/tags
router.get('', tagsController.get);


module.exports = router;