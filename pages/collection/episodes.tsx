import React, {useEffect, useState} from 'react';
import Songs from "../../components/Songs";
import useSpotify from "../../hooks/useSpotify";
import {useSession} from "next-auth/react";
import AudioPage from "../../components/AudioPage";
import {ISavesPodcasts} from "./podcasts";
import axios from "axios";

const Episodes = () => {
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const [episodes, setEpisodes] = useState<SpotifyApi.SavedEpisodeObject[]>();

    const getSavedEpisodes = async (token:string, offset: number, episodes?: SpotifyApi.SavedEpisodeObject[]) => {
        const instance = axios.create({
            baseURL: 'https://api.spotify.com/v1/me/episodes',
            headers: {'Authorization': "Bearer " + token ?? ""}
        });
        instance.get(`?offset=${offset}&limit=50`).then((data) => {
            const podcastsData: ISavesPodcasts = data as ISavesPodcasts;
            console.log(podcastsData);
            if (podcastsData.data.next) {
                const offset: number = Number(podcastsData.data.next.split("offset=")[1].split("&")[0]);
                getSavedEpisodes(token, offset, [...episodes ?? [],...podcastsData.data.items]);
            } else {
                setEpisodes ([...episodes ?? [],...podcastsData.data.items]);
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getSavedEpisodes(spotifyApi.getAccessToken()!,0).then();
        }
    }, [session, spotifyApi]);

    return (
        <AudioPage error={false} type={"episodes"} info={{name: "Saved episodes"}}>
            <Songs playlist={episodes}/>
        </AudioPage>
    );
};

export default Episodes;