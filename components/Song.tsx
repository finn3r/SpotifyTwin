import React from 'react';
import PlaylistTrackObject = SpotifyApi.PlaylistTrackObject;
import SavedTrackObject = SpotifyApi.SavedTrackObject;
import {millisToMinutesAndSeconds} from "../lib/time";
import {useRecoilValue} from "recoil";
import useSpotify from "../hooks/useSpotify";
import {deviceAtom} from "../Atoms/deviceAtom";
import {currentTrackState, isPlayingState} from "../Atoms/songAtom";

const Song = (prop: { track: PlaylistTrackObject|SavedTrackObject, order: number, playlistUri: string }) => {
    const spotifyApi = useSpotify();
    const device = useRecoilValue(deviceAtom);
    const currentTrack = useRecoilValue(currentTrackState);
    const isPlaying = useRecoilValue(isPlayingState);

    const playSong = () => {
        if (device!=="") spotifyApi.play({
            device_id: device,
            context_uri: prop.playlistUri,
            offset: {
                uri: prop.track.track.uri
            }
        }).then();
    }

    return (
        <div
            className={"grid grid-cols-2 text-gray-500 py-4 px-4 hover:bg-gray-900 rounded-lg cursor-pointer"}
            onClick={playSong}
        >
            <div className={"flex items-center space-x-4"}>
                <div
                    className={"h-6 w-4 " + (currentTrack?.id === prop.track.track.id ? "text-green-600" : "")}
                >
                    {((currentTrack?.id === prop.track.track.id)&&isPlaying) ?
                        <img src={"https://open.scdn.co/cdn/images/equaliser-animated-green.f93a2ef4.gif"}/>
                        :
                        (prop.order + 1)
                    }
                </div>
                <img
                    className={"h-10 w-10"}
                    src={prop.track.track.album.images[0].url}
                />
                <div className={"min-w-0"}>
                    <p
                        className={"truncate mr-4 " + (currentTrack?.id === prop.track.track.id ? "text-green-600" : "text-white")}
                    >
                        {prop.track.track.name}
                    </p>
                    <p className={"truncate mr-4"}>{prop.track.track.artists[0].name}</p>
                </div>
            </div>
            <div className={"flex items-center justify-end ml-0 sm:justify-between min-w-0"}>
                <p className={"hidden sm:inline truncate mr-4"}>{prop.track.track.album.name}</p>
                <p>{millisToMinutesAndSeconds(prop.track.track.duration_ms)}</p>
            </div>
        </div>
    );
};

export default Song;