import React from 'react';
import PlaylistTrackObject = SpotifyApi.PlaylistTrackObject;
import {millisToMinutesAndSeconds} from "../lib/time";
import {useRecoilState} from "recoil";
import {currentTrackIdState, isPlayingState} from "../Atoms/songAtom";
import useSpotify from "../hooks/useSpotify";

const Song = (prop: { track: PlaylistTrackObject, order: number }) => {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    const playSong = () => {
        setCurrentTrackId(prop.track.track.id);
        setIsPlaying(true);
        spotifyApi.play({
            uris: [prop.track.track.uri]
        }).then();
    }

    return (
        <div
            className={"grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer"}
            onClick={playSong}
        >
            <div className={"flex items-center space-x-4"}>
                <p>{prop.order + 1}</p>
                <img
                    className={"h-10 w-10"}
                    src={prop.track.track.album.images[0].url}
                    alt=""
                />
                <div>
                    <p className={"w-36 lg:w-64 text-white truncate"}>{prop.track.track.name}</p>
                    <p className={"w-40"}>{prop.track.track.artists[0].name}</p>
                </div>
            </div>
            <div className={"flex items-center justify-end ml-0 sm:justify-between"}>
                <p className={"w-40 hidden sm:inline"}>{prop.track.track.album.name}</p>
                <p>{millisToMinutesAndSeconds(prop.track.track.duration_ms)}</p>
            </div>
        </div>
    );
};

export default Song;