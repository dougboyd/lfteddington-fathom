const LastRun = require("../server/config/last_run");
const SheetColumns = require("../server/config/sheetColumns");
const ProfitAndLossTags = require("../server/config/fathom_profit_and_loss_accounts");
const moment = require("moment");
const Accounts = require("../server/config/accounts");
const AccountDetail = require("../server/models").AccountDetail;
const JournalLineItem = require("../server/models").JournalLineItem;
const JournalEntry = require("../server/models").JournalEntry;
const util = require("util");
const _ = require("lodash");

var Excel = require("exceljs");
let excelJson = {};
var dateFormat = require("dateformat");

// dev only
const ExcelJson = require("../excelJson");

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
        // excelJson = ExcelJson;
        */

    await writeExcelFile(excelJson);

    // await submitFile();

    console.log("THIS IS FINISHED");
    console.log("THIS IS FINISHED");
    console.log(JSON.stringify(excelJson, null, 2));
    console.log("THIS IS FINISHED");
    console.log("THIS IS FINISHED");
    /*
         */
  }
};

/**
 * Loop all of the date ranges, creating a master object with variables to be replaced in future loops
 */
async function addPeriods(accountsJSON) {
  let excelObject = {};

  excelObject.global = accountsJSON.global;
  excelObject.periods = [];
  let tmp = [];

  // loop the periods
  for (
    let m = moment(LastRun.last_run_date);
    m.isBefore(new Date());
    m.add(1, "months")
  ) {
    var period = {};
    period.period_date = m.clone().toDate();
    period.account_groups = [];

    for (ag = 0; ag < accountsJSON.account_groups.length; ag++) {
      accountGroup = {};
      accountGroup.name = accountsJSON.account_groups[ag].name;

      accountGroup.accounts = [];
      for (a = 0; a < accountsJSON.account_groups[ag].accounts.length; a++) {
        let account = {};
        let accountDetail = {};
        // 
        if (
          accountsJSON.account_groups[ag].accounts[a].account_number ===
          "CURRENT-EARNINGS"
        ) {
            account.account_tag =
            accountsJSON.account_groups[ag].accounts[a].account_tag;
          account.included_account_ids = "";
          account.account_name = "Current Earnings";
          account.account_class_id = 0;
          account.balance = await getCurrentEarningsBalance(m.clone());
          account.account_number = "";
        } else {
        
        
                accountDetail = await getAccountName(accountsJSON.account_groups[ag].accounts[a].account_number);
                account.account_tag = accountsJSON.account_groups[ag].accounts[a].account_tag;
                account.included_account_ids = await getChildAccountIds(accountsJSON.account_groups[ag].accounts[a]);
                // account.account_name = await getAccountName(accountsJSON.account_groups[ag].accounts[a].account_number);
                account.account_name = accountDetail.name;
                account.account_class_id = accountDetail.account_class_id;
                account.balance = await getBalance(account, m.clone());
                account.account_number = accountsJSON.account_groups[ag].accounts[a].account_number;
        
        
        }
        accountGroup.accounts.push(account);
      }
      period.account_groups.push(accountGroup);
    }

    excelObject.periods.push(period);
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
        $eq: accountNumber
      },
      active_yn: {
        $eq: "YES"
      }
    }
  })
    .then(a => {
      return a[0].dataValues;
    })
    .catch(a => {
      return "Unknown Account";
    });
}

/**
 * Get all of the child account numbers which are relevant to the account numbers
 */
function getChildAccountIds(accountObject) {
  let accountIds = new Array();

  // add the parent account number if it isn't already in the array
  let accountNumbers = accountObject.included_account_numbers;
  if (!accountNumbers.indexOf(accountObject.account_number)) {
    accountNumbers.push(accountObject.account_number);
  }

  // If the accountObject.included_account_numbers is empty, then run the original account_number
  if (accountObject.included_account_numbers.length > 0) {
    return AccountDetail.findAll({
      where: {
        account_number: {
          $in: accountNumbers
        },
        active_yn: {
          $eq: "YES"
        }
      }
    }).then(ads => {
      ads.forEach(a => {
        accountIds.push(a.account_id);
      });
      console.log(accountIds);
      return [accountIds];
    });
  } else {
    return AccountDetail.findAll({
      where: {
        account_number: {
          $eq: accountObject.account_number
        },
        active_yn: {
          $eq: "YES"
        }
      },
      include: [
        {
          model: AccountDetail,
          as: "child_accounts",
          where: {
            active_yn: {
              $eq: "YES"
            }
          },
          include: [
            {
              model: JournalLineItem,
              as: "journal_line_items"
            }
          ]
        }
      ]
    }).map(ads => {
      accountIds.push(ads.account_id);
      ads.child_accounts.forEach(ad => {
        accountIds.push(ad.account_id);
      });
      return accountIds;
    });
  }
}

/**
 * Populate the debit balance of each account
 * @param {*} accounts
 */
async function getBalance(account, momentDate) {
  let accountIds = account.included_account_ids;

  if (accountIds.length === 0) {
    return 0;
  }

  // if (account.account_tag.indexOf('REV', 'VCOS', 'FCOS', 'DEP', 'VEXP', 'FEXP', 'DA', 'IINC', 'AINC', 'IEXP', 'TEXP', 'DIV', 'ADJ', 'OEXP')) {
  if (ProfitAndLossTags.indexOf(account.account_tag) > -1) {
    // balance for p/l
    return await JournalLineItem.findAll({
      where: {
        $and: {
          account_id: {
            $in: accountIds[0]
          },
          action_id: {
            $lt: 9000
          }
        }
      },
      include: [
        {
          model: JournalEntry,
          where: {
            accounting_date: {
              $between: [
                momentDate.toDate(),
                momentDate.endOf("month").toDate()
              ]
            }
          }
        }
      ]
    }).then(res => {
      let balance = 0; // = 1090;
      if (account.account_class_id === 1 || account.account_class_id === 3) {
        for (b = 0; b < res.length; b++) {
          balance =
            balance + parseFloat(res[b].debit) - parseFloat(res[b].credit);
        }
      } else {
        for (b = 0; b < res.length; b++) {
          balance =
            balance + parseFloat(res[b].credit) - parseFloat(res[b].debit);
        }
      }
      return Math.round(parseFloat(balance) * 100) / 100;
    });
  } else {
    // balance for balance sheet
    return await JournalLineItem.findAll({
      where: {
        $and: {
          account_id: {
            $in: accountIds[0]
          },
          action_id: {
            $lt: 900000
          }
        }
      },
      include: [
        {
          model: JournalEntry,
          where: {
            accounting_date: {
              $lte: momentDate.endOf("month").toDate()
            }
          }
        }
      ]
    }).then(res => {
      let balance = 0; // = 1090;
      if (account.account_class_id === 1 || account.account_class_id === 3) {
        for (b = 0; b < res.length; b++) {
          balance =
            balance + parseFloat(res[b].debit) - parseFloat(res[b].credit);
        }
      } else {
        for (b = 0; b < res.length; b++) {
          balance =
            balance + parseFloat(res[b].credit) - parseFloat(res[b].debit);
        }
      }
      return Math.round(parseFloat(balance) * 100) / 100;
    });
  }
}

/**
 * Populate the Current Earnings
 * @param {*} momentDate
 */
async function getCurrentEarningsBalance(momentDate) {
  /*
select sum(credit - debit) 
from journal_line_items jli 
inner join journal_entries je on je.id = jli.journal_entry_id 
inner join account_details ad on ad.account_id = jli.account_id and ad.active_yn = 'YES' 
where ad.account_class_id in (3,4) and je.accounting_date >= '2017-07-01' and je.accounting_date <= '2017-12-14' and jli.action_id < 9000
*/

  // balance for balance sheet
  return await JournalLineItem.findAll({
    where: {
      action_id: {
        $lt: 9000
      }
    },
    include: [
      {
        model: AccountDetail,
        where: {
          $and: {
            account_class_id: {
              $in: [3, 4]
            },
            active_yn: {
              $eq: "YES"
            }
          }
        }
      },
      {
        model: JournalEntry,
        where: {
          accounting_date: {
            $between: [
              new Date("2017-07-01"),
              momentDate.endOf("month").toDate()
            ]
          }
        }
      }
    ]
  }).then(res => {
    let balance = 0; // = 1090;

    for (b = 0; b < res.length; b++) {
      balance = balance + parseFloat(res[b].credit) - parseFloat(res[b].debit);
    }
    /*
      if (account.account_class_id === 1 || account.account_class_id === 3) {
        for (b = 0; b < res.length; b++) {
          balance =
            balance + parseFloat(res[b].debit) - parseFloat(res[b].credit);
        }
      } else {
        for (b = 0; b < res.length; b++) {
          balance =
            balance + parseFloat(res[b].credit) - parseFloat(res[b].debit);
        }
      }
      */
    return Math.round(parseFloat(balance) * 100) / 100;
  });
}

/**
 * write an excel file with the excelJson material
 */
async function writeExcelFile(excelJson) {
  let workbook = new Excel.Workbook();

  // set the workbook properties
  workbook.creator = "Doug Boyd Software";
  workbook.lastModifiedBy = "Doug Boyd Software";
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();
  workbook.properties.date1904 = true;

  const sheet = workbook.addWorksheet("Sheet1");

  // Header material
  sheet.addRow(["Company Name:", excelJson.global.company_name]);
  sheet.addRow(["First Month of Financial Year:", "July"]);
  sheet.addRow(["Period Frequency:", "Monthly"]);
  sheet.addRow([]);

  // Headers and Periods
  let headers = [];
  headers.push("Account Tag");
  headers.push("Account Name");
  for (p = 0; p < excelJson.periods.length; p++) {
    headers.push(dateFormat(excelJson.periods[p].period_date, "mmm-yy"));
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
        sheet.getCell(`B${dataRow}`).value =
          excelJson.periods[p].account_groups[ag].name;
        sheet.getCell(`B${dataRow}`).font = {
          bold: true
        };
      }
      dataRow++;

      // loop the accounts
      for (
        a = 0;
        a < excelJson.periods[p].account_groups[ag].accounts.length;
        a++
      ) {
        if (p === 0) {
          sheet.getCell(`A${dataRow}`).value = `${
            excelJson.periods[p].account_groups[ag].accounts[a].account_tag
          }`;
          sheet.getCell(`B${dataRow}`).value = `${
            excelJson.periods[p].account_groups[ag].accounts[a].account_name
          } (${
            excelJson.periods[p].account_groups[ag].accounts[a].account_number
          })`;
        }

        // write the balances
        balance = parseFloat(
          excelJson.periods[p].account_groups[ag].accounts[a].balance
        ).toFixed(2);
        sheet.getCell(
          `${SheetColumns.column_names[dataColumn]}${dataRow}`
        ).numFmt = 0.0;
        sheet.getCell(
          `${SheetColumns.column_names[dataColumn]}${dataRow}`
        ).value = parseFloat(balance);
        sheet.getCell(
          `${SheetColumns.column_names[dataColumn]}${dataRow}`
        ).alignment = {
          horizontal: "right"
        };
        sheet.getCell(`${SheetColumns.column_names[dataColumn]}5`).font = {
          bold: true
        };

        dataRow++;
      }

      // loop the accounts for the periods
      dataRow++;
    }
  }

  // Format the sheets
  sheet.getCell("A1").alignment = {
    horizontal: "right"
  };
  sheet.getCell("A2").alignment = {
    horizontal: "right"
  };
  sheet.getCell("A3").alignment = {
    horizontal: "right"
  };
  sheet.getCell("A5").font = {
    bold: true
  };
  sheet.getCell("B5").font = {
    bold: true
  };
  sheet.getCell("B1").font = {
    bold: true
  };
  sheet.getCell("B2").font = {
    bold: true
  };
  sheet.getCell("B3").font = {
    bold: true
  };

  sheet.getColumn("A").width = 30;
  sheet.getColumn("B").width = 35;
  for (c = 2; c < SheetColumns.column_names.length; c++) {
    sheet.getColumn(SheetColumns.column_names[c]).width = 15;
  }

  // Write the excel sheet
  workbook.xlsx.writeFile("./output/financial_import.xlsx").then(function() {
    console.log("written");
    // done
  });
}
