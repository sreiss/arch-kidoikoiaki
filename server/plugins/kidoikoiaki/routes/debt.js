/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(debtController, debtRouter, debtMiddleware)
{
    debtRouter.route('/:sheetId')
        .get(debtMiddleware.checkSheetId)
        .get(debtController.getDebts)
        .delete(debtController.deleteDebts)
}