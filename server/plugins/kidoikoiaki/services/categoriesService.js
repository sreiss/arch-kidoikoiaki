/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var Q = require('q');

module.exports = function(Category) {
    return {
        /** Get categories. */
        getCategories: function(sheetId)
        {
            var deferred = Q.defer();

            Category.find({ctg_sheet : { $in : [sheetId, null]}}).exec(function (err, categories)
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