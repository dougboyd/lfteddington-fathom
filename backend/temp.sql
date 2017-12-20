SELECT 
SUM("JournalLineItem".credit - "JournalLineItem".debit)
/*
"JournalLineItem"."id"
, "JournalLineItem"."debit"
, "JournalLineItem"."credit"
, "JournalLineItem"."journal_entry_id"
, "JournalLineItem"."account_id"
, "JournalLineItem"."action_id"
, "JournalLineItem"."created_at"
, "AccountDetail"."account_id" AS "AccountDetail.account_id"
, "AccountDetail"."parent_account_id" AS "AccountDetail.parent_account_id"
, "AccountDetail"."account_class_id" AS "AccountDetail.account_class_id"
, "AccountDetail"."account_number" AS "AccountDetail.account_number"
, "AccountDetail"."name" AS "AccountDetail.name"
, "AccountDetail"."description" AS "AccountDetail.description"
, "AccountDetail"."active_yn" AS "AccountDetail.active_yn"
, "JournalEntry"."id" AS "JournalEntry.id"
, "JournalEntry"."description" AS "JournalEntry.description"
, "JournalEntry"."created_at" AS "JournalEntry.created_at"
, "JournalEntry"."accounting_date" AS "JournalEntry.accounting_date" 
*/
FROM "journal_line_items" AS "JournalLineItem" 
INNER JOIN "account_details" AS "AccountDetail" 
ON "JournalLineItem"."account_id" = "AccountDetail"."account_id" 
AND "AccountDetail"."account_class_id" 
IN (3, 4)
INNER JOIN "journal_entries" AS "JournalEntry" 
ON "JournalLineItem"."journal_entry_id" = "JournalEntry"."id" 
AND "JournalEntry"."accounting_date" BETWEEN '2017-07-01 00:00:00.000 +00:00' AND '2017-12-14 23:59:59.999 +00:00' 
WHERE "JournalLineItem"."action_id" < 9000;
;

select sum(credit - debit) 
from journal_line_items jli 
inner join journal_entries je on je.id = jli.journal_entry_id 
inner join account_details ad on ad.account_id = jli.account_id and ad.active_yn = 'YES' 
where ad.account_class_id in (3,4) and je.accounting_date >= '2017-07-01' and je.accounting_date <= '2017-12-31' and jli.action_id < 9000
;