/**
 * Kidoikoiaki plugin.
 *
 * @module arch/kidoikoiaki
 * @copyright ArchTailors 2015
 */
    
var Q = require('q'),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    uuid = require('uuid-v4'),
    crypto = require('crypto');

module.exports = function(Sheet, sheetService, config)
{
    return {
        /** Save sheet. */
        saveSheet: function(sheetData)
        {
            var deferred = Q.defer();

            if(sheetData.she_reference_private.length == 0)
            {
                sheetData.she_reference_private = uuid() + '_' + new Date().getTime();
            }

            sheetService.getSheet(sheetData.she_reference_private).then(function(sheet)
            {
                if(!sheet)
                {
                    sheetService.getLatestSheetByIp(sheetData.she_ip).then(function(latestSheet)
                    {
                        var timeElapsedRequired = true;

                        if(latestSheet)
                        {
                            timeElapsedRequired = (new Date() - (Date.parse(latestSheet.she_creation_date))) > 3000 ? true : false;
                        }

                        if(timeElapsedRequired)
                        {
                            var sheet = new Sheet();
                            sheet.she_name = sheetData.she_name;
                            sheet.she_reference_private = sheetData.she_reference_private;
                            sheet.she_reference_public = crypto.createHash('md5').update(sheetData.she_reference_private).digest("hex");
                            sheet.she_email = sheetData.she_email;
                            sheet.she_ip = sheetData.she_ip;

                            // Saving sheet.
                            sheet.save(function(err)
                            {
                                if(err)
                                {
                                    deferred.reject(err);
                                }
                                else
                                {
                                    sheetService.sendMail(sheetData);
                                    deferred.resolve(sheet);
                                }
                            });
                        }
                        else
                        {
                            throw new Error('SHE_CREATION_DATE_TO_SOON');
                        }
                    })
                    .catch(function(err)
                    {
                        deferred.reject(err);
                    })
                }
                else
                {
                    throw new Error('SHE_REFERENCE_ALREADY_USED');
                }
            })
            .catch(function(err)
            {
                deferred.reject(err);
            })

            return deferred.promise;
        },

        /** Update sheet. */
        updateSheet: function(sheetData)
        {
            var deferred = Q.defer();

            Sheet.update({she_reference_private: sheetData.she_reference_private},
            {
                she_name : sheetData.she_name
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

        /** Get sheet. */
        getSheet: function(sheetReference)
        {
            var deferred = Q.defer();

            sheetService.getSheetByPrivateReference(sheetReference).then(function(sheet)
            {
                if(sheet)
                {
                    return sheet;
                }
                else
                {
                    return sheetService.getSheetByPublicReference(sheetReference).then(function(sheet)
                    {
                        if(sheet)
                        {
                            return sheet;
                        }
                        else
                        {
                            return null;
                        }
                    })
                }
            })
            .then(function(sheet)
            {
                if(sheet)
                {
                    Sheet.update({she_reference_private: sheet.she_reference_private},
                    {
                        she_last_visit: Date.now()
                    },
                    function (err)
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
                }
                else
                {
                    deferred.resolve(sheet);
                }
            });

            return deferred.promise;
        },

        getSheetByPrivateReference: function(privateReference)
        {
            var deferred = Q.defer();

            Sheet.findOne({she_reference_private: privateReference}).exec(function (err, sheet)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(sheet);
                }
            })

            return deferred.promise;
        },

        getSheetByPublicReference: function(publicReference)
        {
            var deferred = Q.defer();

            Sheet.findOne({she_reference_public: publicReference}).exec(function (err, sheet)
            {
                if(err)
                {
                    deferred.reject(err);
                }
                else
                {
                    deferred.resolve(sheet);
                }
            })

            return deferred.promise;
        },

        /** Get sheet by ID. */
        getSheetById: function(sheetId)
        {
            var deferred = Q.defer();

            Sheet.findOne({_id: sheetId}).exec(function (err, sheet)
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

        /** Get latest sheet by IP. */
        getLatestSheetByIp: function(sheetIp)
        {
            var deferred = Q.defer();

            Sheet.findOne({she_ip: sheetIp}).sort({she_creation_date: -1}).exec(function (err, sheet)
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

        /** Send Mail. */
        sendMail: function(sheetData)
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
                to: sheetData.she_email,
                subject: "archKidoikoiaki - Création d'une nouvelle feuille ✔",
                html:   'Bonjour,<br><br>' +
                'Votre nouvelle feuille <b>' + sheetData.she_name + '</b> a été créée avec succés.<br>' +
                "Vous pouvez la consulter et la partager à n'importer quel moment à l'adresse suivante : <a href='" + sheetData.she_path + '/#/sheet/' + sheetData.she_reference_private + '/' +  "'>" + sheetData.she_reference_private + "</a>.<br><br>" +
                "L'équipe vous remercie et vous souhaite une bonne visite.<br>" +
                '__<br>Ceci est un message automatique, merci de ne pas y répondre.'
            };

            transporter.sendMail(mailOptions, function(error, info)
            {
                if(error)
                {
                    console.log("Message automatique de création de feuille " + sheetData.she_reference_private + " non envoyé.");
                }
                else
                {
                    console.log("Message automatique de création de feuille " + sheetData.she_reference_private + " envoyé avec succés.");
                }
            });
        }
    };
};