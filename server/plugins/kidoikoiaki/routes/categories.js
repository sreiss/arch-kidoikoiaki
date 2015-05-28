/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(categoriesController, categoriesRouter, categoriesMiddleware) {
    categoriesRouter.route('/:sheetId')
        .all(categoriesMiddleware.checkSheetId)
        .get(categoriesController.getCategories);
}