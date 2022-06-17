import React, {useEffect} from 'react';
import Collection from "../../components/Collection";
import {useSession} from "next-auth/react";
import useSpotify from "../../hooks/useSpotify";
import Cell from "../../components/Collection/Cell";

const Albums = () => {
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const [albums, setAlbums] = React.useState<SpotifyApi.SavedAlbumObject[]>();

    const getAlbums = async (offset: number, albums?: SpotifyApi.SavedAlbumObject[]) => {
        spotifyApi.getMySavedAlbums({offset: offset, limit: 50}).then((data) => {
            if (data.body.next) {
                const offset: number = Number(data.body.next.split("offset=")[1].split("&")[0]);
                getAlbums(offset, [...albums??[],...data.body.items]);
            } else{
                setAlbums([...albums??[],...data.body.items])
            }
        })
    };

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getAlbums(0).then();
        }
    }, [session, spotifyApi]);

    return (
        <Collection>
            {albums?.map((album) => <Cell key={album.album.id + "_cell"} collection={album.album}/>)}
        </Collection>
    );
};

export default Albums;