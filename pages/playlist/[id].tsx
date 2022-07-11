import React, {useEffect, useState} from 'react';
import useSpotify from "../../hooks/useSpotify";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useRecoilState} from "recoil";
import {titleAtom} from "../../Atoms/titleAtom";
import Spinner from "../../components/Spinner";
import AudioPage from "../../components/AudioPage";
import Songs from "../../components/Songs";
import {useSession} from "next-auth/react";

const Playlist: NextPage = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const spotifyApi = useSpotify();
    const {data: session} = useSession();
    const router = useRouter();
    const [playlist, setPlaylist] = useState<{ id: string, info: undefined | SpotifyApi.SinglePlaylistResponse, status: string }>({
        id: "",
        info: undefined,
        status: "pending"
    });

    const getPlaylists = async (id: string) => {
        try {
            const info = await spotifyApi.getPlaylist(id).then(data => data.body);
            setPlaylist({
                info,
                id,
                status: "success"
            })
        } catch (e) {
            setPlaylist({
                ...playlist,
                status: "error"
            });
        }
    };

    useEffect(() => {
        document.getElementById("audio_container")?.scrollTo({top: 0, behavior: "smooth"});
    }, [router]);

    useEffect(() => {
        setTitle(playlist.info?.name ? (playlist.info?.name + " - Playlist -  Spotify tween") : "Spotify tween");
    }, [playlist.info]);

    useEffect(() => {
        const {id} = router.query;
        if (spotifyApi.getAccessToken() && (id !== playlist.id)) {
            setPlaylist({
                ...playlist,
                status: "pending"
            });
            if (typeof id === "string") {
                getPlaylists(id).then();
            } else setPlaylist({...playlist, status: "error"});
        }
    }, [spotifyApi, router, session]);

    if (playlist.status === "pending") return (<Spinner/>);

    return (
        <AudioPage type={"playlist"} error={playlist.status==="error"} info={playlist.info}>
            <Songs playlist={playlist.info}/>
        </AudioPage>
    );
};

export default Playlist;