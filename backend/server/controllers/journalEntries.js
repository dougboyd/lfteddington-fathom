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
        let excelArray = {};
        excelArray.periods = new Array;

        // call the database to get an array of credit, debit for date range based on account
        AccountDetail.findAll(
            {
                where: {
                    account_number: {
                        $in: ['1-111000']
                    }
                },
            // },
            // {
                include: [
                    {
                        model: JournalLineItem,
                        required: true
                    }
                ]
            }
        )
            /*    
            .then((rec) => {
                console.log(rec);
            })
            */
            .then(sum => {
                console.log(sum);
                return res.status(200).send(JSON.stringify(sum, null, 2));
            })
            .catch(error => {
                console.log(error);
                return res.status(400).send(error)
            }
            );

        // call the database to get an array of credit, debit for date range based on account
        /*
        JournalLineItem.findAll(
            { limit: 2 },
            {
            where: {
                created_at: {
                    $between: [lastRunDate, thisRunDate]
                }
            },
            include: [
                { model: AccountDetail}
            ] 
        })
            .then((jlis) => {
                console.log(jlis);
            })
            */

        /*    
        Project.findAll({
                where: {
                  id: {
                    [Op.and]: {a: 5},           // AND (a = 5)
                    [Op.or]: [{a: 5}, {a: 6}],  // (a = 5 OR a = 6)
                    [Op.gt]: 6,                // id > 6
                    [Op.gte]: 6,               // id >= 6
                    [Op.lt]: 10,               // id < 10
                    [Op.lte]: 10,              // id <= 10
                    [Op.ne]: 20,               // id != 20
                    [Op.between]: [6, 10],     // BETWEEN 6 AND 10
                    [Op.notBetween]: [11, 15], // NOT BETWEEN 11 AND 15
                    [Op.in]: [1, 2],           // IN [1, 2]
                    [Op.notIn]: [1, 2],        // NOT IN [1, 2]
                    [Op.like]: '%hat',         // LIKE '%hat'
                    [Op.notLike]: '%hat',       // NOT LIKE '%hat'
                    [Op.iLike]: '%hat',         // ILIKE '%hat' (case insensitive)  (PG only)
                    [Op.notILike]: '%hat',      // NOT ILIKE '%hat'  (PG only)
                    [Op.overlap]: [1, 2],       // && [1, 2] (PG array overlap operator)
                    [Op.contains]: [1, 2],      // @> [1, 2] (PG array contains operator)
                    [Op.contained]: [1, 2],     // <@ [1, 2] (PG array contained by operator)
                    [Op.any]: [2,3]            // ANY ARRAY[2, 3]::INTEGER (PG only)
                  },
                  status: {
                    [Op.not]: false           // status NOT FALSE
                  }
                }
              })
              */

        /*
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
                        ag.accounts.forEach((a) => {
                            let account = new Object();
                            account.account_number = a.account_number;
                            account.account_tag = a.account_tag;
                            account.account_value = 1234.45;
        
                            account_groups.accounts.push(account);
                        });
                        period.account_groups.push(account_groups);
                    })
                    excelArray.periods.push(period);
                }
        
                console.log(JSON.stringify(excelArray, null, 2));
                */


        // pass the whole mess to the excel generator

        // import the excel sheet
        // get the last run date

        /*
        const returnDummy = {
            test: 'the test return'
        }

        return res.status(200).send(returnDummy)
        */
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