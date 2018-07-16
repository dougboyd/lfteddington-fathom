SELECT jli.debit, 
    jli.credit,
    je.accounting_date,
    jli.action_id
FROM journal_line_items jli
INNER JOIN journal_entries je   
    ON je.id = jli.journal_entry_id
WHERE jli.account_id = 5
;

