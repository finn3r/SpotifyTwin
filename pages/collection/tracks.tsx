import React, {useEffect, useState} from 'react';
import Songs from "../../components/Songs";
import useSpotify from "../../hooks/useSpotify";
import {useSession} from "next-auth/react";
import AudioPage from "../../components/AudioPage";
import {useRecoilState} from "recoil";
import {titleAtom} from "../../Atoms/titleAtom";

const Tracks = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const [tracks, setTracks] = useState<SpotifyApi.SavedTrackObject[]>();

    const getTracks = async () => {
        let fetching = true;
        let offset = 0;
        const tracks: SpotifyApi.SavedTrackObject[] = [];
        do {
            const newTracks = await spotifyApi.getMySavedTracks({offset, limit: 50}).then(data => data.body);
            tracks.push(...newTracks.items);
            if (newTracks.next) {
                offset = Number(newTracks.next.split("offset=")[1].split("&")[0]);
            } else fetching = false;
        } while (fetching);
        return tracks
    };

    useEffect(() => {
        setTitle("Saved tracks - Spotify tween");
    },[]);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getTracks().then(tracks => setTracks(tracks));
        }
    }, [session, spotifyApi]);

    return (
        <AudioPage error={false} type={"tracks"} info={{images: [{url:"https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"}], name: "Saved tracks"}}>
            <Songs playlist={tracks}/>
        </AudioPage>
    );
};

export default Tracks;