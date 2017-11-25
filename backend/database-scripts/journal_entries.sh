#!/bin/bash

fields="id:integer,description:string,created_by:integer,action_type:string,action_id:integer,parent_journal_entry_id:integer,total_transaction_amount:integer,bank_deposit_slip_id:integer,account_payment_number_id:integer"

rm -rf ./server/models/journal_entries.js

./node_modules/.bin/sequelize model:create --name journal_entries --attributes ${fields}