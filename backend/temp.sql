
-- SELECT SUM(jli.debit - jli.credit)
  --   , ad.account_number, ad.name
SELECT ad.account_id
FROM journal_line_items jli
INNER JOIN journal_entries je   
    ON je.id = jli.journal_entry_id
INNER JOIN account_details ad
    ON ad.account_id = jli.account_id
WHERE 1 = 1
    AND je.accounting_date BETWEEN '1970-02-01 00:00:00.000 +00:00' AND '2017-08-31 23:59:59.999 +00:00' 
    AND jli.action_id < 9000
    AND ad.account_number IN 
    (
            '2-221602',
            '2-221800',
            '2-221801',
            '2-221805'
    )
    AND ad.active_yn = 'YES'
GROUP BY ad.account_id
-- GROUP BY ad.account_number, ad.name
;

SELECT SUM(jli.debit - jli.credit)
    , ad.name
    , ad.account_number
FROM journal_line_items jli
INNER JOIN journal_entries je   
    ON je.id = jli.journal_entry_id
INNER JOIN account_details ad   
    ON ad.account_id = jli.account_id
    AND ad.active_yn = 'YES'
WHERE 1 = 1
    AND je.accounting_date <= '2017-08-31 23:59:59.999 +00:00' 
    AND jli.action_id < 9000
    AND jli.account_id IN 
    (
        991,
        1015,
        54,
        47
    )
-- GROUP BY ad.account_id
GROUP BY ad.account_number, ad.name
;


/*
SELECT "JournalLineItem"."id", "JournalLineItem"."debit", "JournalLineItem"."credit", "JournalLineItem"."journal_entry_id", "JournalLineItem"."account_id", "JournalLineItem"."action_id", "JournalLineItem"."created_at", "JournalEntry"."id" AS "JournalEntry.id", "JournalEntry"."description" AS "JournalEntry.description", "JournalEntry"."created_at" AS "JournalEntry.created_at", "JournalEntry"."accounting_date" AS "JournalEntry.accounting_date" 
FROM "journal_line_items" AS "JournalLineItem" INNER JOIN "journal_entries" AS "JournalEntry" ON "JournalLineItem"."journal_entry_id" = "JournalEntry"."id" AND "JournalEntry"."accounting_date" <= '2017-10-31 23:59:59.999 +00:00' 
WHERE ("JournalLineItem"."account_id" IN (15, 1010, 8) AND "JournalLineItem"."action_id" < 9000);
*/