import React, {useEffect, useState} from 'react';
import useSpotify from "../../hooks/useSpotify";
import Songs from "../../components/Songs";
import {NextPage} from "next";
import {useRouter} from "next/router";
import AudioPage from "../../components/AudioPage";

const Album: NextPage = () => {
    const spotifyApi = useSpotify();
    const router = useRouter();
    const [album, setAlbum] = useState<{ id: string, info: undefined | SpotifyApi.SingleAlbumResponse, error: boolean }>({
        id: "",
        info: undefined,
        error: false

    });
    useEffect(() => {
        const {id} = router.query;
        setAlbum({
            ...album,
            error: false
        });
        if ((typeof id === "string") && (id != album.id)) {
            spotifyApi
                .getAlbum(id)
                .then((data) => {
                    setAlbum({
                        ...album,
                        info: data.body,
                        id: id
                    });
                })
                .catch(error => {
                    console.log(error);
                    setAlbum({
                        ...album,
                        error: true
                    });
                })
        }
    }, [router])
    return (
        <AudioPage info={album.info} error={album.error} type={"album"}>
            <Songs playlist={album.info}/>
        </AudioPage>
    );
};

export default Album;