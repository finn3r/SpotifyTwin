import React from 'react';
import Song from "./Song";
import {isArray} from "lodash";

const Songs = (prop: {playlist: SpotifyApi.SinglePlaylistResponse | SpotifyApi.SavedTrackObject[] | SpotifyApi.SingleAlbumResponse | undefined}) => {
    let playlistUri: string = "";
    let tracks: SpotifyApi.TrackObjectFull[];
    if (isArray(prop.playlist)) {
        tracks = prop.playlist as unknown as SpotifyApi.TrackObjectFull[];
    } else{
        tracks = prop.playlist?.tracks.items as unknown as SpotifyApi.TrackObjectFull[];
        playlistUri = prop.playlist?.uri ?? "";
    }
    return (
        <div className={"flex flex-col text-white space-y-1 pb-28"}>
            {tracks?.map((track, i) => (
                <Song key={track.id} track={track} order={i} playlistUri={playlistUri}/>
            ))}
        </div>
    );
};

export default Songs;