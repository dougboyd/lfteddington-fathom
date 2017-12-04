const LastRun = require('../server/config/last_run');
const SheetColumns = require('../server/config/sheetColumns');
const moment = require('moment');
const Accounts = require('../server/config/accounts.short');
const AccountDetail = require('../server/models').AccountDetail;
const JournalLineItem = require('../server/models').JournalLineItem;
const util = require('util');
var Excel = require('exceljs');
let excelJson = {};
var dateFormat = require('dateformat');

// dev only
const ExcelJson = require('../excelJson')

module.exports = {

    // The main run point for the ETL piece
    async run() {

        // build the final object with no values
        excelJson = await addPeriods(Accounts);
        /*

        // write the file for dev
        var fs = require('fs');
        fs.writeFile("./excelJson.json", JSON.stringify(excelJson, null, 2), function (err) {

            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
        */
        // excelJson = ExcelJson;

        writeExcelFile(excelJson);
        /*
         */


        console.log('THIS IS FINISHED');
        console.log('THIS IS FINISHED');
        // console.log(JSON.stringify(excelJson, null, 2));
        console.log('THIS IS FINISHED');
        console.log('THIS IS FINISHED');
        /*
         */
    }
}

/**
 * Loop all of the date ranges, creating a master object with variables to be replaced in future loops
 */
async function addPeriods(accounts) {
    let excelObject = {};

    excelObject.global = accounts.global;
    excelObject.periods = [];

    // loop the periods
    for (let m = moment(LastRun.last_run_date); m.isBefore(new Date); m.add(1, 'months')) {
        let period = {};
        period.period = m.clone().toDate();
        period.account_groups = accounts.account_groups;
        excelObject.periods.push(period);

        for (ag = 0; ag < period.account_groups.length; ag++) {
            for (a = 0; a < period.account_groups[ag].accounts.length; a++) {
                period.account_groups[ag].accounts[a].included_account_ids = await getChildAccountIds(period.account_groups[ag].accounts[a].account_number);
                period.account_groups[ag].accounts[a].account_name = await getAccountName(period.account_groups[ag].accounts[a].account_number);
                period.account_groups[ag].accounts[a].balance = await getBalance(await getChildAccountIds(period.account_groups[ag].accounts[a].account_number), m.clone());
            }
        }
    }
    return excelObject;
}


/**
 * Get the account names based on the number
 */
async function getAccountName(accountNumber) {
    return AccountDetail.findAll({
            where: {
                account_number: {
                    $eq: accountNumber,
                },
                active_yn: {
                    $eq: 'YES'
                },
            }
        })
        .then((a) => {
            return a[0].dataValues.name;
        })
        .catch((a) => {
            return 'Unknown Account';
        })
}

/**
 * Get all of the child account numbers which are relevant to the account numbers
 */
function getChildAccountIds(parentAccountId) {
    let accountIds = new Array;
    return AccountDetail.findAll({
        where: {
            account_number: {
                $eq: parentAccountId,
            },
            active_yn: {
                $eq: 'YES'
            },
        },
        include: [{
            model: AccountDetail,
            as: 'child_accounts',
            where: {
                active_yn: {
                    $eq: 'YES'
                },
            },
            include: [{
                    model: JournalLineItem,
                    as: 'journal_line_items',
                }

            ]
        }]
    }).map((ads) => {
        accountIds.push(ads.account_id);
        ads.child_accounts.forEach((ad) => {
            accountIds.push(ad.account_id);
        })
        return accountIds;
    })
}


/**
 * Populate the account balance of each account
 * @param {*} accounts 
 */
function getBalance(accountIds, momentDate) {

    if (accountIds.length === 0) {
        return 0;
    }

    return JournalLineItem.sum(
            'credit', {
                where: {
                    $and: [{
                            account_id: {
                                $in: accountIds[0]
                            }
                        },
                        {
                            created_at: {
                                $between: [momentDate.toDate(), momentDate.endOf('month').toDate()]
                            }
                        }
                    ]
                }
            },
        )
        .then((bal) => {
            if (bal) {
                return bal;
            } else {
                return 0;
            }
        })
}

/**
 * write an excel file with the excelJson material
 */
function writeExcelFile(excelJson) {
    let workbook = new Excel.Workbook();

    // set the workbook properties
    workbook.creator = 'Doug Boyd Software';
    workbook.lastModifiedBy = 'Doug Boyd Software';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    workbook.properties.date1904 = true;

    const sheet = workbook.addWorksheet('Sheet1');

    // Header material
    sheet.addRow(['Company Name:', excelJson.global.company_name]);
    sheet.addRow(['First Month of Financial Year:', 'July']);
    sheet.addRow(['Period Frequency:', 'Monthly']);
    sheet.addRow([]);

    // Headers and Periods
    let headers = [];
    headers.push('Account Tag');
    headers.push('Account Name');
    for (p = 0; p < excelJson.periods.length; p++) {
        headers.push(dateFormat(excelJson.periods[p].period, 'mmm-yy'));
    }
    sheet.addRow(headers);

    let rows = [];

    let dataRow = 6;
    let dataColumn = 1;
    let balance = 0;

    // loop the periods
    for (p = 0; p < excelJson.periods.length; p++) {
        dataRow = 6;
        dataColumn++;
        // loop the account_groups
        for (ag = 0; ag < excelJson.periods[p].account_groups.length; ag++) {

            // The first time through the period has to include the lefthand row names1G
            if (p === 0) {
                sheet.getCell(`B${dataRow}`).value = excelJson.periods[p].account_groups[ag].name
                sheet.getCell(`B${dataRow}`).font = {bold: true}
            }
            dataRow++;

            // loop the accounts
            for (a = 0; a < excelJson.periods[p].account_groups[ag].accounts.length; a++) {
                if (p === 0) {
                    sheet.getCell(`A${dataRow}`).value = `${excelJson.periods[p].account_groups[ag].accounts[a].account_tag}`;
                    sheet.getCell(`B${dataRow}`).value = `${excelJson.periods[p].account_groups[ag].accounts[a].account_name} (${excelJson.periods[p].account_groups[ag].accounts[a].account_number})`;
                }

                // write the balances
                balance = parseFloat(excelJson.periods[p].account_groups[ag].accounts[a].balance).toFixed(2);
                sheet.getCell(`${SheetColumns.column_names[dataColumn]}${dataRow}`).value = balance;
                sheet.getCell(`${SheetColumns.column_names[dataColumn]}${dataRow}`).numFmt = '0.00';
                sheet.getCell(`${SheetColumns.column_names[dataColumn]}${dataRow}`).alignment = {horizontal: 'right'};
                sheet.getCell(`${SheetColumns.column_names[dataColumn]}5`).font = {bold: true};

                dataRow++;
            }

            // loop the accounts for the periods
            dataRow++;
        }
    }

    // Format the sheets
    sheet.getCell('A1').alignment = { horizontal: 'right' };
    sheet.getCell('A2').alignment = { horizontal: 'right' };
    sheet.getCell('A3').alignment = { horizontal: 'right' };
    sheet.getCell('A5').font = {bold: true}
    sheet.getCell('B5').font = {bold: true}
    sheet.getCell('B1').font = {bold: true};
    sheet.getCell('B2').font = {bold: true};
    sheet.getCell('B3').font = {bold: true};
    
    sheet.getColumn('A').width = 30;
    sheet.getColumn('B').width = 35;
    for(c=2; c<SheetColumns.column_names.length; c++) {
        sheet.getColumn(SheetColumns.column_names[c]).width = 15;
    }

    // Write the excel sheet
    workbook.xlsx.writeFile('./output/financial_import.xlsx')
        .then(function () {
            console.log('written');
            // done
        });
}