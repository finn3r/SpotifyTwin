import React, {useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import {ChevronDownIcon} from "@heroicons/react/outline";
import {useRecoilState, useRecoilValue} from "recoil";
import {playlistState, playlistIdState} from "../Atoms/platlistAtom";
import useSpotify from "../hooks/useSpotify";
import Vibrant from 'node-vibrant';
import Songs from "./Songs";

const Center = () => {
    const spotifyApi = useSpotify();
    const {data: session} = useSession();
    const [color, setColor] = useState<string>("rgb(104, 32, 47)");
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);

    useEffect(() => {
        spotifyApi
            .getPlaylist(playlistId)
            .then((data) => {
                setPlaylist(data.body);
                new Vibrant(data.body.images[0].url).getPalette()
                    .then((palette) => setColor(palette.DarkVibrant!.hex));
            })
    }, [spotifyApi, playlistId])
    return (
        <div className={"flex-grow h-screen overflow-y-scroll scrollbar-hide"}>
            <header className={"absolute top-5 right-8"}>
                <div
                    className={"flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white"}>
                    <img
                        className={"rounded-full w-10 h-10"}
                        src={session?.user.image}
                        alt=""
                    />
                    <h2>{session?.user.name}</h2>
                    <ChevronDownIcon className={"h-5 w-5"}/>
                </div>
            </header>
            {(playlist) ? <section
                className={`flex items-end space-x-7 h-80 text-white p-8`}
                style={{backgroundImage: `linear-gradient(to bottom, ${color}, #000)`}}
            >
                <img
                    src={playlist?.images?.[0].url}
                    alt=""
                    className={"object-cover h-44 w-44 shadow-2xl"}
                />
                <div>
                    <p>PLAYLIST</p>
                    <h1 className={"text-2xl md:text-3xl xl:text-5xl font-bold"}>
                        {playlist?.name}
                    </h1>
                </div>
            </section> : null}
            <div>
                <Songs/>
            </div>
        </div>
    );
};

export default Center;