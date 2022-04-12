import React, {useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import useSpotify from "../../hooks/useSpotify";
import Collection from "../../components/Collection";
import CollectionCell from "../../components/CollectionCell";
import axios from 'axios';
import {router} from "next/client";

export interface ISavesPodcasts {
    data: {
        items: SpotifyApi.SavedEpisodeObject[];
        total: number;
        next: string;
    }
}

const Podcasts = () => {
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const [podcasts, setPodcasts] = React.useState<SpotifyApi.SavedShowObject[]>();
    const [savedPodcasts, setSavedPodcasts] = useState<{ info: string, count: number }>();

    const getPodcasts = async (offset: number, podcasts?: SpotifyApi.SavedShowObject[]) => {
        spotifyApi.getMySavedShows({offset: offset, limit: 50}).then((data) => {
            if (data.body.next) {
                const offset: number = Number(data.body.next.split("offset=")[1].split("&")[0]);
                getPodcasts(offset, [...podcasts ?? [], ...data.body.items]);
            } else {
                setPodcasts([...podcasts ?? [], ...data.body.items])
            }
        })
    }

    const getSavedPodcasts = async (token: string) => {
        const instance = axios.create({
            baseURL: 'https://api.spotify.com/v1/me/episodes',
            headers: {'Authorization': "Bearer " + token ?? ""}
        });
        return instance.get("").then((data) => {
            const podcastsData: ISavesPodcasts = data as ISavesPodcasts;
            let info: string = "";
            for (let i = 0; i < podcastsData.data.items.length; i++) info += podcastsData.data.items[i].episode.name + " - " + podcastsData.data.items[i].episode.show.name + " • ";
            setSavedPodcasts ({
                info: info,
                count: data.data.total as number
            })
        }).catch((e) => {
            console.log(e);
        });
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getSavedPodcasts(spotifyApi.getAccessToken()!).then();
            getPodcasts(0).then();
        }
    }, [session, spotifyApi]);

    return (
        <Collection>
            <div
                className={"saved_collection"}
                onClick={() => router.push('/collection/episodes')}
            >
                <div className={"saved_background saved_podcasts_background"}/>
                <div className={"line-clamp-3 m-5 mt-12 z-10"}>
                    {savedPodcasts?.info.split(" • ").map((podcast, id) => {
                        const author: string = podcast.split(" - ")[0] ?? "";
                        const name: string = podcast.split(" - ")[1] ?? "";
                        return (
                            <span key={id + "_savedTrack"}>
                                <span className={"text-white"}>
                                    {author} -
                                </span>
                                <span className={"text-gray-400 color-"}>
                                    {(id < savedPodcasts.info.split(" • ").length - 1) ? (" " + name + " • ") : (" " + name)}
                                </span>
                            </span>);
                    })}
                </div>
                <div className={"z-10"}>
                    <p className={"text-xl md:text-2xl xl:text-5x text-white font-bold m-2"}>Saved podcasts</p>
                    <p className={"text-gray-400 font-bold m-2"}>{savedPodcasts?.count} saved podcasts</p>
                </div>
            </div>
            {podcasts?.map((podcast) => <CollectionCell key={podcast.show.id + "_cell"} collection={podcast.show}/>)}
        </Collection>
    );
};

export default Podcasts;