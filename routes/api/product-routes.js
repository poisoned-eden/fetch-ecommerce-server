// TODO

const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// WORKS
// get all products
router.get('/', async (req, res) => {
	// find all products
	// be sure to include its associated Category and Tag data
	try {
		const productData = await Product.findAll({
			include: [{ model: Category }, { model: Tag }],
		});
		res.status(200).json(productData);
	} catch (error) {
		res.status(500).json(error);
	}
});

// WORKS
// get one product
router.get('/:id', async (req, res) => {
	// find a single product by its `id`
	// be sure to include its associated Category and Tag data
	try {
		const productData = await Product.findByPk(req.params.id, {
			include: [{ model: Category }, { model: Tag }],
		});

		if (!productData) {
			return res.status(404).json({
				message:
					'No product found with that id. Try requesting all products at /api/products to find valid id options',
			});
		}

		res.status(200).json(productData);
	} catch (error) {
		res.status(500).json(error);
	}
});

// WORKS
// create new product
router.post('/', async (req, res) => {
	/* req.body should look like this...
    {
      "product_name": "Basketball",
      "price": 200.00,
      "stock": 3,
      "tagIds": [1, 2, 3, 4]
    }
  */

	try {
		const productData = await Product.create(req.body);

		// if there's product tags, we need to create pairings to bulk create in the ProductTag model
		if (req.body.tagIds.length) {
			const productTagIdArr = req.body.tagIds.map((tag_id) => {
				return {
					product_id: productData.id,
					tag_id,
				};
			});

			const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
			
			res.status(200).json({ product: productData, tags: productTagIds });
		}
		// if no product tags, just respond
		res.status(200).json(productData);
	} catch (error) {
		res.status(500).json(error);
	}
});

// WORKS
// update product
router.put('/:id', async (req, res) => {
	// update product data
	try {
		const productData = await Product.update(req.body, {
			where: {
				id: req.params.id,
			},
		})
		// if that id doesnt exist send 404 not found
		if (!productData) {
			return res.status(404).json({
				message:
					'No product found with that id. Try requesting all products at /api/products to find valid id options',
			});
		} else if (req.body.tagIds && req.body.tagIds.length) { 
			// if product id does exist, update product tags.
			// find all current tags for this product
			const productTags = await ProductTag.findAll({
				where: { product_id: req.params.id },
			});			
			// get all current tag id's into an array
			const productTagIds = productTags.map(
				({ tag_id }) => tag_id,
			);
				
			// if the product doesnt already have the tag with that id, add the id to array of new ones to create ProductTag link to.
			const newProductTags = req.body.tagIds
				.filter(
					(tag_id) => !productTagIds.includes(tag_id)
				).map(
					(tag_id) => {
						return {
							product_id: req.params.id,
							tag_id,
						}
					}
				);
			
			// figure out which ones to remove
			const productTagsToRemove = productTags
				.filter(
					({ tag_id }) => !req.body.tagIds.includes(tag_id)
				).map(({ id }) => id);

			const addedProductTags = await ProductTag.bulkCreate(newProductTags);
			const removedProductTags = await ProductTag.destroy({
				where: { id: productTagsToRemove },
			});
			
			return res.status(200).json({ product: "updated", linkedTags: addedProductTags, unlinkedTags: removedProductTags });
		} 

		// if no product tags, just respond
		res.status(200).json(productData);
	} catch (error) {
		res.status(500).json(error);
	}
});

// WORKS
router.delete('/:id', async (req, res) => {
	// delete one product by its `id` value
	try {
		const productData = await Product.destroy({
			where: {
				id: req.params.id,
			},
		});

		if (!productData) {
			return res.status(404).json({
				message:
					'No product found with that id. Try requesting all products at /api/products to find valid id options',
			});
		}

		// if there was a product with that ID
		// find and delete ProductTags
		const productTagData = await ProductTag.destroy({
			where: {
				product_id: req.params.id,
			},
		});

		res.status(200).json({message: "deleted"});
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
