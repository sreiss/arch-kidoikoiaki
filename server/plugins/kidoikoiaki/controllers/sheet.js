/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(sheetService) {
    return {
        /** Save sheet. */
        saveSheet: function(req, res)
        {
            // Get sheetData.
            var sheetData = req.body;

            if(sheetData)
            {
                // Saving sheet.
                sheetService.saveSheet(sheetData).then(function(sheet)
                {
                    res.status(200).json({"count" : 1, "data" : sheet});
                },
                function(err)
                {
                    throw({"message" : err.message, "type" : "SheetController", "status" : 400});
                });
            }
            else
            {
                throw({"message" : "Missing parameters.", "type" : "SheetController", "status" : 400});
            }
        },

        /** Get sheet. */
        getSheet: function(req, res)
        {
            // Get sheetReference.
            var sheetReference = req.params.sheetReference;

            if(sheetReference)
            {
                // Get sheet.
                sheetService.getSheet(sheetReference).then(function(sheet)
                {
                    res.status(200).json({"count" : 1, "data" : sheet});
                },
                function(err)
                {
                    throw({"message" : err.message, "type" : "SheetController", "status" : 400});
                });
            }
            else
            {
                throw({"message" : "Missing parameters.", "type" : "SheetController", "status" : 400});
            }
        }
    };
};
