import { Router } from 'express';
import { createCard, updateCard, deleteCard } from '../utils/trello.js';

const router = Router();


router.post('/', async (req, res) => {
  try {
    const { idList, name, desc } = req.body;
    const card = await createCard({ idList, name, desc });

    //req.app.get('io').emit('card:created', card);
    res.json(card);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


router.put('/:cardId', async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const card = await updateCard(cardId, req.body);

    //req.app.get('io').emit('card:updated', card);
    res.json(card);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


router.delete('/:cardId', async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const card = await deleteCard(cardId);

    //req.app.get('io').emit('card:deleted', { id: cardId });
    res.json(card);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
