import React, {useEffect, useState} from 'react';
import useSpotify from "../../hooks/useSpotify";
import {useRouter} from "next/router";
import {titleAtom} from "../../Atoms/titleAtom";
import {useRecoilState} from "recoil";
import Spinner from "../../components/Spinner";
import {useSession} from "next-auth/react";
import AudioPage from "../../components/AudioPage";
import Songs from "../../components/Songs";

const Album = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const router = useRouter();
    const [album, setAlbum] = useState<{ id: string, info: undefined | SpotifyApi.SingleAlbumResponse, status: string }>({
        id: "",
        info: undefined,
        status: "pending"
    });

    const getAlbums = async (id: string) => {
        try {
            const info = await spotifyApi.getAlbum(id).then(data => data.body);
            setAlbum({
                info,
                id,
                status: "success"
            })
        } catch (e) {
            setAlbum({
                ...album,
                status: "error"
            });
        }
    };

    useEffect(() => {
        setTitle(album.info?.name ? (album.info?.name + " - Album -  Spotify tween") : "Spotify tween");
    }, [album.info]);

    useEffect(() => {
        const {id} = router.query;
        if (spotifyApi.getAccessToken() && (id !== album.id)) {
            setAlbum({
                ...album,
                status: "pending"
            });
            if (typeof id === "string") {
                getAlbums(id).then();
            } else setAlbum({...album, status: "error"});
        }
    }, [spotifyApi, router, session]);

    if (album.status === "pending") return (<Spinner/>);

    return (
        <AudioPage info={album.info} error={album.status==="error"} type={"album"}>
            <Songs playlist={album.info}/>
        </AudioPage>
    );
};

export default Album;