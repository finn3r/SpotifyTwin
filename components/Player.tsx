import React, {useCallback, useEffect, useState} from 'react';
import useSpotify from "../hooks/useSpotify";
import {useRecoilState} from "recoil";
import {currentTrackIdState, isPlayingState} from "../Atoms/songAtom";
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
import {debounce} from "lodash";

const Player = () => {
    const spotifyApi = useSpotify();
    const {data: session, status} = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState<number>(50);
    const [volumeOff, setVolumeOff] = useState<boolean>(false);

    const songInfo = useSongInfo();

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if(data.body.is_playing){
                spotifyApi.pause().then();
                setIsPlaying(false);
            }else{
                spotifyApi.play().then();
                setIsPlaying(true);
            }
        })
    }
    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                setCurrentTrackId(data.body?.item!.id);
                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing)
                })
            })
        }
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
        }
    }, [currentTrackId, spotifyApi, session]);

    const debounceAdjustVolume = useCallback(
        debounce((volume: number) => {
            spotifyApi.setVolume(volume).then();
        }, 100)
    ,[])

    useEffect(() => {
        if(volume > 0 && !volumeOff){
            debounceAdjustVolume(volume);
        }else{
            debounceAdjustVolume(0);
        }
    }, [volume, volumeOff])

    return (
        <div
            className={"h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8"}
        >
            {/*Left*/}
            {(songInfo) ?
                <div className={"flex items-center space-x-4"}>
                    <img className={"hidden md:inline h-10 w-10"} src={songInfo.album.images?.[0]?.url} alt=""/>
                    <div>
                        <h3>{songInfo.name}</h3>
                        <p>{songInfo.artists?.[0]?.name}</p>
                    </div>
                </div>
                : <div/>}
            {/*Center*/}
            <div className={"flex items-center justify-evenly"}>
                <SwitchHorizontalIcon className={"button"}/>
                <RewindIcon onClick={() => spotifyApi.skipToPrevious()} className={"button"}/>
                {isPlaying ?
                    <PauseIcon onClick={handlePlayPause} className={"button w-10 h-10"}/>
                    :
                    <PlayIcon onClick={handlePlayPause} className={"button w-10 h-10"}/>
                }
                <FastForwardIcon onClick={() => spotifyApi.skipToNext()} className={"button"}/>
                <ReplyIcon className={"button"}/>
            </div>
            {/*Right*/}
            <div className={"flex items-center space-x-3 md:space-x-4 justify-end pr-5"}>
                { volumeOff||volume===0 ?
                    <VolumeOffIcon className={"button"} onClick={() => setVolumeOff(!volumeOff)}/>
                    :
                    <VolumeUpIcon className={"button"} onClick={() => setVolumeOff(!volumeOff)}/>
                }
                <input
                    className={"w-14 md:w-28"}
                    type="range"
                    value={volumeOff ? 0 : volume}
                    min={0} max={100}
                    onChange={ (e) => setVolume(Number(e.target.value))}
                />
            </div>
        </div>
    );
};

export default Player;