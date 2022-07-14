import React, {useEffect, useState} from 'react';

const ArtistAlbums: React.FC = ({children}) => {
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
        <div className={"w-full h-screen bg-[#121212] pb-36"}>
            <div
                className={"grid-flow-row h-full auto-rows-min " + (columnCount !== 0 ? "grid" : "hidden")}
                style={{gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`}}>
                {children}
            </div>
        </div>
    );
};

export default ArtistAlbums;