import React, {useEffect} from 'react';
import Collection from "../../components/Collection";
import {useSession} from "next-auth/react";
import useSpotify from "../../hooks/useSpotify";
import Cell from "../../components/Collection/Cell";
import {useRecoilState} from "recoil";
import {titleAtom} from "../../Atoms/titleAtom";

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
    },[]);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getAlbums().then(albums => setAlbums(albums));
        }
    }, [session, spotifyApi]);

    return (
        <Collection>
            {albums?.map((album) => <Cell key={album.album.id + "_cell"} collection={album.album}/>)}
        </Collection>
    );
};

export default Albums;