import React, {useState} from 'react';
import {ChevronDownIcon, LogoutIcon} from "@heroicons/react/outline";
import {signOut, useSession} from "next-auth/react";

const AccountButton = () => {
    const {data: session} = useSession();
    const [focus, setFocus] = useState(false);
    return (
        <button
            className={"absolute top-5 right-8"}
            onBlur={() => setFocus(false)}
            onClick={() => setFocus(!focus)}
        >
            <div
                className={"flex flex-col rounded-3xl items-center opacity-90 cursor-pointer"}>
                <div className={"flex rounded-3xl bg-black space-x-3 flex-row items-center p-1 z-40 text-white"}>
                    {session?.user.image ? <img
                        className={"rounded-full w-10 h-10"}
                        src={session?.user.image}
                        alt=""
                    /> : <div className={"w-10 h-10"}/>}
                    <h2 className={"hidden md:block"}>{session?.user.name}</h2>
                    <ChevronDownIcon className={"h-5 w-5 hidden md:block"}/>
                </div>
                <div
                    className={"text-gray-500 duration-200 pb-2 w-full h-12 justify-center items-end rounded-b-3xl absolute bg-black transition-all flex space-x-2 hover:text-white " + ((focus) ? "opacity-100 mt-7" : "opacity-0 ")}
                    onClick={() => {
                        focus ? signOut() : null;
                    }}
                >
                    <LogoutIcon className="h-5 w-5"/>
                    <p className={"hidden md:block"}>Log out</p>
                </div>
            </div>
        </button>
    );
};

export default AccountButton;