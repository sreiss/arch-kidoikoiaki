/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(transactionsController, transactionsRouter) {
    transactionsRouter.route('/:sheetId')
        .get(transactionsController.getTransactions);
}