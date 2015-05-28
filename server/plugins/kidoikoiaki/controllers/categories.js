/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var ArchFindError = GLOBAL.ArchFindError;

module.exports = function(categoriesService)
{
    return {
        /** Get categories. */
        getCategories: function(req, res)
        {
            // Get categoryId.
            var sheetId = req.params.sheetId;

            // Get categories.
            categoriesService.getCategories(sheetId).then(function(categories)
            {
                res.status(200).json({"count" : categories.length, "data" : categories});
            },
            function(err)
            {
                res.status(500).json({"error" : new ArchFindError(err.message)});
            });
        }
    };
};
