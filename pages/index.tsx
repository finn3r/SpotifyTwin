import React, {useEffect, useState} from 'react';
import {NextPage} from "next";
import useSpotify from "../hooks/useSpotify";
import Cell from "../components/Collection/Cell";
import ArtistAlbums from "../components/ArtistAlbums";
import {uniqBy, shuffle} from "lodash";
import {useSession} from "next-auth/react";
import {useRecoilState} from "recoil";
import {titleAtom} from "../Atoms/titleAtom";

const Home: NextPage = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const hours = (new Date).getHours();
    const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);

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
        } catch (e) {
            console.log((e as Error).message);
        }
    }

    useEffect(() => {
        setTitle("Spotify tween");
    }, []);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getPlaylistsCategories().then();
        }
    }, [session, spotifyApi]);


    return (
        <div className={"h-screen overflow-y-scroll scrollbar-hide w-full relative bg-[#121212]"}>
            <header className={"flex flex-row space-x-4 text-white text-xl md:text-2xl xl:text-3xl font-bold m-5"}>
                Good {(hours < 6) || (hours > 22) ? "night" : (hours > 6) || (hours < 12) ? "morning" : "day"}!
                <br/><br/>That's playlists for you:
            </header>
            <ArtistAlbums>
                {playlists?.map((playlist) => <Cell key={playlist?.id + "_cell"} collection={playlist}/>)}
            </ArtistAlbums>
        </div>
    )
};

export default Home;