/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var Q = require('q');

module.exports = function(Category) {
    return {
        /** Save category. */
        saveCategory: function(categoryData)
        {
            var deferred = Q.defer();

            var category = new Category();
            category.ctg_sheet = categoryData.ctg_sheet;
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

        /** Update category. */
        updateCategory: function(categoryData)
        {
            var deferred = Q.defer();

            Category.update({_id: categoryData._id},
            {
                ctg_name: categoryData.ctg_name,
                ctg_description: categoryData.ctg_description
            },
            function(err, result)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(result);
                }
            });

            return deferred.promise;
        },

        /** Delete category. */
        deleteCategory: function(categoryId)
        {
            var deferred = Q.defer();

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
            var deferred = Q.defer();

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
        }
    };
};