import React, { useState } from 'react'
import { RiDeleteBinLine } from "react-icons/ri";
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
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
import axios from 'axios';
import { toast } from 'sonner';
import { motion } from 'framer-motion';



function Card({ board }) {
    const [open, setOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const deleteBoard = () => {
        const options = {
            method: 'DELETE',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/boards/delete/${board.id}`
        };
        setDeleting(true);
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                if (response.data.success) {
                    console.log("deleted")
                    //toast.success(`${board.name} deleted successfully!`)
                }
            })
            .catch(function (error) {
                console.error(error);
                toast.error('Failed to delete Board!')
            })
            .finally(() => setDeleting(false));
    };



    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}

            className="relative bg-white dark:bg-gray-800 shadow-md overflow-hidden rounded-xl transform transition duration-300 ease-in-out hover:scale-102 hover:shadow-xl hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.7)]">

            <Dialog open={open} onOpenChange={setOpen}>
                <form>

                    <DialogTrigger asChild>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(true);
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-2 cursor-pointer"
                        >
                            <RiDeleteBinLine />
                        </button>
                    </DialogTrigger>


                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className='text-xl'>Confirmation</DialogTitle>
                            <DialogDescription className='text-lg text-gray-300'>
                                Are you sure you want to delete '{board.name}'?
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter >
                            <DialogClose asChild>
                                <button className='border  border-gray-400/50 hover:bg-accent py-1.5 px-2 rounded-md font-medium mr-2 cursor-pointer'>Cancel</button>
                            </DialogClose>
                            <button
                                type="submit"
                                className={`bg-white ${deleting ? 'text-gray-600' : 'text-black'} py-1.5 px-2 rounded-md font-medium hover:bg-gray-200 cursor-pointer flex justify-center items-center`}
                                onClick={deleteBoard}
                            >
                                {deleting ? <FaSpinner className="animate-spin mr-2" /> : ''}
                                {deleting ? 'Deleting Board...' : 'Delete Board'}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>

            <Link to={`/board/${board.id}`}>
                <div>
                    <img src="/card-cover.svg" alt="Cover Image" className="w-full h-48 object-cover" />
                    <div className="p-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{board.name}</h2>
                    </div>
                </div>
            </Link>



        </motion.div>
    )
}

export default Card
