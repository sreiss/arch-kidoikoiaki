/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(sheetController, sheetRouter) {
    sheetRouter.route('/')
        .post(sheetController.saveSheet);

    sheetRouter.route('/:sheetReference')
        .get(sheetController.getSheet);
}