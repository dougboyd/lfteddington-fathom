/*
const journalEntries = require('./journalEntries');

module.exports = {
    journalEntries
}
*/

const journalETLController = require('../controllers/journalETLController');

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: "Welcome to the JournalEntries API",
    }));

    app.get('/api/journalETLController', journalETLController.list);
    // app.post('/api/todos', todosController.create);
}