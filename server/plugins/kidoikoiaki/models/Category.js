/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

module.exports = function(Types) {
    return {
        schema:
        {
            ctg_sheet: { type: Types.ObjectId, ref: 'Sheet'},
            ctg_name: {type: String, required: true},
            ctg_description: {type: String}
        },
        priority: 2,
        onModelReady: function(Category)
        {
            var globalCategories =
            [
                {ctg_name: 'Achats & Shopping', ctg_description: 'Dépenses liées aux achats et shopping.'},
                {ctg_name: 'Alimentation & Restau', ctg_description: 'Dépenses liées aux achats et shopping.'},
                {ctg_name: 'Auto & Transport', ctg_description: 'Dépenses liées aux transports.'},
                {ctg_name: 'Loisirs & Sorties', ctg_description: 'Dépenses liées aux loisirs et aux sorties.'},
                {ctg_name: 'Santé', ctg_description: 'Dépenses liées à la santé.'},
                {ctg_name: 'Divers', ctg_description: 'Dépenses diverses et variées.'}
            ];

            globalCategories.forEach(function(globalCategory)
            {
                Category.findOne({ctg_name:globalCategory.ctg_name}, function(err, category)
                {
                    if(err)
                    {
                        throw err;
                    }
                    else if(!category)
                    {
                        var newCategory = new Category();
                        newCategory.ctg_name = globalCategory.ctg_name;
                        newCategory.ctg_description = globalCategory.ctg_description;

                        newCategory.save(function(err, category)
                        {
                            if(err)
                            {
                                throw err;
                            }
                            else
                            {
                                console.log('Global Category "' + category.ctg_name + '" stored.');
                            }
                        });
                    }
                });
            });
        }
    };
};