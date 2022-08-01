import React, {useEffect, useState} from 'react';
import useSpotify from "../hooks/useSpotify";
import {useRecoilState} from "recoil";
import {currentTrackState, isPlayingState} from "../Atoms/songAtom";
import {
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    RewindIcon,
    SwitchHorizontalIcon
} from "@heroicons/react/solid";
import {VolumeUpIcon, VolumeOffIcon} from "@heroicons/react/outline";
import {playerAtom} from "../Atoms/playerAtom";
import Slider from "./Slider";
import {deviceAtom} from "../Atoms/deviceAtom";

const Player = () => {
    const spotifyApi = useSpotify();
    const [statusVisible, setStatusVisible] = useState(true);
    const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [player, setPlayer] = useRecoilState(playerAtom);
    const [, setDevice] = useRecoilState(deviceAtom);
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

    const getPlayer = async (token: string) => {
        const status = await spotifyApi.getMe().then((data) => data.body.product === "premium");
        if (status) {
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
                        cb(token);
                    },
                    volume: lastVolume,
                });
                player.addListener('ready', ({device_id}) => {
                    setDevice(device_id);
                    setPlayer(player);
                    setStatusVisible(true);
                });
                player.addListener('not_ready', () => {
                    setDevice("");
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
                player.connect().catch((e) => {
                    console.log(e);
                });
            };
        } else {
            console.log("Sorry player available only on premium spotify account.")
            setStatusVisible(false);
        }
    };

    useEffect(() => {
        setInputValue(0);
        setProgress(0);
    }, [currentTrack?.id])

    useEffect(() => {
        if (!isPlaying) return () => {
        };
        const interval = setInterval(() => {
            const progress = (trackState !== undefined) ? (trackState.position + performance.now() - trackState.updateTime) / 1000 : 0;
            setProgress(progress);
        }, 500);
        return () => clearInterval(interval);
    }, [trackState, isPlaying]);

    useEffect(() => {
        const token = spotifyApi.getAccessToken();
        if (token) {
            getPlayer(token).then();
        }
        return () => {
            player?.disconnect();
        }
    }, [spotifyApi.getAccessToken()]);

    if (!statusVisible) return null;
    return (
        <div className={"absolute w-screen bottom-0 z-40 bg-gradient-to-b from-black to-gray-900"}>
            {/*TrackLine*/}
            {trackState ?
                <Slider
                    value={inputActive ? inputValue : progress}
                    min={0}
                    max={trackState.duration / 1000}
                    step={0.001}
                    onChange={(e, value) => {
                        const currValue = Array.isArray(value) ? value[0] : value;
                        player?.seek(currValue * 1000).then(() => {
                            setProgress(currValue);
                            setInputValue(currValue);
                        });
                    }}
                    onMouseDown={() => setInputActive(true)}
                    onMouseUp={() => {
                        setInputActive(false);
                        setProgress(inputValue);
                        if (inputValue !== progress) player?.seek(inputValue * 1000).then(() => {
                            setInputActive(false);
                            setProgress(inputValue);
                        });
                    }}
                />
                : null}
            {/*Player*/}
            <div
                className={"h-16 pt-2 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8"}
            >
                {/*Left*/}
                {(currentTrack) ?
                    <div className={"flex items-center space-x-4"}>
                        <img className={"hidden sm:inline h-10 w-10"} src={currentTrack.album.images?.[0]?.url} alt=""/>
                        <div>
                            <h3>{currentTrack.name}</h3>
                            <p>{currentTrack.artists?.[0]?.name}</p>
                        </div>
                    </div>
                    : <div/>}
                {/*Center*/}
                <div className={"flex items-center justify-center space-x-1"}>
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
                <div className={"flex items-center space-x-3 md:space-x-4 justify-end pr-2"}>
                    {volume.isOff || volume.value === 0 ?
                        <VolumeOffIcon className={"button hidden sm:block"} onClick={volumeOffHandler}/>
                        :
                        <VolumeUpIcon className={"button hidden sm:block"} onClick={volumeOffHandler}/>
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