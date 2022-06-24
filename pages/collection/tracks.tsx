import React, {lazy, Suspense, useEffect, useState} from 'react';
import useSpotify from "../../hooks/useSpotify";
import {useSession} from "next-auth/react";
import {useRecoilState} from "recoil";
import {titleAtom} from "../../Atoms/titleAtom";
import Spinner from "../../components/Spinner";

const AudioPage = lazy(() => import("../../components/AudioPage"));
const Songs = lazy(() => import("../../components/Songs"));

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
    }, []);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getTracks().then(tracks => setTracks(tracks));
        }
    }, [session, spotifyApi.getAccessToken()]);

    return (
        <Suspense fallback={<Spinner/>}>
            <AudioPage error={false} type={"tracks"} info={{
                images: [{url: "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"}],
                name: "Saved tracks"
            }}>
                <Songs playlist={tracks}/>
            </AudioPage>
        </Suspense>
    );
};

export default Tracks;