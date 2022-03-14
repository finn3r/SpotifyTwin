import React from 'react';
import {useRecoilValue} from "recoil";
import {playlistState} from "../Atoms/platlistAtom";
import Song from "./Song";

const Songs = () => {
    const playlist = useRecoilValue(playlistState);
    return (
        <div className={"px-8 flex flex-col text-white space-y-1 pb-28"}>
            {playlist?.tracks.items.map((track, i) => (
                <Song key={track.track.id} track={track} order={i} playlistUri={playlist.uri}/>
            ))}
        </div>
    );
};

export default Songs;