import React, {useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import useSpotify from "../../hooks/useSpotify";
import {useRecoilState} from "recoil";
import {titleAtom} from "../../Atoms/titleAtom";
import Spinner from "../../components/Spinner";
import Collection from "../../components/Collection";
import Cell from "../../components/Collection/Cell";

const Albums = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const [albums, setAlbums] = useState<SpotifyApi.SavedAlbumObject[]>([]);
    const [status, setStatus] = useState("pending");

    const getAlbums = async () => {
        let fetching = true;
        let offset = 0;
        const albums: SpotifyApi.SavedAlbumObject[] = [];
        try {
            do {
                const newAlbums = await spotifyApi.getMySavedAlbums({offset, limit: 50}).then(data => data.body);
                albums.push(...newAlbums.items);
                if (newAlbums.next) {
                    offset = Number(newAlbums.next.split("offset=")[1].split("&")[0]);
                } else fetching = false;
            } while (fetching);
        } catch (e) {
            setStatus("error");
        }
        return albums
    };

    useEffect(() => {
        setTitle("Albums - Spotify tween");
    }, []);

    useEffect(() => {
        if (spotifyApi.getAccessToken() && (albums.length === 0)) {
            setStatus("pending");
            getAlbums().then(albums => {
                setAlbums(albums);
                setStatus("success")
            });
        }
    }, [session, spotifyApi]);

    switch (status) {
        case "pending":
            return (<Spinner/>);
        case "error":
            return (
                <div className={"h-screen flex justify-center items-center"}>
                    <h1 className={"z-[5] text-white text-2xl md:text-3xl xl:text-5xl font-bold"}>
                        ERROR: Albums not found.
                    </h1>
                </div>
            );
        default:
            return (
                <Collection>
                    {albums.map((album) => <Cell key={album.album.id + "_cell"} collection={album.album}/>)}
                </Collection>
            );
    }
};

export default Albums;