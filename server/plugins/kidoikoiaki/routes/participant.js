/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(participantController, participantRouter, participantMiddleware) {
    participantRouter.route('/')
        .post(participantMiddleware.checkParticipant)
        .post(participantController.saveParticipant)

    participantRouter.route('/:participantId')
        .all(participantMiddleware.checkParticipantId)
        .get(participantController.getParticipant)
        .delete(participantController.deleteParticipant)
}