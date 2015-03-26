/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(transactionsController, transactionsRouter, transactionsMiddleware) {
    transactionsRouter.route('/:sheetId')
        .get(transactionsMiddleware.checkSheetId)
        .get(transactionsController.getTransactions);
}