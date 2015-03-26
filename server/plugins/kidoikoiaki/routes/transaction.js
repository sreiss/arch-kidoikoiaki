/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(transactionController, transactionRouter, transactionMiddleware) {
    transactionRouter.route('/')
        .post(transactionMiddleware.checkTransaction)
        .post(transactionController.saveTransaction)

    transactionRouter.route('/:transactionId')
        .all(transactionMiddleware.checkTransactionId)
        .get(transactionController.getTransaction)
        .delete(transactionController.deleteTransaction)
}