/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(participantsController, participantsRouter, participantsMiddleware) {
    participantsRouter.route('/:sheetId')
        .get(participantsMiddleware.checkSheetId)
        .get(participantsController.getParticipants);
}