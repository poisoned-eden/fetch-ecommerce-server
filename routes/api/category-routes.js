const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
// WORKS
router.get('/', async (req, res) => {
	// find all categories
	// be sure to include its associated Products
	try {
		const categoryData = await Category.findAll({
			include: [{ model: Product }],
		});
		res.status(200).json(categoryData);
	} catch (error) {
		res.status(500).json(error);
	}
});

// WORKS
router.get('/:id', async (req, res) => {
	// find one category by its `id` value
	// be sure to include its associated Products
	try {
		const categoryData = await Category.findByPk(req.params.id, {
			include: [{ model: Product }],
		});

		if (!categoryData) {
			return res.status(404).json({
				message:
					'No category found with that id. Try requesting all categories at /api/categories to find valid id options',
			});
		}

		res.status(200).json(categoryData);
	} catch (error) {
		res.status(500).json(error);
	}
});

// WORKS
router.post('/', async (req, res) => {
	// create a new category
	try {
		const categoryData = await Category.create(req.body);
		res.status(200).json(categoryData);
	} catch (error) {
		res.status(400).json(error);
	}
});

// WORKS
router.put('/:id', async (req, res) => {
	// update a category by its `id` value
	try {
		const categoryData = await Category.update(
			{ category_name: req.body.category_name },
			{
				where: {
					id: req.params.id,
				},
			},
		);

		if (!categoryData) {
			return res.status(404).json({
				message:
					'No category found with that id. Try requesting all categories at /api/categories to find valid id options',
			});
		}

		res.status(200).json(categoryData);
	} catch (error) {
		res.status(500).json(error);
	}
});

// WORKS
router.delete('/:id', async (req, res) => {
	// delete a category by its `id` value
	try {
		const categoryData = await Category.destroy({
			where: {
				id: req.params.id,
			},
		});

		if (!categoryData) {
			return res.status(404).json({
				message:
					'No category found with that id. Try requesting all categories at /api/categories to find valid id options',
			});
		}

		res.status(200).json(categoryData);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
