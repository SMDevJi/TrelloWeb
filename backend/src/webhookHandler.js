import axios from "axios";

const BASE = process.env.TRELLO_API_BASE;
const auth = {
    key: process.env.TRELLO_API_KEY,
    token: process.env.TRELLO_API_TOKEN
};

const webhookHandler = async (req, res) => {
    const io = req.app.get('io');

    if (req.method === 'HEAD') {
        console.log('head received')
        return res.sendStatus(200);
    }

    const payload = req.body;
    const action = payload.action || {};
    const type = action.type;
    const data = action.data || {};


    const boardId = data.board?.id;
    if (!boardId) {
        console.log("No boardId there in payload");
        return res.sendStatus(200);
    }

    let event = null;

    if (type === 'createCard') {
        const res = await axios.get(`${BASE}/cards/${data.card.id}`, {
            params: {
                ...auth,
                fields: "pos,desc",
            }
        });

        let card = res.data;
        console.log(data.list)

        event = {
            type: 'card:created',
            card: {
                id: card.id,
                name: data.card.name,
                desc: card.desc || "",
                idList: data.list.id,
                pos:card.pos
            }
        };
    } else if (type === 'updateCard') {
        event = { type: 'card:updated', card: data.card };
    } else if (type === 'deleteCard') {
        event = { type: 'card:deleted', cardId: data.card?.id };
    } else {
        event = { type: 'trello:event', raw: payload };
    }


    console.log(event)
    console.log(`Emitting ${event.type} to board ${boardId}`);

    io.to(boardId).emit(event.type, event);
    res.sendStatus(200);
};

export default webhookHandler;
