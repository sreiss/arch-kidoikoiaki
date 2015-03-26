/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(categoryController, categoryRouter, categoryMiddleware) {
    categoryRouter.route('/')
        .get(categoryController.getCategories)
        .post(categoryMiddleware.checkCategory)
        .post(categoryController.saveCategory)

    categoryRouter.route('/:categoryId')
        .all(categoryMiddleware.checkCategoryId)
        .get(categoryController.getCategory)
        .delete(categoryController.deleteCategory)
}