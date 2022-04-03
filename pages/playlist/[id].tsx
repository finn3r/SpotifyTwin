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
                    /*data.body.images?.[0]?.url ?
                        new Vibrant(data.body.images[0].url).getPalette()
                            .then((palette) => setColor(palette.DarkVibrant!.hex))
                        : setColor("grey");*/
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
                        /> : <div className={"h-44 w-44 shadow-2xl bg-[#808080]"}/>}
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