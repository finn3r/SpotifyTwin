import React from 'react';
import {millisToMinutesAndSeconds} from "../../lib/time";
import {useRecoilValue} from "recoil";
import useSpotify from "../../hooks/useSpotify";
import {playerAtom} from "../../Atoms/playerAtom";
import {currentTrackState, isPlayingState} from "../../Atoms/songAtom";
import {deviceAtom} from "../../Atoms/deviceAtom";

const Song = (props: { track: SpotifyApi.TrackObjectFull, order: number, playlistUri: string, uris: string[], isFetching:boolean, setIsFetching: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const spotifyApi = useSpotify();
    const player = useRecoilValue(playerAtom);
    const device = useRecoilValue(deviceAtom);
    const currentTrack = useRecoilValue(currentTrackState);
    const isPlaying = useRecoilValue(isPlayingState);

    const handleClick = () => {
        if ((player) && (device) && (!props.isFetching)) {
            props.setIsFetching(true);
            if ((isPlaying) && (currentTrack?.id === props.track.id)) {
                player.pause().finally(() => {
                    props.setIsFetching(false);
                }).catch(e => console.log(e));
            } else if (currentTrack?.id === props.track.id) {
                player.resume().finally(() => {
                    props.setIsFetching(false);
                }).catch(e => console.log(e));
            } else {
                spotifyApi.play({
                    device_id: device,
                    context_uri: props.playlistUri ? props.playlistUri : undefined,
                    uris: props.playlistUri ? undefined : props.uris,
                    offset: (props.playlistUri) ? {
                        uri: props.track.uri
                    } : {
                        position: props.order
                    }
                }).finally(() => {
                    props.setIsFetching(false);
                }).catch(e => console.log(e));
            }
        }
    }

    return (
        <div
            className={"grid sm:grid-cols-2 grid-cols-[5fr_1fr] text-gray-500 py-4 px-4 hover:bg-gray-900 hover:bg-opacity-60 rounded-lg cursor-pointer z-[5]"}
            onClick={handleClick}
        >
            <div className={"flex items-center space-x-4"}>
                <div
                    className={"h-6 w-4 " + (currentTrack?.id === props.track.id ? "text-green-600" : "")}
                >
                    {((currentTrack?.id === props.track.id) && isPlaying) ?
                        <img loading={"lazy"}
                             src={"https://open.scdn.co/cdn/images/equaliser-animated-green.f93a2ef4.gif"} alt={""}/>
                        :
                        (props.order + 1)
                    }
                </div>
                {(props.track.album?.images?.[0]) ? <img
                    className={"h-10 w-10 hidden xsm:block"}
                    src={props.track.album.images[0].url}
                    alt={""}
                /> : null}
                <div className={"min-w-0"}>
                    <p
                        className={"line-clamp-1 " + (currentTrack?.id === props.track.id ? "text-green-600" : "text-white")}
                    >
                        {props.track.name}
                    </p>
                    <p className={"line-clamp-1"}>{props.track.artists?.[0]?.name}</p>
                </div>
            </div>
            <div className={"flex items-center justify-end ml-0 sm:justify-between min-w-0"}>
                <span className={"hidden sm:inline truncate mr-4"}>{props.track?.album?.name}</span>
                <span>{millisToMinutesAndSeconds(props.track.duration_ms)}</span>
            </div>
        </div>
    );
};

export default Song;