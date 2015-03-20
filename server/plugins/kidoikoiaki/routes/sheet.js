/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(sheetController, sheetRouter) {
    // Sheets.
    sheetRouter.route('/')
        .post(sheetController.saveSheet);

    sheetRouter.route('/:sheetReference')
        .get(sheetController.getSheet);

    // Participants.
    sheetRouter.route('/:sheetReference/participant')
        .post(sheetController.saveParticipant)
        .get(sheetController.getParticipant);

    sheetRouter.route('/:sheetReference/participant/:participantId')
        .get(sheetController.getParticipant);
}