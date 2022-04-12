import React, {useEffect, useState} from 'react';
import useSpotify from "../hooks/useSpotify";
import {useRecoilState} from "recoil";
import {currentTrackState, isPlayingState} from "../Atoms/songAtom";
import {useSession} from "next-auth/react";
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
import Slider from "./Slider";

const Player = () => {
    const spotifyApi = useSpotify();
    const {data: session} = useSession();
    const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [,setDevice] = useRecoilState(deviceAtom);
    const [player, setPlayer] = useState<Spotify.Player>();
    const [volume, setVolume] = useState({
        value: 0.5,
        isOff: false
    })
    const [trackState, setTrackState] = useState<{ duration: number; position: number; updateTime: number; }>();
    const [progress, setProgress] = useState(0);
    const [inputValue, setInputValue] = useState(0);
    const [inputActive, setInputActive] = useState(false);

    const volumeOffHandler = () => {
        setVolume({
            ...volume,
            isOff: !volume.isOff
        });
        (!volume.isOff) ? player?.setVolume(0) : player?.setVolume(volume.value);
    };

    useEffect(() => {
        setInputValue(0);
        setProgress(0);
    }, [currentTrack?.id])

    useEffect(() => {
        if (!isPlaying) return () => {};
        const interval = setInterval(() => {
            const progress = (trackState !== undefined) ? (trackState.position + performance.now() - trackState.updateTime) / 1000 : 0;
            setProgress(progress);
        }, 500);
        return () => clearInterval(interval);
    }, [trackState, isPlaying]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
        window.onSpotifyWebPlaybackSDKReady = () => {
            const lastVolume: number = localStorage.getItem("volume") ? JSON.parse(localStorage.getItem("volume")!) : 0.5;
            setVolume({
                ...volume,
                value: lastVolume
            });
            const player = new window.Spotify.Player({
                name: 'Finner-spotify',
                getOAuthToken: cb => {
                    cb(session?.user.accessToken!);
                },
                volume: lastVolume,
            });
            player.addListener('ready', ({device_id}) => {
                setDevice(device_id);
                setPlayer(player);
                console.log('Ready with Device ID', device_id);
                spotifyApi.getMyRecentlyPlayedTracks().then((data) => {
                    spotifyApi.play({
                        device_id: device_id,
                        context_uri: data.body.items[0].context.uri,
                        offset: {
                            uri: data.body.items[0].track.uri
                        }
                    }).then(() => {
                        player.pause().then();
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
                setTrackState({
                    duration: props?.duration ?? 0,
                    position: props?.position ?? 0,
                    updateTime: performance.now()
                });
            })
            /*player.connect().catch(() => {
                /!*const script_two = document.createElement("script");
                script_two.src = "https://open.spotify.com/embed-podcast/iframe-api/v1";
                script_two.async = true;

                document.body.appendChild(script_two);

                window.onSpotifyIframeApiReady = (IFrameAPI) => {
                    let element = document.getElementById('test');
                    let options = {
                        uri: 'spotify:episode:7makk4oTQel546B0PZlDM5'
                    };
                    let callback = (EmbedController) => {};
                    IFrameAPI.createController(element, options, callback);
                };*!/
            });*/
        };
    }, []);

    return (
        <div>
            {/*TrackLine*/}
            {trackState ?
                <Slider
                    value={inputActive ? inputValue : progress}
                    min={0}
                    max={trackState.duration/1000}
                    step={0.001}
                    onChange={(e, value) => {
                        const currValue = Array.isArray(value) ? value[0] : value;
                        player?.seek(currValue*1000).then(() =>{
                            setProgress(currValue);
                            setInputValue(currValue);
                        });
                    }}
                    onMouseDown={() => setInputActive(true)}
                    onMouseUp={() => {
                        setInputActive(false);
                        setProgress(inputValue);
                        if(inputValue !== progress)player?.seek(inputValue*1000).then(() => {
                            setInputActive(false);
                            setProgress(inputValue);
                        });
                    }}
                />
                : null}
            {/*Player*/}
            <div
                className={"h-16 pt-2 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8"}
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
                    <RewindIcon
                        onClick={() => player?.previousTrack()}
                        className={"button"}
                    />
                    {isPlaying ?
                        <PauseIcon onClick={() => player?.pause()} className={"button w-10 h-10"}/>
                        :
                        <PlayIcon onClick={() => player?.resume()} className={"button w-10 h-10"}/>
                    }
                    <FastForwardIcon
                        onClick={() => player?.nextTrack()}
                        className={"button"}
                    />
                    <ReplyIcon className={"button"}/>
                </div>
                {/*Right*/}
                <div className={"flex items-center space-x-3 md:space-x-4 justify-end pr-5"}>
                    {volume.isOff || volume.value === 0 ?
                        <VolumeOffIcon className={"button"} onClick={volumeOffHandler}/>
                        :
                        <VolumeUpIcon className={"button"} onClick={volumeOffHandler}/>
                    }
                    <input
                        className={"w-14 md:w-28"}
                        type="range"
                        step={0.01}
                        value={volume.isOff ? 0 : volume.value}
                        min={0} max={1}
                        onChange={(e) => {
                            localStorage.setItem("volume", JSON.stringify(Number(e.target.value)));
                            setVolume({
                                ...volume,
                                value: Number(e.target.value)
                            });
                            player?.setVolume(Number(e.target.value));
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Player;