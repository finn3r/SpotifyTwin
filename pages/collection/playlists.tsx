import React, {useEffect, useState} from 'react';
import Cell from "../../components/Collection/Cell";
import useSpotify from "../../hooks/useSpotify";
import {useSession} from "next-auth/react";
import {useRecoilValue} from "recoil";
import {userPlaylistsState} from "../../Atoms/platlistAtom";
import Collection from "../../components/Collection";
import {useRouter} from "next/router";

const Playlists = () => {
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const router = useRouter();
    const playlists: SpotifyApi.PlaylistObjectSimplified[] = useRecoilValue(userPlaylistsState);
    const [savedTracks, setSavedTracks] = useState<{ info: string, count: number }>();

    const getTracks = async () => {
        spotifyApi.getMySavedTracks({limit: 10}).then((data) => {
            let info: string = "";
            for (let i = 0; i < data.body.items.length; i++) info += data.body.items[i].track.artists[0].name + " - " + data.body.items[i].track.name + " • ";
            setSavedTracks({
                info: info.slice(0, -3),
                count: data.body.total
            })
        })
    };

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getTracks().then();
        }
    }, [session, spotifyApi]);

    return (
        <Collection>
            {/*SAVED TRACKS*/}
            <div
                className={"saved_collection"}
                onClick={() => router.push(`/collection/tracks`)}
            >
                <div className={"saved_background saved_tracks_background"}/>
                <div className={"line-clamp-3 m-5 mt-12 z-10"}>
                    {savedTracks?.info.split(" • ").map((track, id) => {
                        const author: string = track.split(" - ")[0];
                        const name: string = track.split(" - ")[1];
                        return (
                            <span key={id + "_savedTrack"}>
                                <span className={"text-white"}>
                                    {author} -
                                </span>
                                <span className={"text-gray-400 color-"}>
                                    {(id < savedTracks.info.split(" • ").length - 1) ? (" " + name + " • ") : (" " + name)}
                                </span>
                            </span>);
                    })}
                </div>
                <div className={"z-10"}>
                    <p className={"text-xl md:text-2xl xl:text-5x text-white font-bold m-2"}>Saved tracks</p>
                    <p className={"text-gray-400 font-bold m-2"}>{savedTracks?.count} saved tracks</p>
                </div>
            </div>
            {playlists?.map((playlist) => <Cell key={playlist.id + "_cell"} collection={playlist}/>)}
        </Collection>
    );
};

export default Playlists;