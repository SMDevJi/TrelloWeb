import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";


function Task({ card }) {
    const [openOuter, setOpenOuter] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [title, setTitle] = useState(card.name);
    const [desc, setDesc] = useState(card.desc)

    useEffect(() => {
        setTitle(card.name);
        setDesc(card.desc);
    }, [card]);

    const handleDragStart = (e) => {
        e.dataTransfer.setData("cardId", card.id);
    };

    const deleteCard = (e) => {
        e.stopPropagation();
        setDeleting(true);

        axios
            .delete(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${card.id}`)
            .then((response) => {
                if (response.data.success) {
                    //toast.success(`Task '${card.name}' deleted successfully!`);
                    setOpenDelete(false);
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error("Failed to delete task!");
            })
            .finally(() => setDeleting(false));
    };

    const handleUpdate = (e) => {
        console.log(title)
        if (title === "") return
        e.stopPropagation();
        setUpdating(true);

        axios
            .put(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${card.id}`,
                {
                    "name": title,
                    "desc": desc,
                    "idList": card.idList
                }
            )
            .then((response) => {
                if (response.data.success) {
                    toast.success("Board created successfully!");
                    setOpenOuter(false);
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error("Failed to create board!");
            })
            .finally(() => setUpdating(false));
    };

    return (
        <>

            <Dialog open={openOuter} onOpenChange={setOpenOuter}>
                <DialogTrigger asChild>
                    <motion.div

                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}


                        draggable
                        onDragStart={handleDragStart}
                        className="relative wrapper bg-gray-600 border-2 border-gray-600 p-4 rounded-md mb-3
            transform transition duration-200 ease-in-out hover:scale-102  hover:cursor-pointer 
     hover:shadow-[0_0_5px_3px_rgba(156,163,175,0.45)]"
                    >
                        <h1 className="font-semibold">{card.name}</h1>


                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenDelete(true);
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-2 cursor-pointer"
                        >
                            <RiDeleteBinLine />
                        </button>
                    </motion.div>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="font-bold text-start text-xl">Update Task <span className="text-green-400 ml-1">"{card.name}"</span></DialogTitle>
                    </DialogHeader>

                    <div className="inputs">
                        <div className="grid gap-2">
                            <label htmlFor="taskTitle" className="text-lg text-gray-300 mb-1">
                                Title:
                            </label>
                            <input
                                id="taskTitle"
                                name="taskTitle"
                                placeholder="Enter Title of Task..."
                                className="border border-gray-400/50 rounded-md p-4 text-lg"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                            />
                        </div>


                        <div className="grid gap-2 mt-2">
                            <label htmlFor="taskDesc" className="text-lg text-gray-300 mb-1">
                                Description:
                            </label>
                            <textarea
                                id="taskDesc"
                                name="taskDesc"
                                placeholder="Enter Description..."
                                className="border border-gray-400/50 rounded-md p-4 text-lg"
                                onChange={(e) => setDesc(e.target.value)}
                                value={desc}
                            />
                        </div>
                    </div>


                    <DialogFooter>
                        <DialogClose asChild>
                            <button className="border border-gray-400/50 hover:bg-accent py-1.5 px-2 rounded-md font-medium mr-2 cursor-pointer">
                                Cancel
                            </button>
                        </DialogClose>
                        <button
                            type="button"
                            onClick={handleUpdate}
                            className={`bg-white ${updating ? "text-gray-600" : "text-black"} py-1.5 px-2 rounded-md font-medium hover:bg-gray-200 cursor-pointer flex justify-center items-center`}
                        >
                            {updating && <FaSpinner className="animate-spin mr-2" />}
                            {updating ? "Updating Task..." : "Update Task"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Confirmation</DialogTitle>
                        <DialogDescription className="text-lg text-gray-300">
                            Are you sure you want to delete '{card.name}'?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <DialogClose asChild>
                            <button className="border border-gray-400/50 hover:bg-accent py-1.5 px-2 rounded-md font-medium mr-2 cursor-pointer">
                                Cancel
                            </button>
                        </DialogClose>
                        <button
                            type="button"
                            onClick={deleteCard}
                            className={`bg-white ${deleting ? "text-gray-600" : "text-black"} py-1.5 px-2 rounded-md font-medium hover:bg-gray-200 cursor-pointer flex justify-center items-center`}
                        >
                            {deleting && <FaSpinner className="animate-spin mr-2" />}
                            {deleting ? "Deleting Task..." : "Delete Task"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default Task;
