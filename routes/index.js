const router = require('express').Router();
const apiRoutes = require('./api');

// sets /api route to use files in ./api folder
router.use('/api', apiRoutes);

// sets response if uses any other routes
router.use((req, res) => {
	res.send('<h1>Wrong Route!</h1>\n<p>Please use /api/categories, /api/products, or /api/tags</p>');
});

module.exports = router;
