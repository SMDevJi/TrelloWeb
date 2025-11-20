import { Router } from 'express';
import { createBoard, deleteBoard, getAllBoards, getBoard } from '../utils/trello.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { name, defaultLists } = req.body;
        const board = await createBoard(name,defaultLists);

        req.app.get('io').emit('board:created', board.board);
        res.status(200).json(board);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});








router.delete('/delete/:boardId', async (req, res) => {
    try {
        const { boardId } = req.params;
        const board = await deleteBoard(boardId);

        req.app.get('io').emit('board:deleted', board);
        res.status(200).json(board);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});


router.get('/getall', async (req, res) => {
    try {
        const board = await getAllBoards();
        res.status(200).json(board);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});


router.get('/getboard/:boardId', async (req, res) => {
    try {
        const { boardId } = req.params;
        const board = await getBoard(boardId);
        res.status(200).json(board);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
