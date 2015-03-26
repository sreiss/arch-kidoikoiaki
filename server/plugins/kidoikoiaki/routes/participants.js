/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(participantsController, participantsRouter) {
    participantsRouter.route('/:sheetId')
        .get(participantsController.getParticipants);
}