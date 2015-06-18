/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var Q = require('q');
    CronJob = require('cron').CronJob;
    moment = require('moment');
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport');

module.exports = function(Sheet, Category, Participant, Transaction, Debt, config) {
    var cronTasks = {
        remindOutdatedSheet: function()
        {
            try
            {
                console.log('CRON[remindOutdatedSheet] : initialization');

                var cronTask = new CronJob(
                {
                    cronTime: '00 30 11 * * 1-5',
                    onTick: function()
                    {
                        Sheet.find({'she_last_visit' : {$lt : moment().subtract(11, 'month').toDate()}}).then(function(sheets)
                        {
                            console.log('CRON[remindOutdatedSheet] : ' + sheets.length + ' sheets to remind');

                            var transporter = nodemailer.createTransport(smtpTransport(
                            {
                                service: "Gmail",
                                auth:
                                {
                                    user: config.get('mail:username'),
                                    pass: config.get('mail:password')
                                },
                                tls: {rejectUnauthorized: false},
                                debug:true
                            }));

                            for(var i = 0; i < sheets.length; i++)
                            {
                                var mailOptions =
                                {
                                    from: config.get('mail:noreply'),
                                    to: sheets[i].she_email,
                                    subject: "archKidoikoiaki - L'une de vos feuilles risque d'être archivée !",
                                    html:   'Bonjour,<br><br>' +
                                            "Votre feuille <b>" + sheets[i].she_name + "</b> risque d'être archivée le mois prochain si vous ne la consultez pas.<br>" +
                                            "Vous pouvez la consulter et la partager à n'importer quel moment à l'adresse suivante : <a href='" + config.get('client:url') + '/#/sheet/' + sheets[i].she_reference + '/' +  "'>" + sheets[i].she_reference + "</a>.<br><br>" +
                                            "L'équipe vous remercie et vous souhaite une bonne visite.<br>" +
                                            '__<br>Ceci est un message automatique, merci de ne pas y répondre.'
                                };

                                transporter.sendMail(mailOptions, function(error)
                                {
                                    if(error)
                                    {
                                        console.log("CRON[remindOutdatedSheet] : Error occured while sending reminder mail.");
                                    }
                                    else
                                    {
                                        console.log("CRON[remindOutdatedSheet] : Reminder mail send successfully.");
                                    }
                                });
                            }
                        })
                        .catch(function()
                        {
                            console.log('CRON[remindOutdatedSheet] : Error occured while retrieving outdated sheets.');
                        })
                    },
                    start: false,
                    timeZone: "America/Los_Angeles"
                });

                cronTask.start();
            }
            catch(err)
            {
                console.log("CRON[remindOutdatedSheet] : Pattern not valid.");
            }
        },

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
                        Sheet.find({'she_last_visit' : {$lt : moment().subtract(1, 'year').toDate()}}).then(function(sheets)
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
                                .catch(function()
                                {
                                    console.log('CRON[removeOutdatedSheet] : Error occured while deleting outdated sheets.');
                                });
                            }
                        })
                        .catch(function()
                        {
                            console.log('CRON[removeOutdatedSheet] : Error occured while retrieving outdated sheets.');
                        })
                    },
                    start: false,
                    timeZone: "America/Los_Angeles"
                });

                cronTask.start();
            }
            catch(err)
            {
                console.log("CRON[removeOutdatedSheet] : Pattern not valid.");
            }
        }
    };

    cronTasks.remindOutdatedSheet();
    cronTasks.removeOutdatedSheet();

    return cronTasks;
};