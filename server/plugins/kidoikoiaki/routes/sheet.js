/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(sheetController, sheetRouter, sheetMiddleware) {
    sheetRouter.route('/')
        .post(sheetMiddleware.checkSheet)
        .post(sheetController.saveSheet);

    sheetRouter.route('/:sheetReference')
        .get(sheetMiddleware.checkSheetReference)
        .get(sheetController.getSheet);
}