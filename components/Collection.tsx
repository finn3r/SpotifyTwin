import React, {useEffect} from 'react';
import {useRouter} from "next/router";

const Collection: React.FC = ({children}) => {
    const router = useRouter();
    const path = router.route;
    const cellMinWidth: number = 250;
    const [columnCount, setColumnCount] = React.useState<number>(0);
    const widthHandler = () => {
        (columnCount !== Math.round(window.innerWidth / cellMinWidth)) ? setColumnCount(Math.round(window.innerWidth / cellMinWidth)) : null
    };

    useEffect(() => {
        window.addEventListener("resize", widthHandler);
        setColumnCount(Math.round(window.innerWidth / cellMinWidth));
        return () => {
            window.removeEventListener("resize", widthHandler);
        }
    }, []);
    return (
        <div className={"w-full h-screen bg-[#121212]"}>
            <header className={"flex flex-row space-x-4 text-white text-xl md:text-2xl xl:text-3xl font-bold m-5"}>
                <p className={`rounded-xl p-2 hover:cursor-pointer ${(path.includes("playlists")) ? "bg-[#2a2a2a]" : ""}`}
                   onClick={() => router.push("/collection/playlists")}>Playlists</p>
                <p className={`rounded-xl p-2 hover:cursor-pointer ${(path.includes("podcasts")) ? "bg-[#2a2a2a]" : ""}`}
                   onClick={() => router.push("/collection/podcasts")}>Podcasts</p>
                <p className={`rounded-xl p-2 hover:cursor-pointer ${(path.includes("artists")) ? "bg-[#2a2a2a]" : ""}`}
                   onClick={() => router.push("/collection/artists")}>Artists</p>
                <p className={`rounded-xl p-2 hover:cursor-pointer ${(path.includes("albums")) ? "bg-[#2a2a2a]" : ""}`}
                   onClick={() => router.push("/collection/albums")}>Albums</p>
            </header>
            <div
                className={"grid-flow-row h-[85vh] scrollbar-hide overflow-y-scroll auto-rows-min " + (columnCount !== 0 ? "grid" : "hidden")}
                style={{gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`}}>
                {children}
            </div>
        </div>
    );
};

export default Collection;