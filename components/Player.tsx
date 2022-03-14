import React, {useEffect, useState} from 'react';
import useSpotify from "../hooks/useSpotify";
import {useRecoilState, useRecoilValue} from "recoil";
import {currentTrackState, isPlayingState} from "../Atoms/songAtom";
import {useSession} from "next-auth/react";
import useSongInfo from "../hooks/useSongInfo";
import {
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    RewindIcon,
    SwitchHorizontalIcon
} from "@heroicons/react/solid";
import {VolumeUpIcon, VolumeOffIcon} from "@heroicons/react/outline";
import {deviceAtom} from "../Atoms/deviceAtom";
import {playlistState} from "../Atoms/platlistAtom";

const Player = () => {
    const spotifyApi = useSpotify();
    const {data: session} = useSession();
    const [playlist, setPlaylist] = useRecoilState(playlistState);
    const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [player, setPlayer] = useState<Spotify.Player>();
    const [device, setDevice] = useRecoilState(deviceAtom);
    const [volume, setVolume] = useState(50);
    const [volumeOff, setVolumeOff] = useState(false);

    const volumeOffHandler = () => {
        setVolumeOff(!volumeOff);
        (!volumeOff) ? player?.setVolume(0) : player?.setVolume(volume/100);
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Finner-spotify',
                getOAuthToken: cb => {
                    cb(session?.user.accessToken!);
                },
                volume: 0.5,
            });
            setPlayer(player);
            player.addListener('ready', ({device_id}) => {
                setDevice(device_id);
                console.log('Ready with Device ID', device_id);
                spotifyApi.getMyRecentlyPlayedTracks().then((data) => {
                    spotifyApi.play({
                        device_id: device_id,
                        context_uri: data.body.items[0].context.uri,
                        offset: {
                            uri: data.body.items[0].track.uri
                        }
                    }).then(() => {
                        setIsPlaying(false);
                    });
                });
            });
            player.addListener('not_ready', ({device_id}) => {
                setDevice("");
                console.log('Device ID has gone offline', device_id);
            });
            player.addListener('player_state_changed', (props) => {
                setCurrentTrack(props?.track_window?.current_track);
                setIsPlaying(!props?.paused);
            })
            player.connect().then();
        };
    }, []);

    return (
        <div
            className={"h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8"}
        >
            {/*Left*/}
            {(currentTrack) ?
                <div className={"flex items-center space-x-4"}>
                    <img className={"hidden md:inline h-10 w-10"} src={currentTrack.album.images?.[0]?.url} alt=""/>
                    <div>
                        <h3>{currentTrack.name}</h3>
                        <p>{currentTrack.artists?.[0]?.name}</p>
                    </div>
                </div>
                : <div/>}
            {/*Center*/}
            <div className={"flex items-center justify-evenly"}>
                <SwitchHorizontalIcon className={"button"}/>
                <RewindIcon onClick={() => spotifyApi.skipToPrevious({device_id: device})} className={"button"}/>
                {isPlaying ?
                    <PauseIcon onClick={() => player?.pause()} className={"button w-10 h-10"}/>
                    :
                    <PlayIcon onClick={() => player?.resume()} className={"button w-10 h-10"}/>
                }
                <FastForwardIcon onClick={() => spotifyApi.skipToNext({device_id: device})}
                                 className={"button"}/>
                <ReplyIcon className={"button"}/>
            </div>
            {/*Right*/}
            <div className={"flex items-center space-x-3 md:space-x-4 justify-end pr-5"}>
                {volumeOff || volume === 0 ?
                    <VolumeOffIcon className={"button"} onClick={volumeOffHandler}/>
                    :
                    <VolumeUpIcon className={"button"} onClick={volumeOffHandler}/>
                }
                <input
                    className={"w-14 md:w-28"}
                    type="range"
                    value={volumeOff ? 0 : volume}
                    min={0} max={100}
                    onChange={(e) => {
                        setVolume(Number(e.target.value));
                        player?.setVolume(Number(e.target.value)/100);
                    }}
                />
            </div>
        </div>
    );
};

export default Player;