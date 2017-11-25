/*
const journalEntries = require('./journalEntries');

module.exports = {
    journalEntries
}
*/

const journalEntriesController = require('../controllers/journalEntries');
const todosController = require('../controllers/todos');

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: "Welcome to the JournalEntries API",
    }));

    app.get('/api/journalEntries', journalEntriesController.list);
    // app.post('/api/todos', todosController.create);
    app.get('/api/todos', todosController.list);
}