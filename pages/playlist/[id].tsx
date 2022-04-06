import React, {useEffect, useState} from 'react';
import useSpotify from "../../hooks/useSpotify";
import Vibrant from 'node-vibrant';
import Songs from "../../components/Songs";
import {GetServerSideProps, NextPage} from "next";
import {useRouter} from "next/router";
import {getSession} from "next-auth/react";

const Playlist: NextPage = () => {
    const spotifyApi = useSpotify();
    const router = useRouter();
    const [color, setColor] = useState<string>("");
    const [playlist, setPlaylist] = useState<{ id: string, info: undefined | SpotifyApi.SinglePlaylistResponse, error: boolean }>({
        id: "",
        info: undefined,
        error: false

    });
    useEffect(() => {
        const {id} = router.query;
        setPlaylist({
            ...playlist,
            error: false
        });
        if ((typeof id === "string") && (id != playlist.id)) {
            spotifyApi
                .getPlaylist(id)
                .then((data) => {
                    setPlaylist({
                        ...playlist,
                        info: data.body,
                        id: id
                    });
                    data.body.images?.[0]?.url ?
                        new Vibrant(data.body.images[0].url).getPalette()
                            .then((palette) => setColor(palette.DarkVibrant!.hex))
                        : setColor("grey");
                })
                .catch(error => {
                    console.log(error);
                    setPlaylist({
                        ...playlist,
                        error: true
                    });
                })
        }
    }, [router])
    return (
        <div className={"flex-grow h-screen overflow-y-scroll scrollbar-hide w-full"}>
            {(playlist.error) ?
                <div className={"h-screen flex justify-center items-center"}>
                    <h1 className={"text-white text-2xl md:text-3xl xl:text-5xl font-bold"}>
                        Playlist not found.
                    </h1>
                </div> :
                (playlist.info) ?
                    <section
                        className={`flex items-end space-x-7 h-80 text-white p-8`}
                        style={{backgroundImage: `linear-gradient(to bottom, ${color}, #000)`}}
                    >
                        {playlist.info.images?.[0]?.url ? <img
                            src={playlist.info.images[0].url}
                            alt=""
                            className={"object-cover h-44 w-44 shadow-2xl"}
                        /> : <div className={"h-44 w-44 shadow-2xl bg-[#808080]"}>
                            <svg viewBox="-20 -25 100 100"
                                 className="mb-2 min-h-0 basis-[80%] bg-[#2a2a2a]" aria-hidden="true"
                                 data-testid="card-image-fallback">
                                <path
                                    d="M16 7.494v28.362A8.986 8.986 0 0 0 9 32.5c-4.962 0-9 4.038-9 9s4.038 9 9 9 9-4.038 9-9V9.113l30-6.378v27.031a8.983 8.983 0 0 0-7-3.356c-4.962 0-9 4.038-9 9 0 4.963 4.038 9 9 9s9-4.037 9-9V.266L16 7.494zM9 48.5c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7c0 3.859-3.141 7-7 7zm32-6.09c-3.86 0-7-3.14-7-7 0-3.859 3.14-7 7-7s7 3.141 7 7c0 3.861-3.141 7-7 7z"
                                    fill="currentColor" fillRule="evenodd"/>
                            </svg>
                        </div>}
                        <div>
                            <p>PLAYLIST</p>
                            <h1 className={"text-2xl md:text-3xl xl:text-5xl font-bold"}>
                                {playlist.info.name}
                            </h1>
                        </div>
                    </section> : <div/>}
            <div>
                <Songs playlist={playlist.info}/>
            </div>
        </div>
    );
};

export default Playlist;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    return {
        props: {
            session
        }
    }
}