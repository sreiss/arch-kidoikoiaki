/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(bilanController, bilanRouter, bilanMiddleware) {
    bilanRouter.route('/:sheetId')
        .get(bilanMiddleware.checkSheetId)
        .get(bilanController.getBilan);
}