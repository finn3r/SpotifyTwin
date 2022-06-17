import React from 'react';
import {millisToMinutesAndSeconds} from "../../lib/time";
import {useRecoilValue} from "recoil";
import useSpotify from "../../hooks/useSpotify";
import {deviceAtom} from "../../Atoms/deviceAtom";
import {currentTrackState, isPlayingState} from "../../Atoms/songAtom";

const Song = (props: { track: SpotifyApi.TrackObjectFull , order: number, playlistUri: string }) => {
    const spotifyApi = useSpotify();
    const device = useRecoilValue(deviceAtom);
    const currentTrack = useRecoilValue(currentTrackState);
    const isPlaying = useRecoilValue(isPlayingState);

    const playSong = () => {
        if (device!=="") spotifyApi.play({
            device_id: device,
            context_uri: props.playlistUri,
            offset: {
                uri: props.track.uri
            }
        }).then();
    }

    return (
        <div
            className={"grid grid-cols-2 text-gray-500 py-4 px-4 hover:bg-gray-900 hover:bg-opacity-60 rounded-lg cursor-pointer z-[5]"}
            onClick={playSong}
        >
            <div className={"flex items-center space-x-4"}>
                <div
                    className={"h-6 w-4 " + (currentTrack?.id === props.track.id ? "text-green-600" : "")}
                >
                    {((currentTrack?.id === props.track.id)&&isPlaying) ?
                        <img loading={"lazy"} src={"https://open.scdn.co/cdn/images/equaliser-animated-green.f93a2ef4.gif"} alt={""}/>
                        :
                        (props.order + 1)
                    }
                </div>
                {(props.track.album?.images?.[0]) ? <img
                    className={"h-10 w-10"}
                    src={props.track.album.images[0].url}
                    alt={""}
                /> : null}
                <div className={"min-w-0"}>
                    <p
                        className={"truncate mr-4 " + (currentTrack?.id === props.track.id ? "text-green-600" : "text-white")}
                    >
                        {props.track.name}
                    </p>
                    <p className={"truncate mr-4"}>{props.track.artists?.[0]?.name}</p>
                </div>
            </div>
            <div className={"flex items-center justify-end ml-0 sm:justify-between min-w-0"}>
                <p className={"hidden sm:inline truncate mr-4"}>{props.track?.album?.name}</p>
                <p>{millisToMinutesAndSeconds(props.track.duration_ms)}</p>
            </div>
        </div>
    );
};

export default Song;