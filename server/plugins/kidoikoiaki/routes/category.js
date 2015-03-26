/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(categoryController, categoryRouter) {
    categoryRouter.route('/')
        .get(categoryController.getCategory)
        .post(categoryController.saveCategory)

    categoryRouter.route('/:categoryId')
        .get(categoryController.getCategory)
        .delete(categoryController.deleteCategory)
}