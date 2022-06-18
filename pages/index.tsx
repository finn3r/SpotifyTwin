import React, {useEffect, useState} from 'react';
import {NextPage} from "next";
import useSpotify from "../hooks/useSpotify";
import Cell from "../components/Collection/Cell";
import ArtistAlbums from "../components/ArtistAlbums";
import {uniqBy, shuffle} from "lodash";

const Home: NextPage = () => {
    const spotifyApi = useSpotify();
    const hours = (new Date).getHours();
    const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);

    const getPlaylistsCategories = async (locale: string) => {
        const categories = await spotifyApi.getCategories({
            locale,
            limit: 10
        }).then(data => data.body.categories.items);
        const allPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];
        for (const category of categories) {
            const playlistsCategories: SpotifyApi.PlaylistObjectSimplified[] | void = await spotifyApi.getPlaylistsForCategory(category.id, {
                limit: 10,
                offset: 0,
                country: locale
            }).then(data => data.body.playlists.items).catch(() => {
            });
            if (playlistsCategories) allPlaylists.push(...playlistsCategories);
        }
        const playlists = shuffle(uniqBy(allPlaylists, "id"));
        setPlaylists(playlists);
    };

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getMe().then(data => getPlaylistsCategories(data.body.country));
        }
    }, [spotifyApi]);

    return (
        <div className={"h-screen overflow-y-scroll scrollbar-hide w-full relative bg-[#121212]"}>
            <header className={"flex flex-row space-x-4 text-white text-xl md:text-2xl xl:text-3xl font-bold m-5"}>
                Good {(hours < 6)||(hours > 22) ? "night" : (hours > 6)||(hours < 12) ? "morning" : "day"}!
                <br/><br/>That's playlists for you:
            </header>
            <ArtistAlbums>
                {playlists?.map((playlist) => <Cell key={playlist?.id + "_cell"} collection={playlist}/>)}
            </ArtistAlbums>
        </div>
    )
};

export default Home;