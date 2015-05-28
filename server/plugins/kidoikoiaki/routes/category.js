/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(categoryController, categoryRouter, categoryMiddleware)
{
    categoryRouter.route('/')
        .post(categoryMiddleware.checkSaveCategory)
        .post(categoryController.saveCategory)
        .put(categoryMiddleware.checkUpdateCategory)
        .put(categoryController.updateCategory);

    categoryRouter.route('/:categoryId')
        .all(categoryMiddleware.checkCategoryId)
        .get(categoryController.getCategory)
        .delete(categoryController.deleteCategory);
}