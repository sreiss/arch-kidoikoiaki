/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(sheetController, sheetRouter, sheetMiddleware) {
    sheetRouter.route('/')
        .post(sheetMiddleware.checkSaveSheet)
        .post(sheetController.saveSheet)
        .put(sheetMiddleware.checkUpdateSheet)
        .put(sheetController.updateSheet);

    sheetRouter.route('/:sheetReference')
        .get(sheetMiddleware.checkSheetReference)
        .get(sheetController.getSheet);
}