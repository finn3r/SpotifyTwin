import {
    HeartIcon,
    HomeIcon,
    LibraryIcon,
    LogoutIcon,
    PlusCircleIcon,
    RssIcon,
    SearchIcon
} from "@heroicons/react/outline";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import useSpotify from "../hooks/useSpotify";
import {useRouter} from "next/router";

const SideBar = () => {
    const spotifyApi = useSpotify();
    const router = useRouter();
    const path = router.route;
    const {id: playlistId} = router.query;
    const {data: session} = useSession();
    const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);

    const getPlaylist = async () => {
        const playlistArray: SpotifyApi.PlaylistObjectSimplified[] = [];
        for (let i = 0; i < 200; i++) {
            const length: number = await spotifyApi.getUserPlaylists({offset: i * 50, limit: 50}).then((data) => {
                playlistArray.push(...data.body.items);
                return data.body.items.length;
            });
            if(length !== 50){
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
        <div
            className="hidden sm:block text-gray-500 p-5 text-xs border-r border-gray-900 h-screen overflow-y-scroll scrollbar-hide lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] pb-36">
            <div className={"space-y-4"}>
                {/*Buttons*/}
                <button className={`flex items-center space-x-2 hover:text-white ${("/" == path) ? "text-white" : ""}`} onClick={() => router.push(`/`)}>
                    <HomeIcon className="h-5 w-5"/>
                    <p>Home</p>
                </button>
                <button className={`flex items-center space-x-2 hover:text-white ${("/search" == path) ? "text-white" : ""}`} onClick={() => router.push(`/search`)}>
                    <SearchIcon className="h-5 w-5"/>
                    <p>Search</p>
                </button>
                <button className={`flex items-center space-x-2 hover:text-white ${("/collection/playlists" == path) ? "text-white" : ""}`} onClick={() => router.push(`/collection/playlists`)}>
                    <LibraryIcon className="h-5 w-5"/>
                    <p>Your Library</p>
                </button>
                <hr className={"border-t-[0.1px] border-gray-900"}/>

                <button className="flex items-center space-x-2 hover:text-white">
                    <PlusCircleIcon className="h-5 w-5"/>
                    <p>Create Playlist</p>
                </button>
                <button className={`flex items-center space-x-2 hover:text-white ${("/collection/tracks" == path) ? "text-white" : ""}`} onClick={() => router.push('/collection/tracks')}>
                    <HeartIcon className="h-5 w-5"/>
                    <p>Liked Songs</p>
                </button>
                <button className={`flex items-center space-x-2 hover:text-white ${("/collection/episodes" == path) ? "text-white" : ""}`} onClick={() => router.push(`/collection/episodes`)}>
                    <RssIcon className="h-5 w-5"/>
                    <p>Your episodes</p>
                </button>
                <hr className={"border-t-[0.1px] border-gray-900"}/>
                {/*Playlists*/}
                {playlists.map((playlist) => (
                    <p
                        key={playlist.id}
                        className={`cursor-pointer hover:text-white ${(playlistId == playlist.id) ? "text-white" : ""}`}
                        onClick={() => router.push(`/playlist/${playlist.id}`)}
                    >
                        {playlist.name}
                    </p>
                ))}
            </div>
        </div>
    )
}

export default SideBar