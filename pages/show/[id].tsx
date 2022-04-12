import React, {useEffect, useState} from 'react';
import useSpotify from "../../hooks/useSpotify";
import {useRouter} from "next/router";
import AudioPage from "../../components/AudioPage";
import Songs from "../../components/Songs";

const Show = () => {
    const spotifyApi = useSpotify();
    const router = useRouter();
    const [show, setShow] = useState<{ id: string, info: undefined | SpotifyApi.SingleShowResponse, error: boolean }>({
        id: "",
        info: undefined,
        error: false
    });
    useEffect(() => {
        const {id} = router.query;
        setShow({
            ...show,
            error: false
        });
        if ((typeof id === "string") && (id != show.id)) {
            spotifyApi
                .getShow(id)
                .then((data) => {
                    setShow({
                        ...show,
                        info: data.body,
                        id: id
                    });
                })
                .catch(error => {
                    console.log(error);
                    setShow({
                        ...show,
                        error: true
                    });
                })
        }
    }, [router]);

    return (
        <AudioPage type={"show"} error={show.error} info={show.info}>
            <Songs playlist={show.info}/>
        </AudioPage>
    );
};

    export default Show;