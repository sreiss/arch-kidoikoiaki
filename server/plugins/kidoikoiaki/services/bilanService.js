/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Debt, qService) {
    return {
        /** Generate bilan. */
        generateBilan: function(sheetData)
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

        /** Get bilan. */
        getBilan: function(sheetId)
        {
            var deferred = qService.defer();

            Debt.find({dbt_sheet: sheetId}).exec(function (err, debts)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(debts);
                }
            });

            return deferred.promise;
        }
    };
};