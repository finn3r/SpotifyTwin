import React, {useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import useSpotify from "../../hooks/useSpotify";
import {useRecoilState} from "recoil";
import {titleAtom} from "../../Atoms/titleAtom";
import Spinner from "../../components/Spinner";
import Collection from "../../components/Collection";
import Cell from "../../components/Collection/Cell";

const Artists = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const [artists, setArtists] = useState<SpotifyApi.ArtistObjectFull[]>([]);
    const [status, setStatus] = useState("pending");

    const getArtists = async () => {
        let fetching = true;
        let after = "0";
        const artists: SpotifyApi.ArtistObjectFull[] = [];
        try {
            do {
                const newArtists = await spotifyApi.getFollowedArtists({
                    after,
                    limit: 50
                }).then(data => data.body.artists);
                artists.push(...newArtists.items);
                if (newArtists.next) {
                    after = newArtists.items[newArtists.items.length - 1].id;
                } else fetching = false;
            } while (fetching);
        } catch (e) {
            setStatus("error");
        }
        return artists
    };

    useEffect(() => {
        setTitle("Artists - Spotify tween");
    }, []);

    useEffect(() => {
        if (spotifyApi.getAccessToken() && (artists.length === 0)) {
            setStatus("pending");
            getArtists().then(artists => {
                setArtists(artists);
                setStatus("success");
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
                        ERROR: Artists not found.
                    </h1>
                </div>
            );
        default:
            return (
                <Collection>
                    {artists?.map((artist) => <Cell key={artist.id + "_cell"} collection={artist}/>)}
                </Collection>
            );
    }
};

export default Artists;