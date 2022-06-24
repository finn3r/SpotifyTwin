import React, {lazy, Suspense, useEffect, useState} from 'react';
import useSpotify from "../../hooks/useSpotify";
import {useSession} from "next-auth/react";
import {useRecoilState, useRecoilValue} from "recoil";
import {userPlaylistsState} from "../../Atoms/platlistAtom";
import {useRouter} from "next/router";
import {titleAtom} from "../../Atoms/titleAtom";
import Spinner from "../../components/Spinner";

const Cell = lazy(() => import("../../components/Collection/Cell"));
const Collection = lazy(() => import("../../components/Collection"));

const Playlists = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const router = useRouter();
    const playlists: SpotifyApi.PlaylistObjectSimplified[] = useRecoilValue(userPlaylistsState);
    const [savedTracks, setSavedTracks] = useState<{ info: string, count: number }>();

    const getTracks = async () => {
        const savedTracks = await spotifyApi.getMySavedTracks({limit: 10}).then(data => data.body);
        const savedTracksInfo = savedTracks.items.map(track => (track.track.artists[0].name + " - " + track.track.name)).join(" • ");
        setSavedTracks({
            info: savedTracksInfo,
            count: savedTracks.total
        })
    };

    useEffect(() => {
        setTitle("Playlists - Spotify tween");
    }, []);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getTracks().then();
        }
    }, [session, spotifyApi.getAccessToken()]);

    return (
        <Suspense fallback={<Spinner/>}>
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
        </Suspense>
    );
};

export default Playlists;