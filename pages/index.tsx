import React, {useEffect, useState} from 'react';
import {NextPage} from "next";
import useSpotify from "../hooks/useSpotify";
import {uniqBy, shuffle} from "lodash";
import {useRecoilState} from "recoil";
import {titleAtom} from "../Atoms/titleAtom";
import Spinner from "../components/Spinner";
import ArtistAlbums from "../components/ArtistAlbums";
import Cell from "../components/Collection/Cell";
import {useSession} from "next-auth/react";

const Home: NextPage = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const spotifyApi = useSpotify();
    const hours = (new Date).getHours();
    const {data: session} = useSession();
    const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);
    const [status, setStatus] = useState("pending");

    const getPlaylistsCategories = async () => {
        try {
            const locale = await spotifyApi.getMe().then(data => data.body.country);
            const categories = await spotifyApi.getCategories({
                locale,
                limit: 10,
                offset: (Math.floor(Math.random() * (50)))
            }).then(data => data.body.categories.items);
            const playlistsPromises = categories.map(category => spotifyApi.getPlaylistsForCategory(category.id, {
                limit: 10,
                offset: (Math.floor(Math.random() * (50))),
                country: locale
            }).then(data => data.body.playlists.items, () => []));
            const playlists = (await Promise.all(playlistsPromises)).flat();
            setPlaylists(shuffle(uniqBy(playlists, "id")));
            setStatus("success");
        } catch (e) {
            setStatus("error");
        }
    }

    useEffect(() => {
        setTitle("Spotify tween");
    }, []);

    useEffect(() => {
        if (spotifyApi.getAccessToken() && playlists.length === 0) {
            setStatus("pending");
            getPlaylistsCategories().then();
        }
    }, [spotifyApi, session]);

    switch (status) {
        case "pending":
            return (<Spinner/>);
        case "error":
            return (
                <div className={"h-screen flex justify-center items-center"}>
                    <h1 className={"z-[5] text-white text-2xl md:text-3xl xl:text-5xl font-bold"}>
                        ERROR: Home page not found.
                    </h1>
                </div>
            );
        default:
            return (
                <div className={"h-screen overflow-y-scroll scrollbar-hide w-full relative bg-[#121212]"}>
                    <header className={"flex flex-row space-x-4 text-white text-xl md:text-2xl xl:text-3xl font-bold m-5 pt-1"}>
                        Good {(hours < 6) || (hours > 22) ? "night" : (hours > 6) || (hours < 12) ? "day" : "morning"}!
                        <br/><br/>That's playlists for you:
                    </header>
                    <ArtistAlbums>
                        {playlists?.map((playlist) => <Cell key={playlist?.id + "_cell"} collection={playlist}/>)}
                    </ArtistAlbums>
                </div>
            );
    }
};

export default Home;