import React, {useEffect, useState} from 'react';
import Songs from "../../components/Songs";
import useSpotify from "../../hooks/useSpotify";
import {useSession} from "next-auth/react";
import AudioPage from "../../components/AudioPage";

const Tracks = () => {
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const [tracks, setTracks] = useState<SpotifyApi.SavedTrackObject[]>();

    const getTracks = async (offset: number, tracks?: SpotifyApi.SavedTrackObject[]) => {
        spotifyApi.getMySavedTracks({offset: offset, limit: 50}).then((data) => {
            if (data.body.next) {
                const offset: number = Number(data.body.next.split("offset=")[1].split("&")[0]);
                getTracks(offset, [...tracks ?? [], ...data.body.items]);
            } else {
                setTracks([...tracks ?? [], ...data.body.items])
            }
        })
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getTracks(0).then();
        }
    }, [session, spotifyApi]);

    return (
        <AudioPage error={false} type={"tracks"} info={{images: [{url:"https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"}], name: "Saved tracks"}}>
            <Songs playlist={tracks}/>
        </AudioPage>
    );
};

export default Tracks;