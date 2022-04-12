import React, {useEffect} from 'react';

const ArtistAlbums: React.FC = ({children}) => {
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