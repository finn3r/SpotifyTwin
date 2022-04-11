import React, {useEffect} from 'react';
import Collection from "../../components/Collection";
import {useSession} from "next-auth/react";
import useSpotify from "../../hooks/useSpotify";
import CollectionCell from "../../components/CollectionCell";

const Artists = () => {
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const [artists, setArtists] = React.useState<SpotifyApi.ArtistObjectFull[]>();

    const getArtists = async (after?: string, artists?: SpotifyApi.ArtistObjectFull[]) => {
        spotifyApi.getFollowedArtists({after:after, limit: 1}).then((data) => {
            if (data.body.artists.next) {
                const after: string = data.body.artists.items[data.body.artists.items.length-1].id;
                getArtists(after, [...artists??[],...data.body.artists.items]);
            } else{
                setArtists([...artists??[],...data.body.artists.items])
            }
        })
    };

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getArtists().then();
        }
    }, [session, spotifyApi]);

    return (
        <Collection>
            {artists?.map((artist) => <CollectionCell key={artist.id + "_cell"} collection={artist}/>)}
        </Collection>
    );
};

export default Artists;