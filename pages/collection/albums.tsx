import React, {lazy, useEffect, Suspense} from 'react';
import {useSession} from "next-auth/react";
import useSpotify from "../../hooks/useSpotify";
import {useRecoilState} from "recoil";
import {titleAtom} from "../../Atoms/titleAtom";
import Spinner from "../../components/Spinner";

const Cell = lazy(() => import("../../components/Collection/Cell"));
const Collection = lazy(() => import("../../components/Collection"));

const Albums = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const [albums, setAlbums] = React.useState<SpotifyApi.SavedAlbumObject[]>();

    const getAlbums = async () => {
        let fetching = true;
        let offset = 0;
        const albums: SpotifyApi.SavedAlbumObject[] = [];
        do {
            const newAlbums = await spotifyApi.getMySavedAlbums({offset, limit: 50}).then(data => data.body);
            albums.push(...newAlbums.items);
            if (newAlbums.next) {
                offset = Number(newAlbums.next.split("offset=")[1].split("&")[0]);
            } else fetching = false;
        } while (fetching);
        return albums
    };

    useEffect(() => {
        setTitle("Albums - Spotify tween");
    }, []);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getAlbums().then(albums => setAlbums(albums));
        }
    }, [session, spotifyApi.getAccessToken()]);

    return (
        <Suspense fallback={<Spinner/>}>
            <Collection>
                {albums?.map((album) => <Cell key={album.album.id + "_cell"} collection={album.album}/>)}
            </Collection>
        </Suspense>
    );
};

export default Albums;