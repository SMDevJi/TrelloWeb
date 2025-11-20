import Error from '@/components/Error'
import Loading from '@/components/Loading'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner';
import { io } from "socket.io-client";
import Column from '@/components/Column'
import { IoMdArrowRoundBack } from "react-icons/io";

const socket = io(import.meta.env.VITE_BACKEND_URL);

function Board() {
    const { boardId } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [board, setBoard] = useState({})

    const loadBoard = () => {
        const options = {
            method: 'GET',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/boards/getboard/${boardId}`
        };
        setLoading(true);
        axios
            .request(options)
            .then(function (response) {
                if (response.data.success) {
                    setBoard(response.data.board);
                }
            })
            .catch(function (error) {
                setError(error)
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadBoard()
    }, [boardId])

    useEffect(() => {
        socket.emit("joinBoard", boardId);
        return () => {
            socket.emit("leaveBoard", boardId);
        };
    }, [boardId]);



    const handleDropCard = async (cardId, targetListId) => {

        setBoard(prev => {
            let updatedCards = [...prev.cards];
            const cardIndex = updatedCards.findIndex(c => c.id === cardId);
            const card = updatedCards[cardIndex];

            if (!card) return prev;


            card.idList = targetListId;


            const listCards = updatedCards.filter(c => c.idList === targetListId);
            const maxPos = listCards.length ? Math.max(...listCards.map(c => c.pos)) : 0;
            card.pos = maxPos + 1000;


            axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${card.id}`, {
                idList: card.idList,
                pos: card.pos
            });


            return { ...prev, cards: updatedCards };
        });

    };


    useEffect(() => {
        socket.on("card:created", (event) => {
            setBoard(prevBoard => {
                const updatedCards = [...(prevBoard.cards), event.card];

                return { ...prevBoard, cards: updatedCards };
            });
            toast.success("Card Created successfully!")
        });

        socket.on("card:deleted", (event) => {
            setBoard(prevBoard => {
                const updatedCards = prevBoard.cards.filter(card => card.id !== event.cardId);

                return { ...prevBoard, cards: updatedCards };
            });
            toast.success("Card deleted successfully!")

        });

        socket.on("card:updated", (event) => {
            const cardId = event.card.id
            const allowedKeys = ["name", "desc", "pos", "idList"];

            setBoard(prevBoard => {
                const updatedCards = prevBoard.cards.map(card => {
                    if (card.id === cardId) {
                        const updatedFields = {};
                        for (const key of allowedKeys) {
                            if (key in event.card) {
                                updatedFields[key] = event.card[key];
                            }
                        }
                        return { ...card, ...updatedFields };
                    }
                    return card;
                });

                return { ...prevBoard, cards: updatedCards };
            });
            toast.success("Card updated successfully!")
        });

        return () => {
            socket.off("card:created");
            socket.off("card:deleted");
            socket.off("card:updated");
        };
    }, []);



    if (error) {
        return (
            <div className='wrapper min-h-[80vh] px-4'>
                <Error />
            </div>
        );
    }

    if (loading) {
        return (
            <div className='wrapper min-h-[80vh] px-4'>
                <Loading />
            </div>
        );
    }

    return (
        <>
            <div className="heading bg-gray-800 p-4 mb-8">
                <h1 className='text-2xl font-semibold text-center'>{board.name}</h1>
            </div>

            <div className="wrapper max-w-7xl mx-auto p-6">
                <Link
                    to='/'
                    className="button-con flex justify-normal">
                    <div
                        className='cursor-pointer text-3xl flex justify-center items-center p-2'
                    >
                        <IoMdArrowRoundBack />
                        <h1 className='text-2xl'>Go Back</h1>
                    </div>
                </Link>

                <div className="lists grid md:grid-cols-3 gap-6 p-1">
                    {board.lists?.map((list) =>
                        <Column
                            key={list.id}
                            list={list}
                            cards={board.cards.filter(card => card.idList === list.id)}
                            onDropCard={handleDropCard}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default Board;
