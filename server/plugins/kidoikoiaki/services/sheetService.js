/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Sheet, participantService, qService) {
    return {
        /** Save sheet. */
        saveSheet: function(sheetData)
        {
            var deferred = qService.defer();

            var sheet = new Sheet();
            sheet.she_reference = sheetData.she_reference;

            // Saving sheet.
            sheet.save(function(err)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(sheet);
                }
            });

            return deferred.promise;
        },

        /** Get sheet. */
        getSheet: function(sheetReference)
        {
            var deferred = qService.defer();

            Sheet.findOne({she_reference: sheetReference}).exec(function (err, sheet)
            {
                if(err)
                {
                    deferred.reject(err);
                }
<<<<<<< HEAD
                else if(sheet == null)
                {
                    deferred.reject(new Error('No sheet matching [SHE__REFERENCE] : ' + sheetReference + "."));
                }
=======
>>>>>>> origin/master
                else
                {
                    deferred.resolve(sheet);
                }
            });

            return deferred.promise;
        }
    };
};