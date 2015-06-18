/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var Q = require('q');
var CronJob = require('cron').CronJob;
var moment = require('moment');

module.exports = function(Sheet, Category, Participant, Transaction, Debt) {
    var cronTasks = {
        removeOutdatedSheet: function()
        {
            try
            {
                console.log('CRON[removeOutdatedSheet] : initialization');

                var cronTask = new CronJob(
                {
                    cronTime: '00 30 11 * * 1-5',
                    onTick: function()
                    {
                        Sheet.find({'she_last_visit' : {$gte : moment().subtract(1, 'year').toDate()}}).then(function(sheets)
                        {
                            console.log('CRON[removeOutdatedSheet] : ' + sheets.length + ' sheets to delete');

                            for(var i = 0; i < sheets.length; i++)
                            {
                                Sheet.findByIdAndRemove(sheets[i]._id)
                                .then(Category.find({'sheet_id' : sheets[i]._id}).remove())
                                .then(Participant.find({'sheet_id' : sheets[i]._id}).remove())
                                .then(Transaction.find({'sheet_id' : sheets[i]._id}).remove())
                                .then(Category.find({'sheet_id' : sheets[i]._id}).remove())
                                .then(Debt.find({'sheet_id' : sheets[i]._id}).remove())
                                .catch(function(err)
                                {
                                    console.log(err);
                                    console.log('Error occured while deleting outdated sheets.');
                                });
                            }
                        })
                        .catch(function(err)
                        {
                            console.log(err);
                            console.log('Error occured while retrieving outdated sheets.');
                        })
                    },
                    start: false,
                    timeZone: "America/Los_Angeles"
                });

                cronTask.start();
            }
            catch(err)
            {
                console.log("CRON Pattern not valid.");
            }
        }
    };

    cronTasks.removeOutdatedSheet();

    return cronTasks;
};