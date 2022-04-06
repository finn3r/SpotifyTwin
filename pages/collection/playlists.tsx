import React, {useEffect, useState} from 'react';
import PlaylistCell from "../../components/PlaylistCell";
import useSpotify from "../../hooks/useSpotify";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useRecoilValue} from "recoil";
import {userPlaylistsState} from "../../Atoms/platlistAtom";

const Playlists = () => {
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const cellMinWidth = 250;
    const [columnCount, setColumnCount] = React.useState(0);
    const router = useRouter();
    const playlists = useRecoilValue(userPlaylistsState);
    const [savedTracks, setSavedTracks] = useState({
        info: "",
        count: 0
    });

    const getTracks = async () => {
        const tracksArray: SpotifyApi.SavedTrackObject[] = [];
        for (let i = 0; i < 200; i++) {
            const length: number = await spotifyApi.getMySavedTracks({offset: i * 50, limit: 50}).then((data) => {
                tracksArray.push(...data.body.items);
                return data.body.items.length;
            });
            if (length !== 50) {
                let info = "";
                for (let i = 0; (i < 6) && (i < tracksArray.length); i++) {
                    info += tracksArray[i].track.artists[0].name + " - " + tracksArray[i].track.name + " • ";
                }
                return {
                    info: info.slice(0, -3),
                    count: tracksArray.length
                };
            }
        }
    }

    const widthHandler = () => {
        (columnCount !== Math.round(window.innerWidth / cellMinWidth)) ? setColumnCount(Math.round(window.innerWidth / cellMinWidth)) : null
    };

    useEffect(() => {
        window.addEventListener("resize", widthHandler);
        return () => {
            window.removeEventListener("resize", widthHandler);
        }
    }, []);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getTracks().then((data) => setSavedTracks({
                info: data?.info ?? "",
                count: data?.count ?? 0
            })).then(() => setColumnCount(Math.round(window.innerWidth / cellMinWidth)));
        }
    }, [session, spotifyApi]);

    return (
        <div className={"w-full h-screen"}>
            <header className={"text-white text-2xl md:text-3xl xl:text-5xl font-bold m-5"}>
                Playlists
            </header>
            <div
                className={"grid-flow-row h-[85vh] scrollbar-hide overflow-y-scroll auto-rows-min " + (columnCount !== 0 ? "grid" : "hidden")}
                style={{gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`}}>
                <div
                    className={"savedTracks"}
                    onClick={() => router.push(`/collection/tracks`)}
                >
                    <div className={"savedTracks_background"}/>
                    <div className={"line-clamp-3 m-5 mt-12 z-10"}>
                        {savedTracks.info.split(" • ").map((track, id) => {
                            const author: string = track.split(" - ")[0];
                            const name: string = track.split(" - ")[1];
                            return (
                                <span>
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
                        <p className={"text-gray-400 font-bold m-2"}>{savedTracks.count} saved tracks</p>
                    </div>
                </div>
                {playlists?.map((playlist) => <PlaylistCell key={playlist.id + "_cell"} playlist={playlist}/>)}
            </div>
        </div>
    );
};

export default Playlists;