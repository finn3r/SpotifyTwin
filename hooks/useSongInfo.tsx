import React, {useEffect, useState} from 'react';
import useSpotify from "./useSpotify";
import {useRecoilState} from "recoil";
import {currentTrackIdState} from "../Atoms/songAtom";

const UseSongInfo = () => {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [songInfo, setSongInfo] = useState<any>(null);

    useEffect(() => {
        const fetchSongInfo = async () => {
            if(currentTrackId) {
                const trackInfo = await fetch(
                    `https://api.spotify.com/v1/tracks/${currentTrackId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
                        }
                    }).then(res => res.json());
                setSongInfo(trackInfo);
            }
        }
        fetchSongInfo().then();
    }, [currentTrackId, spotifyApi])

    return songInfo;
};

export default UseSongInfo;