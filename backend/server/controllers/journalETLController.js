const JournalEntry = require('../models').JournalEntry;
const JournalLineItem = require('../models').JournalLineItem;
const AccountDetail = require('../models').AccountDetail;
const LastRun = require('../config/last_run');
const moment = require('moment');
const accounts = require('../config/accounts');

module.exports = {


    list(req, res) {

        // set the dates
        const thisRunDate = new Date();
        const lastRunDate = new Date(LastRun.last_run_date);
        
        // create an object to pass to the Excel generator. This object will be populated as we 
        // cycle through, looking for all of the correct values
        let excelJson = {};
        excelJson.periods = new Array;

        let accountNumbers = new Array;

        // loop the dates and accounts
        for (let m = moment(lastRunDate); m.isBefore(thisRunDate); m.add(1, 'months')) {

            // create an object to hold each month
            let period = new Object();
            period.date_period = m;
            period.account_groups = new Array;

            // loop the account headers
            accounts.account_groups.forEach((ag) => {

                let account_groups = new Object();
                account_groups.name = ag.name;
                account_groups.accounts = new Array;

                // build up the object
                // loop the accounts
                ag.accounts.forEach( async (a) => {
                    let account = new Object();
                    account.account_number = a.account_number;
                    account.account_tag = a.account_tag;
                    account.account_value = ''; // await populateAccountBalance(a.account_number, m);
                    accountNumbers.push({ account_number: a.account_number, period: m });
                    account_groups.accounts.push(account);
                });

                period.account_groups.push(account_groups);
            })
            excelJson.periods.push(period);
        }

        // console.log(JSON.stringify(excelArray, null, 2));

        console.log(accountNumbers);
        /*
        async.eachSeries(accountNumbers, function (accountNumber, callback) {

            populateAccountBalance(accountNumber)
                .then((x) => {
                    let account = new Object();
                    account.account_number = a.account_number;
                    account.account_tag = a.account_tag;
                    account.account_value = x;
                    account_groups.accounts.push(account);
                    console.log(account);
                })
                .then(() => {
                    return callback();
                })

        }, function (err) {
            if (err) {
                console.log('An account number failed to process');
            } else {
                console.log('All account numbers processed successfully');
            }
        });

        console.log(accountNumbers);
        */
        // pass the whole mess to the excel generator

        // import the excel sheet
        // get the last run date

        /*
        */
        const returnDummy = {
            test: 'the test return'
        }

        // return res.status(200).send(returnDummy)
        return res.status(200).send(JSON.stringify(excelJson, null, 2))
        /*    
        .catch(error => {
                console.log(error);
                return res.status(400).send(error)
            }
            );
            */
        /*
        return JournalEntry
            .sum('id')

            //.findAll({
                order: [
                  ['createdAt', 'DESC'],
                  [{ model: TodoItem, as: 'todoItems' }, 'createdAt', 'ASC'],
                ],
            //})
            //.then(JournalEntry.sum('id'))
            //.then(journal_entries => res.status(200).send(journal_entries))
            .then(sum => {
                console.log(sum);
                return res.status(200).send(sum);
            })
            .catch(error => {
                console.log(error);
                return res.status(400).send(error)}
            );
            */

    }
}

/**
 * Call the database 
 */
function populateAccountBalance(accountNumber) {
    return AccountDetail.sum('account_id')
        .then((a) => {
            console.log(`in populateAccountBalance ${a}`);
            return a;
        });
}





        /*
        // An example join, pulling in journal_line_items
        AccountDetail.findAll(
            {
                where: {
                    account_number: {
                        $in: ['1-111000']
                    }
                },
                include: [
                    {
                        model: JournalLineItem,
                        required: true,
                        as: 'journal_line_items'
                    }
                ]
            }
        )
        */

        // Get all of the children accounts based on a single parent
        /*
        let accountIds = new Array;
        AccountDetail.findAll(
            {
                where: {
                    account_number: {
                        $eq: '1-111000',
                    },
                    active_yn: {
                        $eq: 'YES'
                    },
                },
                include: [
                    {
                        model: AccountDetail,
                        as: 'child_accounts',
                        where: {
                            active_yn: {
                                $eq: 'YES'
                            },
                        },
                        include: [
                            {
                                model: JournalLineItem,
                                as: 'journal_line_items',
                            }

                        ]
                    }
                ]
            }
        ).map((ads) => {
            accountIds.push(ads.account_id);
            ads.child_accounts.forEach((ad) => {
                accountIds.push(ad.account_id);
                console.log(' - - - - ');
                console.log(ad);
            })
            return accountIds;
        })
            .then(ret => {
                console.log(ret);
                return res.status(200).send(JSON.stringify(ret, null, 2));
            })
            .catch(error => {
                console.log(error);
                return res.status(400).send(error)
            }
            );
*/