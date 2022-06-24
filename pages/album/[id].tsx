import React, {lazy, useEffect, useState, Suspense} from 'react';
import useSpotify from "../../hooks/useSpotify";
import {useRouter} from "next/router";
import {titleAtom} from "../../Atoms/titleAtom";
import {useRecoilState} from "recoil";
import Spinner from "../../components/Spinner";

const AudioPage = lazy(() => import("../../components/AudioPage"));
const Songs = lazy(() => import("../../components/Songs"));

const Album = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const spotifyApi = useSpotify();
    const router = useRouter();
    const [album, setAlbum] = useState<{ id: string, info: undefined | SpotifyApi.SingleAlbumResponse, error: boolean }>({
        id: "",
        info: undefined,
        error: false
    });

    const getAlbums = async (id: string) => {
        try {
            const info = await spotifyApi.getAlbum(id).then(data => data.body);
            setAlbum({
                ...album,
                info,
                id
            })
        } catch (e) {
            setAlbum({
                ...album,
                error: true
            });
            console.log(e);
        }
    };

    useEffect(() => {
        setTitle(album.info?.name ? (album.info?.name + " - Album -  Spotify tween") : "Spotify tween");
    }, [album.info]);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            const {id} = router.query;
            setAlbum({
                ...album,
                error: false
            });
            if ((typeof id === "string") && (id != album.id)) {
                getAlbums(id).then();
            }
        }
    }, [spotifyApi.getAccessToken(), router]);

    return (
        <Suspense fallback={<Spinner/>}>
            <AudioPage info={album.info} error={album.error} type={"album"}>
                <Songs playlist={album.info}/>
            </AudioPage>
        </Suspense>
    );
};

export default Album;