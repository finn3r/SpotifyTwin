import React, {lazy, useEffect, useState, Suspense} from 'react';
import {NextPage} from "next";
import useSpotify from "../hooks/useSpotify";
import {uniqBy, shuffle} from "lodash";
import {useRecoilState} from "recoil";
import {titleAtom} from "../Atoms/titleAtom";
import Spinner from "../components/Spinner";

const Cell = lazy(() => import("../components/Collection/Cell"));
const ArtistAlbums = lazy(() => import("../components/ArtistAlbums"));

const Home: NextPage = () => {
    const [, setTitle] = useRecoilState(titleAtom);
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
    }, [spotifyApi.getAccessToken()]);


    return (
        <div className={"h-screen overflow-y-scroll scrollbar-hide w-full relative bg-[#121212]"}>
            <header className={"flex flex-row space-x-4 text-white text-xl md:text-2xl xl:text-3xl font-bold m-5"}>
                Good {(hours < 6) || (hours > 22) ? "night" : (hours > 6) || (hours < 12) ? "morning" : "day"}!
                <br/><br/>That's playlists for you:
            </header>
            <Suspense fallback={<Spinner/>}>
                <ArtistAlbums>
                    {playlists?.map((playlist) => <Cell key={playlist?.id + "_cell"} collection={playlist}/>)}
                </ArtistAlbums>
            </Suspense>
        </div>
    )
};

export default Home;