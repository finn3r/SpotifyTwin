import React, {useEffect, useState} from 'react';
import Vibrant from "node-vibrant";

interface AudioPageProps {
    info?: SpotifyApi.SingleAlbumResponse | SpotifyApi.SinglePlaylistResponse | SpotifyApi.SingleShowResponse | { images?: { url: string }[], name: string },
    error: boolean,
    type: string,
}

const AudioPage: React.FC<AudioPageProps> = ({children, info, error, type}) => {
    const [color, setColor] = useState<string>("");

    useEffect(() => {
        info?.images?.[0]?.url ?
            new Vibrant(info.images[0].url).getPalette()
                .then((palette) => setColor(palette.DarkVibrant!.hex))
            : (type !== "episodes") ? setColor("#121212") : setColor("rgb(0, 100, 80)");
    }, [info]);

    return (
        <div className={"h-screen overflow-y-scroll scrollbar-hide w-full relative bg-[#121212]"}>
            <div
                className={`absolute z-[2] z-10 w-full h-[50vh] ${(error) ? "hidden" : ""}`}
                style={{backgroundImage: `linear-gradient(to bottom, ${color}, #121212)`}}
            />
            {(error) ?
                <div className={"h-screen flex justify-center items-center"}>
                    <h1 className={"z-[5] text-white text-2xl md:text-3xl xl:text-5xl font-bold"}>
                        {type.slice(0, 1).toUpperCase() + type.slice(1).toLowerCase()} not found.
                    </h1>
                </div> :
                (info) ?
                    <section
                        className={`flex items-end space-x-7 h-80 text-white p-8`}
                    >
                        {info.images?.[0]?.url ? <img
                            src={info.images[0].url}
                            alt=""
                            className={"z-[5] object-cover h-44 w-44 shadow-2xl"}
                        /> : (type !== "episodes") ?
                            <div className={"z-[5] h-44 w-44 shadow-2xl bg-[#808080]"}>
                                <svg viewBox="-20 -25 100 100"
                                     className="mb-2 min-h-0 basis-[80%] bg-[#2a2a2a]" aria-hidden="true"
                                     data-testid="card-image-fallback">
                                    <path
                                        d="M16 7.494v28.362A8.986 8.986 0 0 0 9 32.5c-4.962 0-9 4.038-9 9s4.038 9 9 9 9-4.038 9-9V9.113l30-6.378v27.031a8.983 8.983 0 0 0-7-3.356c-4.962 0-9 4.038-9 9 0 4.963 4.038 9 9 9s9-4.037 9-9V.266L16 7.494zM9 48.5c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7c0 3.859-3.141 7-7 7zm32-6.09c-3.86 0-7-3.14-7-7 0-3.859 3.14-7 7-7s7 3.141 7 7c0 3.861-3.141 7-7 7z"
                                        fill="currentColor" fillRule="evenodd"/>
                                </svg>
                            </div> :
                            <div className={"z-[5] h-44 w-44 shadow-2xl bg-[#006450] flex justify-center"}>
                                <svg role="img" viewBox="0 0 527 483" fill="none"
                                     xmlns="http://www.w3.org/2000/svg" className="w-[50%]">
                                    <path
                                        d="M1.5 264.208C1.5 119.17 118.974 1.5 264 1.5C409.026 1.5 526.5 119.17 526.5 264.208C526.5 351.905 483.535 429.569 417.628 477.247C406.996 484.938 392.595 481.729 385.684 471.362L376.758 457.971C369.699 447.382 372.818 433.617 382.485 426.529C432.426 389.914 464.783 330.851 464.783 264.208C464.783 153.128 374.839 63.1707 264 63.1707C153.161 63.1707 63.2173 153.128 63.2173 264.208C63.2173 330.851 95.5742 389.914 145.515 426.529C155.182 433.617 158.301 447.382 151.242 457.971L142.316 471.362C135.405 481.729 121.004 484.938 110.372 477.247C44.4653 429.569 1.5 351.905 1.5 264.208Z"
                                        fill="#1ED760"/>
                                    <path
                                        d="M104.5 263.216C104.5 174.586 175.78 102.5 264 102.5C352.22 102.5 423.5 174.586 423.5 263.216C423.5 315.346 398.84 361.707 360.685 391.048C350.27 399.057 336.041 395.66 329.404 385.602L323.251 376.279C316.458 365.986 319.652 353.018 328.353 346.12C352.699 326.817 368.307 296.878 368.307 263.216C368.307 204.912 321.476 157.884 264 157.884C206.524 157.884 159.693 204.912 159.693 263.216C159.693 296.878 175.301 326.817 199.647 346.12C208.348 353.018 211.542 365.986 204.749 376.279L198.596 385.602C191.959 395.66 177.73 399.057 167.315 391.048C129.16 361.707 104.5 315.346 104.5 263.216Z"
                                        fill="#1ED760"/>
                                    <path
                                        d="M200.5 261C200.5 226.296 229.118 198.5 264 198.5C298.882 198.5 327.5 226.296 327.5 261C327.5 295.704 298.882 323.5 264 323.5C229.118 323.5 200.5 295.704 200.5 261Z"
                                        fill="#1ED760"/>
                                </svg>
                            </div>}
                        <div className={"z-[5]"}>
                            <p>{type.toUpperCase()}</p>
                            <h1 className={"text-2xl md:text-3xl xl:text-5xl font-bold"}>
                                {info.name}
                            </h1>
                        </div>
                    </section> : <div/>}
            {children}
        </div>
    );
};

export default AudioPage;