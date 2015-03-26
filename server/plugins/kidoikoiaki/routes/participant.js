/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(participantController, participantRouter) {
    participantRouter.route('/')
        .post(participantController.saveParticipant)

    participantRouter.route('/:participantId')
        .get(participantController.getParticipant)
        .delete(participantController.deleteParticipant)
}