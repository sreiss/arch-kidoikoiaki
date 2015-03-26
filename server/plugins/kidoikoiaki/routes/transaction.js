/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(transactionController, transactionRouter) {
    transactionRouter.route('/')
        .post(transactionController.saveTransaction)

    transactionRouter.route('/:transactionId')
        .get(transactionController.getTransaction)
        .delete(transactionController.deleteTransaction)
}