import React, {useEffect, useState} from 'react';
import useSpotify from "../../hooks/useSpotify";
import Songs from "../../components/Songs";
import {useRouter} from "next/router";
import AudioPage from "../../components/AudioPage";
import {titleAtom} from "../../Atoms/titleAtom";
import {useRecoilState} from "recoil";

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
    }, [spotifyApi, router]);

    return (
        <AudioPage info={album.info} error={album.error} type={"album"}>
            <Songs playlist={album.info}/>
        </AudioPage>
    );
};

export default Album;