/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(participantController, participantRouter, participantMiddleware) {
    participantRouter.route('/')
        .post(participantMiddleware.checkSaveParticipant)
        .post(participantController.saveParticipant)
        .put(participantMiddleware.checkUpdateParticipant)
        .put(participantController.updateParticipant);

    participantRouter.route('/:participantId')
        .all(participantMiddleware.checkParticipantId)
        .get(participantController.getParticipant)
        .delete(participantController.deleteParticipant);
}