import React, {useEffect, useState} from 'react';
import useSpotify from "../../hooks/useSpotify";
import {useSession} from "next-auth/react";
import {useRecoilState} from "recoil";
import {titleAtom} from "../../Atoms/titleAtom";
import Spinner from "../../components/Spinner";
import AudioPage from "../../components/AudioPage";
import Songs from "../../components/Songs";

const Tracks = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const [tracks, setTracks] = useState<SpotifyApi.SavedTrackObject[]>([]);
    const [status, setStatus] = useState("pending");

    const getTracks = async () => {
        let fetching = true;
        let offset = 0;
        const tracks: SpotifyApi.SavedTrackObject[] = [];
        try{
            do {
                const newTracks = await spotifyApi.getMySavedTracks({offset, limit: 50}).then(data => data.body);
                tracks.push(...newTracks.items);
                if (newTracks.next) {
                    offset = Number(newTracks.next.split("offset=")[1].split("&")[0]);
                } else fetching = false;
            } while (fetching);
        } catch (e) {
            setStatus("error");
        }
        return tracks
    };

    useEffect(() => {
        setTitle("Saved tracks - Spotify tween");
    }, []);

    useEffect(() => {
        if (spotifyApi.getAccessToken()&&tracks.length===0) {
            setStatus("pending");
            getTracks().then(tracks => {
                setTracks(tracks);
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
                        ERROR: Tracks not found.
                    </h1>
                </div>
            );
        default:
            return (
                <AudioPage error={false} type={"tracks"} info={{
                    images: [{url: "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"}],
                    name: "Saved tracks"
                }}>
                    <Songs playlist={tracks}/>
                </AudioPage>
            );
    }
};

export default Tracks;