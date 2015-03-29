/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Category, qService) {
    return {
        /** Save category. */
        saveCategory: function(categoryData)
        {
            var deferred = qService.defer();

            var category = new Category();
            category.ctg_name = categoryData.ctg_name;
            category.ctg_description = categoryData.ctg_description;

            category.save(function(err)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(category);
                }
            });

            return deferred.promise;
        },

        /** Delete category. */
        deleteCategory: function(categoryId)
        {
            var deferred = qService.defer();

            Category.findOneAndRemove({_id: categoryId}, function(err, category)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else if(!category)
                {
                    deferred.reject(new Error('No category matching [CATEGORY_ID] : ' + categoryId + "."));
                }
                else
                {
                    deferred.resolve(category);
                }
            });

            return deferred.promise;
        },

        /** Get category. */
        getCategory: function(categoryId)
        {
            var deferred = qService.defer();

            Category.findOne({_id: categoryId}).exec(function (err, category)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(category);
                }
            });

            return deferred.promise;
        },

        /** Get categories. */
        getCategories: function()
        {
            var deferred = qService.defer();

            Category.find().exec(function (err, categories)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(categories);
                }
            });

            return deferred.promise;
        }
    };
};