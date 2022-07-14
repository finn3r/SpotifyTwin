import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";

const Collection: React.FC = ({children}) => {
    const router = useRouter();
    const path = router.route;
    const [columnCount, setColumnCount] = useState(0);
    const widthHandler = () => {
        const cellMinWidth = (window.innerWidth < 600) ? 150 : 250;
        setColumnCount(Math.round(window.innerWidth / cellMinWidth));
    };

    useEffect(() => {
        window.addEventListener("resize", widthHandler);
        setColumnCount(Math.round(window.innerWidth / ((window.innerWidth < 500) ? 150 : 250)));
        return () => {
            window.removeEventListener("resize", widthHandler);
        }
    }, []);
    return (
        <div className={"w-full h-screen bg-[#121212]"}>
            <header className={"flex flex-row flex-wrap text-white text-xl md:text-2xl xl:text-3xl font-bold m-5 mr-20"}>
                <p className={`rounded-xl p-2 hover:cursor-pointer ml-12 ${(path.includes("playlists")) ? "bg-[#2a2a2a]" : ""}`}
                   onClick={() => router.push("/collection/playlists")}>Playlists</p>
                <p className={`rounded-xl p-2 hover:cursor-pointer ${(path.includes("artists")) ? "bg-[#2a2a2a]" : ""}`}
                   onClick={() => router.push("/collection/artists")}>Artists</p>
                <p className={`rounded-xl p-2 hover:cursor-pointer ${(path.includes("albums")) ? "bg-[#2a2a2a]" : ""}`}
                   onClick={() => router.push("/collection/albums")}>Albums</p>
            </header>
            <div
                className={"pb-36 grid-flow-row h-screen scrollbar-hide overflow-y-scroll auto-rows-min " + (columnCount !== 0 ? "grid" : "hidden")}
                style={{gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`}}>
                {children}
            </div>
        </div>
    );
};

export default Collection;