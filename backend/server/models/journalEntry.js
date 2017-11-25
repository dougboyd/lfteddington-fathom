module.exports = (sequelize, DataTypes) => {
  const JournalEntry = sequelize.define(
    'JournalEntry',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false

      }, 
      description: DataTypes.STRING,
      /*
      created_by: DataTypes.INTEGER,
      action_type: DataTypes.STRING,
      action_id: DataTypes.INTEGER,
      parent_journal_entry_id: DataTypes.INTEGER,
      total_transaction_amount: DataTypes.INTEGER,
      bank_deposit_slip_id: DataTypes.INTEGER,
      account_payment_number_id: DataTypes.INTEGER,
      account_receipt_number_id: DataTypes.INTEGER,
      general_journal_id: DataTypes.INTEGER,
      accounting_date: DataTypes.DATE,
      trust_journal_id: DataTypes.INTEGER,
      journal_entry_reversed_yn: DataTypes.STRING,
      description_for_display: DataTypes.STRING,
      journal_entry_is_reversal_yn: DataTypes.STRING,
      credit_note_id: DataTypes.INTEGER,
      start_of_month_transaction_date: DataTypes.DATE,
      start_of_financial_year_transaction_date: DataTypes.DATE,
      debtors_ex_bills_balance_yn: DataTypes.STRING,
      unbilled_hard_disbursements_balance_yn: DataTypes.STRING,
      unbilled_soft_disbursements_balance_yn: DataTypes.STRING,
      unbilled_time_balance_yn: DataTypes.STRING,
      unpaid_professional_creditors_balance_yn: DataTypes.STRING,
      unpaid_trade_creditors_balance_yn: DataTypes.STRING,
      batch_event_finance_run_yn: DataTypes.STRING,
      journal_entry_finalised_yn: DataTypes.STRING,
      created_at: DataTypes.DATE,
      reversal_date: DataTypes.DATE,
      is_dishonour_yn: DataTypes.STRING,
      transaction_date: DataTypes.DATE
      */
    }, {
      tableName: "journal_entries",
      timestamps: false,
      underscored: true
    }
  );

  JournalEntry.associate = (models) => {
    JournalEntry.hasMany(models.JournalLineItem, {
      foreignKey: 'journal_entry_id'
    })
  }

  return JournalEntry;
};
