const journalEntriesController = require('../controllers/journalEntries');

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: "Welcome to the JournalEntries API",
    }));

    app.get('/api/journalEntries', journalEntriesController.list);
}