# arch-kidoikoiaki

## Server

### Routes

* Sheets
  * POST /kidoikoiaki/sheet : ajout d'une sheet si référence non existante
  * GET /kidoikoiaki/sheet/:sheetReference : récupération des informations de la sheet

* Participants
  * POST /kidoikoiaki/sheet/:sheetReference/participant : ajout d'un participant à la sheet
  * GET /kidoikoiaki/sheet/:sheetReference/participant : récupération de la liste des participants de la sheet
  * GET /kidoikoiaki/sheet/:sheetReference/participant/:participantId : récupération des informations d'un participant