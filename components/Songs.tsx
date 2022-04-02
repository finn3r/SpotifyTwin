import React from 'react';
import Song from "./Song";
import {isArray} from "lodash";

const Songs = (prop: {playlist: SpotifyApi.SinglePlaylistResponse | SpotifyApi.SavedTrackObject[] | undefined}) => {
    let playlistUri: string;
    let tracks;
    if (isArray(prop.playlist)) {
        tracks = prop.playlist;
    } else{
        tracks = prop.playlist?.tracks.items;
        playlistUri = "";
    }
    return (
        <div className={"flex flex-col text-white space-y-1 pb-28"}>
            {tracks?.map((track, i) => (
                <Song key={track.track.id} track={track} order={i} playlistUri={playlistUri}/>
            ))}
        </div>
    );
};

export default Songs;