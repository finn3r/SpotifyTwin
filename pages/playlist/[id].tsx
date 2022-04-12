import React, {useEffect, useState} from 'react';
import useSpotify from "../../hooks/useSpotify";
import Songs from "../../components/Songs";
import {NextPage} from "next";
import {useRouter} from "next/router";
import AudioPage from "../../components/AudioPage";

const Playlist: NextPage = () => {
    const spotifyApi = useSpotify();
    const router = useRouter();
    const [playlist, setPlaylist] = useState<{ id: string, info: undefined | SpotifyApi.SinglePlaylistResponse, error: boolean }>({
        id: "",
        info: undefined,
        error: false
    });
    useEffect(() => {
        const {id} = router.query;
        setPlaylist({
            ...playlist,
            error: false
        });
        if ((typeof id === "string") && (id != playlist.id)) {
            spotifyApi
                .getPlaylist(id)
                .then((data) => {
                    setPlaylist({
                        ...playlist,
                        info: data.body,
                        id: id
                    });
                })
                .catch(error => {
                    console.log(error);
                    setPlaylist({
                        ...playlist,
                        error: true
                    });
                })
        }
    }, [router]);

    return (
        <AudioPage type={"playlist"} error={playlist.error} info={playlist.info}>
            <Songs playlist={playlist.info}/>
        </AudioPage>
    );
};

export default Playlist;