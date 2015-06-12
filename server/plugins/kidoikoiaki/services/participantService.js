/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */

var Q = require('q');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = function(Participant, participantService, sheetService, config) {
    return {
        /** Save participant. */
        saveParticipant: function(participantData)
        {
            var deferred = Q.defer();

            var participant = new Participant();
            participant.prt_sheet = participantData.prt_sheet;
            participant.prt_fname = participantData.prt_fname;
            participant.prt_lname = participantData.prt_lname;
            participant.prt_email = participantData.prt_email;
            participant.prt_share = participantData.prt_share;

            participant.save(function(err)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(participant);

                    var notified = participantData.prt_notified || false;
                    if(notified)
                    {
                        participantService.sendMail(participantData);
                    }
                }
            });

            return deferred.promise;
        },

        /** Update participant. */
        updateParticipant: function(participantData)
        {
            var deferred = Q.defer();

            Participant.update({_id: participantData._id},
            {
                prt_fname : participantData.prt_fname,
                prt_lname : participantData.prt_lname,
                prt_email : participantData.prt_email,
                prt_share : participantData.prt_share
            },
            function(err, result)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(result);
                }
            });

            return deferred.promise;
        },

        /** Delete participant. */
        deleteParticipant: function(participantId)
        {
            var deferred = Q.defer();

            Participant.findOneAndRemove({_id: participantId}, function(err, participant)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(participant);
                }
            });

            return deferred.promise;
        },

        /** Get participant. */
        getParticipant: function(participantId)
        {
            var deferred = Q.defer();

            Participant.findOne({_id: participantId}).exec(function (err, participant)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(participant);
                }
            });

            return deferred.promise;
        },

        /** Get all participants. */
        getParticipants: function(sheetId)
        {
            var deferred = Q.defer();

            Participant.find({prt_sheet: sheetId}).populate('prt_sheet').exec(function (err, participants)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(participants);
                }
            });

            return deferred.promise;
        },

        /** Send Mail. */
        sendMail: function(participantData)
        {
            var deferred = Q.defer();

            sheetService.getSheetById(participantData.prt_sheet).then(function(sheet)
            {
                var transporter = nodemailer.createTransport(smtpTransport(
                {
                    service: "Gmail", // sets automatically host, port and connection security settings
                    auth:
                    {
                        user: config.get('mail:username'),
                        pass: config.get('mail:password')
                    },
                    tls: {rejectUnauthorized: false},
                    debug:true
                }));

                var mailOptions =
                {
                    from: config.get('mail:noreply'),
                    to: participantData.prt_email,
                    subject: "archKidoikoiaki - Vous prenez part à une feuille ✔",
                    html:   'Bonjour <b>' + participantData.prt_fname + ' ' + participantData.prt_lname + '</b>,<br><br>' +
                    "Vous venez d'être ajouté en tant que participant à la feuille <b>" + sheet.she_name + '</b> avec succès.<br>' +
                    "Vous pouvez la consulter et la partager à n'importer quel moment à l'adresse suivante : <a href='" + participantData.she_path + '/#/sheet/' + participantData.she_reference + '/' + "'>" + sheet.she_reference + "</a>.<br><br>" +
                    "L'équipe vous remercie et vous souhaite une bonne visite.<br>" +
                    '__<br>Ceci est un message automatique, merci de ne pas y répondre.'
                };

                transporter.sendMail(mailOptions, function(error, info)
                {
                    if(error)
                    {
                        deferred.reject(error);
                        console.log("Message automatique d'ajout d'un participant à la feuille " + sheet.she_reference + " non envoyé.");
                    }
                    else
                    {
                        deferred.resolve(info);
                        console.log("Message automatique d'ajout d'un participant à la feuille " + sheet.she_reference + " envoyé avec succès.");
                    }
                });
            })
            .catch(function(err)
            {
                deferred.reject(err);
            })

            return deferred.promise;
        }
    };
};