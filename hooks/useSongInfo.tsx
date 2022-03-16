import React, {useEffect, useState} from 'react';
import useSpotify from "./useSpotify";
import {useRecoilValue} from "recoil";
import {currentTrackState} from "../Atoms/songAtom";

const UseSongInfo = () => {
    const spotifyApi = useSpotify();
    const currentTrack = useRecoilValue(currentTrackState);
    const [songInfo, setSongInfo] = useState<SpotifyApi.SingleTrackResponse>();

    useEffect(() => {
        const fetchSongInfo = async () => {
            if(currentTrack) {
                const trackInfo = await fetch(
                    `https://api.spotify.com/v1/tracks/${currentTrack.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
                        }
                    }).then(res => res.json());
                setSongInfo(trackInfo);
            }
        }
        fetchSongInfo().then();
    }, [currentTrack, spotifyApi])

    return songInfo;
};

export default UseSongInfo;