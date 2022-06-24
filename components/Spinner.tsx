import React from 'react';
import spinner from "../public/spinner.svg";

const Spinner: React.FC = () => {
    return (
        <div className={"bg-[#121212] w-full h-screen flex items-center justify-center pb-32"}>
            <img src={spinner} className={"w-36 h-36"} alt={"Loading..."}/>
        </div>
    );
};

export default Spinner;