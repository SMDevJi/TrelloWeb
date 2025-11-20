import React, { useState } from "react";
import Task from "./Task";
import { toast } from 'sonner';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FaSpinner } from 'react-icons/fa';
import axios from "axios";
import { motion } from "framer-motion";


function Column({ list, cards, onDropCard }) {
    const [creating, setCreating] = useState(false)
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')


    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData("cardId");
        if (!cardId) return;

        onDropCard(cardId, list.id);
    };



    const handleCreate = () => {
        if (title === "" ) return
        const options = {
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/tasks`,
            data: {
                "name": title,
                "desc": desc,
                "idList": list.id
            }
        };
        setCreating(true);
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                if (response.data.success) {
                    setTitle('')
                    setDesc('')
                    //toast.success(`Task created successfully!`)
                }
            })
            .catch(function (error) {
                console.error(error);
                toast.error('Failed to create Task!')
            })
            .finally(() => {
                setCreating(false)
                setOpen(false)
            });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="list border-gray-600 border rounded-md p-4 bg-gray-800">
            <h1 className="text-xl font-semibold text-center mb-3">{list.name}</h1>
            <hr className="border mb-2"/>

            <div
                className="cards-con min-h-[200px] p-2 rounded"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {cards
                    .sort((a, b) => a.pos - b.pos)
                    .map((card) => (
                        <Task card={card} key={card.id} />
                    ))}


                <motion.div

                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 2 }}

                >
                    <Dialog open={open} onOpenChange={setOpen}>
                        <form>
                            <DialogTrigger asChild>
                                <div className="cursor-pointer w-full  add-btn bg-gray-200  p-4 rounded-md flex justify-center items-center    transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-md hover:border-gray-400">
                                    <p className='text-gray-800 font-medium'>+ Add New</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader className=''>
                                    <DialogTitle className='font-bold text-start text-xl'>Create a New Task at <span className="text-green-400 ml-1">"{list.name}"</span></DialogTitle>

                                </DialogHeader>
                                <div className="">


                                    <div className="grid gap-1">
                                        <label htmlFor="title" className='text-lg text-gray-300 mb-1'>Title:</label>
                                        <input id="title" name="title" placeholder='Enter Title of New Task..' className='border  border-gray-400/50 rounded-md p-4 text-lg' value={title} onChange={(e) => setTitle(e.target.value)} />
                                    </div>


                                    <div className="grid gap-1 mt-2">
                                        <label htmlFor="desc" className='text-lg text-gray-300 mb-1'>Description:</label>
                                        <textarea id="desc" name="desc" placeholder='Enter Description..' className='border  border-gray-400/50 rounded-md p-4 text-lg' value={desc} onChange={(e) => setDesc(e.target.value)} />
                                    </div>



                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <button className=' border  border-gray-400/50 hover:bg-accent py-1.5 px-2 rounded-md font-medium mr-2 cursor-pointer'>Cancel</button>
                                    </DialogClose>
                                    <button
                                        onClick={handleCreate}
                                        type="submit" className={`bg-white ${creating ? 'text-gray-600' : 'text-black'} py-1.5 px-2 rounded-md font-medium hover:bg-gray-200 cursor-pointer flex justify-center items-center`} >
                                        {creating ? <FaSpinner className="animate-spin mr-2" /> : ''}
                                        {creating ? `Creating Task... ` : 'Create Task'}
                                    </button>
                                </DialogFooter>
                            </DialogContent>
                        </form>
                    </Dialog>
                </motion.div>

            </div>
        </motion.div>
    );
}

export default Column;
