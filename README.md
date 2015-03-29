# arch-kidoikoiaki

## Server

### Routes

* Sheet
  * POST /kidoikoiaki/sheet : ajout d'une sheet si référence non existante
   * she_reference : référence unique de la sheet
  * GET /kidoikoiaki/sheet/:she_reference : récupération des informations de la sheet
   * she_reference : référence unique de la sheet

* Participants
  * POST /kidoikoiaki/participant : ajout d'un participant à la sheet
    * prt_sheet : identifiant unique de la sheet
    * prt_fname : prénom du participant
    * prt_lname : nom du participant
    * prt_email : adresse e-mail du participant
    * prt_share : part de base du participant
  * DELETE /kidoikoiaki/participant/:prt_id : supression du participant
   * prt_id : identifiant unique du participant
  * GET /kidoikoiaki/participant/:prt_id : récupération des informations du participant
   * prt_id : identifiant unique du participant
  * GET /kidoikoiaki/participants/:she_id : récupération de la liste des participants d'une sheet
   * she_id : identifiant unique de la sheet

* Categories
  * POST /kidoikoiaki/category : ajout d'une catégorie
   * ctg_name : nom de la catégorie
   * ctg_description : description de la catégorie
  * DELETE /kidoikoiaki/participant/:ctg_id : supression d'une catégorie
   * ctg_id : identifiant unique d'une catégorie
  * GET /kidoikoiaki/category : récupération des informations des catégories
  * GET /kidoikoiaki/category/:ctg_id : récupération des informations de la catégorie
   * ctg_id : identifiant unique de la catégorie

* Transactions
  * POST /kidoikoiaki/transaction : ajout d'une transaction
   * trs_sheet : nom de la transaction
   * trs_description : description de la transaction
   * trs_amount : montant de la transaction
   * trs_contributor : identifiant unique du contributeur
   * trs_creation_date : date de la transaction
   * trs_beneficiaries : tableau d'identifiant unique de bénéficiaire
   * trs_category : identifiant unique de la transacation
  * DELETE /kidoikoiaki/transaction/:trs_id : supression d'une transaction
   * trs_id : identifiant unique d'une transaction
  * GET /kidoikoiaki/transaction/:trs_id : récupération des informations de la transaction
   * trs_id : identifiant unique de la transaction
  * GET /kidoikoiaki/transactions/:trs_sheet : récupération de la liste des transactions d'une sheet
   * trs_sheet : identifiant unique de la sheet
