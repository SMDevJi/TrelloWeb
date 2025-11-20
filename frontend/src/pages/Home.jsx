import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading';
import Card from '../components/Card';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FaSpinner } from 'react-icons/fa';
import { io } from "socket.io-client";
import { motion } from 'framer-motion';
const socket = io(import.meta.env.VITE_BACKEND_URL);


function Home() {
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [boards, setBoards] = useState([])
  const [title, setTitle] = useState('')

  const loadCards = () => {
    const options = {
      method: 'GET',
      url: `${import.meta.env.VITE_BACKEND_URL}/api/boards/getall`
    };
    setLoading(true);
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        if (response.data.success) {
          setBoards(response.data.boards);
        }
      })
      .catch(function (error) {
        console.error(error);
        setError(error)
      })
      .finally(() => setLoading(false));
  };



  const handleCreate = () => {
    if (title === "") return
    const options = {
      method: 'POST',
      url: `${import.meta.env.VITE_BACKEND_URL}/api/boards`,
      data: {
        "name": title,
        "defaultLists": true
      }
    };
    setCreating(true);
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        if (response.data.success) {
          setTitle('')
          //toast.success(`Board created successfully!`)
        }
      })
      .catch(function (error) {
        console.error(error);
        toast.error('Failed to create Board!')
      })
      .finally(() => {
        setCreating(false)
        setOpen(false)
      });
  };



  useEffect(() => {
    loadCards()
  }, [])


  useEffect(() => {
    socket.on("board:created", (board) => {
      console.log(board)
      toast.success("Board created successfully!")
      setBoards(prev => [...prev, board]);
    });

    socket.on("board:deleted", ({ id }) => {
      console.log(id)
      toast.success("Board deleted successfully!")
      setBoards(prev => prev.filter(b => b.id !== id));
    });


    return () => {
      socket.off("board:created");
      socket.off("board:deleted");
    };
  }, []);





  if (error) {
    return <div className='wrapper min-h-[80vh] px-4'>
      <Error />
    </div>
  }


  if (loading) {
    return <div className='wrapper min-h-[80vh] px-4'>
      <Loading />
    </div>
  }

  return (
    <div className='max-w-7xl mx-auto p-6 '>
      <h1 className=' text-3xl mb-8 font-semibold text-center'>Trello Frontend</h1>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <form>
            <DialogTrigger asChild>
              <div className="cursor-pointer max-w-80 mt-3 add-btn bg-gray-200  p-10 rounded-md flex justify-center items-center    transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-md hover:border-gray-400">
                <p className='text-gray-800 font-medium'>+ Add New</p>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader className=''>
                <DialogTitle className='font-bold text-start text-xl'>Create a new Trello Board</DialogTitle>

              </DialogHeader>
              <div className="">


                <div className="grid gap-1">
                  <label htmlFor="role" className='text-lg text-gray-300 mb-1'>Title:</label>
                  <input id="role" name="role" placeholder='Enter Title of New Board..' className='border  border-gray-400/50 rounded-md p-4 text-lg' onChange={(e) => setTitle(e.target.value)} />
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
                  {creating ? `Creating Board... ` : 'Create Board'}
                </button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </motion.div>


      <h1 className=' text-2xl mb-4 mt-4 font-semibold'>Your Boards:</h1>
      <div className='boards  grid md:grid-cols-3 gap-6 p-1'>
        {boards.map(board =>
          <Card board={board} key={board.id} />
        )}
      </div>
    </div>
  )
}

export default Home