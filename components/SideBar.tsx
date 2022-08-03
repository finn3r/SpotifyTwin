import {HomeIcon, LibraryIcon, SearchIcon} from "@heroicons/react/outline";
import {useSession} from "next-auth/react";
import React, {useEffect, useState} from "react";
import useSpotify from "../hooks/useSpotify";
import {useRouter} from "next/router";
import {useRecoilState} from "recoil";
import {userPlaylistsState} from "../Atoms/platlistAtom";
import MenuButton from "./MenuButton";

const SideBar = () => {
    const spotifyApi = useSpotify();
    const router = useRouter();
    const path = router.route;
    const {id: playlistId} = router.query;
    const {data: session} = useSession();
    const [playlists, setPlaylists] = useRecoilState(userPlaylistsState);
    const [focus, setFocus] = useState(false);

    const getPlaylist = async () => {
        const playlistArray: SpotifyApi.PlaylistObjectSimplified[] = [];
        for (let i = 0; i < 200; i++) {
            const length: number = await spotifyApi.getUserPlaylists({offset: i * 50, limit: 50}).then((data) => {
                playlistArray.push(...data.body.items);
                return data.body.items.length;
            });
            if (length !== 50) {
                setPlaylists(playlistArray);
                break;
            }
        }
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getPlaylist().then();
        }
    }, [session, spotifyApi]);

    return (
        <div>
            <MenuButton focus={focus} changeFocus={setFocus}/>
            <div
                className={`${focus ? "absolute w-full z-50 h-screen sm:static" : "hidden"} overflow-hidden bg-black sm:block text-gray-500 p-5 text-xs border-r border-gray-900 lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] pb-36`}>
                <div className={"space-y-4"}>
                    {/*Buttons*/}
                    <button
                        className={`flex items-center space-x-2 hover:text-white ${("/" == path) ? "text-white" : ""}`}
                        onClick={() => router.push(`/`).then(() => setFocus(false))}>
                        <HomeIcon className="h-5 w-5"/>
                        <p>Home</p>
                    </button>
                    <button
                        className={`flex items-center space-x-2 hover:text-white ${("/search" == path) ? "text-white" : ""}`}
                        onClick={() => router.push(`/search`).then(() => setFocus(false))}>
                        <SearchIcon className="h-5 w-5"/>
                        <p>Search</p>
                    </button>
                    <button
                        className={`flex items-center space-x-2 hover:text-white ${(path.includes("/collection") && !path.includes("/tracks") && !path.includes("/episodes")) ? "text-white" : ""}`}
                        onClick={() => router.push(`/collection/playlists`).then(() => setFocus(false))}>
                        <LibraryIcon className="h-5 w-5"/>
                        <p>Your Library</p>
                    </button>
                    <hr className={"border-t-[0.1px] border-gray-900"}/>
                    {/*Playlists*/}
                    <div className={"h-[78vh] sm:h-[80vh] overflow-y-scroll scrollbar-hide pb-20"}>
                        {playlists.map((playlist) => (
                            <p
                                key={playlist.id}
                                className={`pb-4 cursor-pointer hover:text-white ${(playlistId == playlist.id) ? "text-white" : ""}`}
                                onClick={() => router.push(`/playlist/${playlist.id}`).then(() => setFocus(false))}
                            >
                                {playlist.name}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideBar