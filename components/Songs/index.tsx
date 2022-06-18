import React from 'react';
import Song from "./Song";
import {isArray} from "lodash";

const Songs = (props: { playlist: SpotifyApi.PlaylistObjectFull | SpotifyApi.TrackObjectFull[] | SpotifyApi.SavedTrackObject[] | SpotifyApi.AlbumObjectFull | undefined }) => {
    let playlistUri: string = "";
    let tracks: SpotifyApi.TrackObjectFull[] = [];
    if (isArray(props.playlist)) {
        if ((props.playlist as SpotifyApi.TrackObjectFull[])[0]?.name !== undefined) {
            tracks = props.playlist as SpotifyApi.TrackObjectFull[];
        } else if ((props.playlist as SpotifyApi.SavedTrackObject[])[0]?.track !== undefined) {
            tracks = (props.playlist as SpotifyApi.SavedTrackObject[]).map((savedTrack) => savedTrack.track);
        }
    } else {
        switch (props.playlist?.type) {
            case "playlist": {
                tracks = props.playlist.tracks.items.map((playlistTrack) => playlistTrack.track);
                playlistUri = props.playlist.uri;
                break;
            }
            case "album": {
                tracks = props.playlist.tracks.items as SpotifyApi.TrackObjectFull[];
                playlistUri = props.playlist.uri;
                break;
            }
        }
    }
    let uris = tracks.map((track) => track.uri);
    return (
        <div className={"flex flex-col text-white space-y-1"}>
            {(tracks?.length > 0) ?
                tracks.map((track, i) => (
                    <Song key={track.id} track={track} order={i} playlistUri={playlistUri} uris={uris}/>
                ))
                :
                <div className={"absolute top-0 w-full min-h-0 h-screen bg-[#121212]"}/>
            }
            <div className={"h-10"}/>
        </div>
    );
};

export default Songs;