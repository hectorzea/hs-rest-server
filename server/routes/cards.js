const express = require('express');
const app = express();

app.get('/cards', (request, response) => {
    response.json('get cards')
});

app.put('/cards/:card_id', (request, response) => {
    let card_id = request.params.card_id;
    response.json({
        card_id
    })
});

app.post('/cards', (request, response) => {
    let card = request.body;
    if (!card.name) {
        response.status(400).json({
            status: "failed",
            message: "you must add a card name"
        });
    } else {
        response.json({card});
    }

});

app.delete('/cards', (request, response) => {
    response.json('delete cards')
});

module.exports = app;
