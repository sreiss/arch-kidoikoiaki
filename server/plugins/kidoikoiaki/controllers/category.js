/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(categoryService) {
    return {
        /** Save category. */
        saveCategory: function(req, res)
        {
            // Get category data.
            var categoryData = req.body;

            if(categoryData)
            {
                // Saving category.
                categoryService.saveCategory(categoryData).then(function(category)
                {
                    res.status(200).json({"count" : 1, "data" : category});
                },
                function(err)
                {
                    throw({"message" : err.message, "type" : "CategoryController", "status" : 400});
                });
            }
            else
            {
                throw({"message" : "Missing parameters.", "type" : "CategoryController", "status" : 400});
            }
        },

        /** Delete category. */
        deleteCategory: function(req, res)
        {
            // Get categoryId.
            var categoryId = req.params.categoryId;

            if(categoryId)
            {
                // Saving category.
                categoryService.deleteCategory(categoryId).then(function(category)
                {
                    res.status(200).json({"count" : 1, "data" : category});
                },
                function(err)
                {
                    throw({"message" : err.message, "type" : "CategoryController", "status" : 400});
                });
            }
            else
            {
                throw({"message" : "Missing parameters.", "type" : "CategoryController", "status" : 400});
            }
        },

        /** Get category. */
        getCategory: function(req, res)
        {
            // Get categoryId.
            var categoryId = req.params.categoryId;

            if(categoryId)
            {
                // Get category.
                categoryService.getCategory(categoryId).then(function(category)
                {
                    res.status(200).json({"count" : 1, "data" : category});
                },
                function(err)
                {
                    throw({"message" : err.message, "type" : "CategoryController", "status" : 400});
                });
            }
            else
            {
                // Get categories.
                categoryService.getCategories().then(function(categories)
                {
                    res.status(200).json({"count" : categories.length, "data" : categories});
                },
                function(err)
                {
                    throw({"message" : err.message, "type" : "CategoryController", "status" : 400});
                });
            }
        }
    };
};
