'use strict';
angular.module('kid')
  .constant('i18nenUSConstant', {
    APP_TITLE : "ArchKidoikoiaki",
    NAVBAR_MENU : "Menu",

    SIDEBAR_HOME : "Home",
    SIDEBAR_PARTICIPANTS : "Participants",
    SIDEBAR_TRANSACTIONS : "Expenses",
    SIDEBAR_CATEGORIES : "Categories",
    SIDEBAR_BILAN : "Balance",

    SHEET_HOME : "Home",
    SHEET_P1 : "You live in corent, you go on holiday between friends, you organize an evening or a dinner, you buy your Christmas presents in family ? So many opportunities to use our tool to manage common accounts.",
    SHEET_P2 : "Every time a participant makes an expense for the group, he registers it in the list of the expenses. At the end, you just have to calculate automatically the balance to know very simply who has to pay off what and to whom.",
    SHEET_INFO_1 : "The public reference of the sheet",
    SHEET_INFO_2 : " is ",
    SHEET_INFO_3 : "and her private reference is ",
    SHEET_NEW_BUTTON : "New sheet",
    SHEET_NEW_TITLE : "Add new sheet",
    SHEET_TITLE : "Name",
    SHEET_REFERENCE : "Reference (optional)",
    SHEET_MAIL_ADDRESS : "Mail address",
    SHEET_SAVE : "Save",
    SHEET_EDIT_TITLE : "Edit existing sheet",
    SHEET_BACK : "Back",
    SHEET_NEW_SHEET_REQUIRED : "Beforehand please create a new sheet.",
    SHEET_NEW_SUCCESS : "Sheet successfully created.",
    SHEET_NEW_FAIL : "An error occured while creating new sheet.",
    SHEET_NEW_FAIL_SPAM : "A sheet has been created , please wait 5 seconds before trying again.",
    SHEET_NEW_FAIL_ALREADY_USED : "A sheet using this reference already exists.",
    SHEET_EDIT_SUCCESS : "Sheet successfully edited.",
    SHEET_EDIT_FAIL : "An error occured while editing existing sheet.",
    SHEET_ERROR_GET_SHET : "An error has occurred while retrieving the sheet.",

    PARTICIPANT_TITLE : "Participants",
    PARTICIPANT_NEW_BUTTON : "New participant",
    PARTICIPANT_NEW_TITLE : "Add new participant",
    PARTICIPANT_EDIT_TITLE : "Edit existing participant",
    PARTICIPANT_EMPTY_LIST : "You have no participant yet.",
    PARTICIPANT_LNAME : "Last name",
    PARTICIPANT_FNAME : "First name",
    PARTICIPANT_MAIL_ADDRESS : "Mail address",
    PARTICIPANT_WEIGHT : "Weights (default)",
    PARTICIPANT_SAVE : "Save",
    PARTICIPANT_BACK : "Back",
    PARTICIPANT_NOTIFIED : "Notify participants by e-mail ?",
    PARTICIPANT_ERROR_GET_PARTICIPANT : "An error has occurred while retrieving the participant.",
    PARTICIPANT_ERROR_GET_PARTICIPANTS : "An error occured while retrieving the participants.",
    PARTICIPANT_NEW_SUCCESS : "Participant successfully created.",
    PARTICIPANT_NEW_FAIL : "An error occured while creating new participant.",
    PARTICIPANT_EDIT_SUCCESS : "Participant successfully edited.",
    PARTICIPANT_EDIT_FAIL : "An error occured while editing existing participant.",
    PARTICIPANT_DELETE_SUCCESS : "Participant successfully deleted.",
    PARTICIPANT_DELETE_FAIL : "An error occured while deleting participant.",
    PARTICIPANT_DELETE_FAIL_LINKED : "Unable to delete this participant, he's linked to an expense.",
    PARTICIPANT_DELETE_FAIL_CHECK_DEPENDENCIES : "An error occurred while checking dependencies.",
    PARTICIPANT_DELETE_MODAL_TITLE : "Delete a participant",
    PARTICIPANT_DELETE_MODAL_ASK : "Do you really want to delete this participant ?",

    TRANSACTION_TITLE : "Expenses",
    TRANSACTION_NEW_BUTTON : "New expense",
    TRANSACTION_NEW_TITLE : "Add new expense",
    TRANSACTION_EDIT_TITLE : "Edit existing expense",
    TRANSACTION_EMPTY_LIST : "You have no expense yet.",
    TRANSACTION_LIST : "List",
    TRANSACTION_REPARTITION : "Repartition",
    TRANSACTION_PAID : "paid",
    TRANSACTION_CURRENCY : "$",
    TRANSACTION_IN : "in",
    TRANSACTION_FOR : "For",
    TRANSACTION_WEIGHT_1 : "weight",
    TRANSACTION_WEIGHT_N : "weights",
    TRANSACTION_WHO : "Who ?",
    TRANSACTION_WHAT : "What ?",
    TRANSACTION_HOW_MUCH : "How much ?",
    TRANSACTION_CATEGORY : "Catégory ?",
    TRANSACTION_WEIGHTS : "Weight(s) ?",
    TRANSACTION_SELECT_ALL_BENEFICIARIES : "Select all beneficiaries",
    TRANSACTION_SAVE : "Save",
    TRANSACTION_BACK : "Back",
    TRANSACTION_ERROR_GET_TRANSACTION : "An error occured while retrieving expense.",
    TRANSACTION_ERROR_GET_TRANSACTIONS : "An error occured while retrieving expenses.",
    TRANSACTION_NEW_SUCCESS : "Expense successfully created.",
    TRANSACTION_NEW_FAIL : "An error occured while creating new expense.",
    TRANSACTION_NEW_FAIL_NO_BENEFICIARIES : "Please select at least one beneficiary.",
    TRANSACTION_EDIT_SUCCESS : "Expense successfully edited.",
    TRANSACTION_EDIT_FAIL : "An error occured while editing existing expense.",
    TRANSACTION_EDIT_FAIL_NO_BENEFICIARIES : "Please select at least one beneficiary.",
    TRANSACTION_DELETE_SUCCESS : "Exense successfully deleted.",
    TRANSACTION_DELETE_FAIL : "An error occured while deleting expense.",
    TRANSACTION_DELETE_MODAL_TITLE : "Delete an expense",
    TRANSACTION_DELETE_MODAL_ASK : "Do you really want to delete this expense ?",

    CATEGORY_TITLE : "Categories",
    CATEGORY_NEW_BUTTON : "New category",
    CATEGORY_NEW_TITLE : "Add new category",
    CATEGORY_EDIT_TITLE : "Edit existing category",
    CATEGORY_EMPTY_LIST : "You have no category yet.",
    CATEGORY_NAME : "Name",
    CATEGORY_DESCRIPTION : "Description",
    CATEGORY_BACK : "Back",
    CATEGORY_SAVE : "Save",
    CATEGORY_ERROR_GET_CATEGORY : "An error occured while retrieving category.",
    CATEGORY_ERROR_GET_CATEGORIES : "An error occured while retrieving categories.",
    CATEGORY_NEW_SUCCESS : "Category successfully created.",
    CATEGORY_NEW_FAIL : "An error occured while creating new category.",
    CATEGORY_EDIT_SUCCESS : "Category successfully edited.",
    CATEGORY_EDIT_FAIL : "An error occured while editing existing category.",
    CATEGORY_DELETE_SUCCESS : "Category successfully deleted.",
    CATEGORY_DELETE_FAIL : "An error occured while deleting category.",
    CATEGORY_DELETE_FAIL_LINKED : "Unable to delete this category, he's linked to an expense.",
    CATEGORY_DELETE_FAIL_CHECK_DEPENDENCIES : "An error occurred while checking dependencies.",
    CATEGORY_DELETE_MODAL_TITLE : "Delete a category",
    CATEGORY_DELETE_MODAL_ASK : "Do you really want to delete this category ?",

    BILAN_TITLE : "Balance",
    BILAN_LIST : "List",
    BILAN_BALANCE : "Balance",
    BILAN_EMPTY_LIST : "You have no expense yet.",
    BILAN_MUST_PAY : "must paid",
    BILAN_CURRENCY : "$",
    BILAN_TO : "to",
    BILAN_ERROR_DELETE_PREVIOUS_DEBTS : "An error occured while deleting previous debts.",
    BILAN_ERROR_GENERATE_BILAN : "An error occured while generating balance.",
    BILAN_ERROR_GET_DEBTS : "An error occured while retrieving debts."
  });
