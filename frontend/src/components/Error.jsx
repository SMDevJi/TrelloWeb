import React from 'react';
import { MdError } from 'react-icons/md';

function Error({ text = "Something went wrong!" }) {
    return (
        <div className="loading-container w-full h-[200px] flex justify-center gap-2 items-center">
            <MdError color="red" size={24} />
            <h1 className="font-semibold">{text}</h1>
        </div>
    );
}

export default Error;
