import React, {useEffect, useState, lazy, Suspense} from 'react';
import useSpotify from "../../hooks/useSpotify";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useRecoilState} from "recoil";
import {titleAtom} from "../../Atoms/titleAtom";
import Spinner from "../../components/Spinner";

const AudioPage = lazy(() => import("../../components/AudioPage"));
const Songs = lazy(() => import("../../components/Songs"));

const Playlist: NextPage = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const spotifyApi = useSpotify();
    const router = useRouter();
    const [playlist, setPlaylist] = useState<{ id: string, info: undefined | SpotifyApi.SinglePlaylistResponse, error: boolean }>({
        id: "",
        info: undefined,
        error: false
    });

    const getPlaylists = async (id: string) => {
        try {
            const info = await spotifyApi.getPlaylist(id).then(data => data.body);
            setPlaylist({
                ...playlist,
                info,
                id
            })
        } catch (e) {
            setPlaylist({
                ...playlist,
                error: true
            });
            console.log(e);
        }
    };

    useEffect(() => {
        document.getElementById("audio_container")?.scrollTo({top:0, behavior: "smooth"});
    }, [router]);

    useEffect(() => {
        setTitle(playlist.info?.name ? (playlist.info?.name + " - Playlist -  Spotify tween") : "Spotify tween");
    }, [playlist.info]);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            const {id} = router.query;
            setPlaylist({
                ...playlist,
                error: false
            });
            if ((typeof id === "string") && (id != playlist.id)) {
                getPlaylists(id).then();
            }
        }
    }, [spotifyApi.getAccessToken(), router]);

    return (
        <Suspense fallback={<Spinner/>}>
            <AudioPage type={"playlist"} error={playlist.error} info={playlist.info}>
                <Songs playlist={playlist.info}/>
            </AudioPage>
        </Suspense>
    );
};

export default Playlist;