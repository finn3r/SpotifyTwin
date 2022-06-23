import React, {useEffect} from 'react';
import Collection from "../../components/Collection";
import {useSession} from "next-auth/react";
import useSpotify from "../../hooks/useSpotify";
import Cell from "../../components/Collection/Cell";
import {useRecoilState} from "recoil";
import {titleAtom} from "../../Atoms/titleAtom";

const Artists = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const [artists, setArtists] = React.useState<SpotifyApi.ArtistObjectFull[]>();

    const getArtists = async () => {
        let fetching = true;
        let after = "0";
        const artists: SpotifyApi.ArtistObjectFull[] = [];
        do {
            const newArtists = await spotifyApi.getFollowedArtists({after, limit: 50}).then(data => data.body.artists);
            artists.push(...newArtists.items);
            if (newArtists.next) {
                after = newArtists.items[newArtists.items.length-1].id;
            } else fetching = false;
        } while (fetching);
        return artists
    };

    useEffect(() => {
        setTitle("Artists - Spotify tween");
    },[]);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getArtists().then(artists => setArtists(artists));
        }
    }, [session, spotifyApi]);

    return (
        <Collection>
            {artists?.map((artist) => <Cell key={artist.id + "_cell"} collection={artist}/>)}
        </Collection>
    );
};

export default Artists;