import React, {useEffect, useState} from 'react';
import useSpotify from "../../hooks/useSpotify";
import {useRouter} from "next/router";
import AudioPage from "../../components/AudioPage";
import Songs from "../../components/Songs";
import ArtistAlbums from "../../components/ArtistAlbums";
import CollectionCell from "../../components/CollectionCell";

const Artist = () => {
    const spotifyApi = useSpotify();
    const router = useRouter();
    const [artist, setArtist] = useState<{ id: string, info: undefined | SpotifyApi.SingleArtistResponse, error: boolean, topTracks: SpotifyApi.TrackObjectFull[], albums: SpotifyApi.AlbumObjectSimplified[] }>({
        id: "",
        info: undefined,
        error: false,
        topTracks: [],
        albums: []
    });

    const getAlbums = async (id: string, offset: number, tracks: SpotifyApi.TrackObjectFull[], info:SpotifyApi.SingleArtistResponse, albums?: SpotifyApi.AlbumObjectSimplified[]) => {
        spotifyApi.getArtistAlbums(id, {offset: offset, limit: 50}).then((data) => {
            if (data.body.next) {
                const offset: number = Number(data.body.next.split("offset=")[1].split("&")[0]);
                getAlbums(id, offset,tracks,info, [...albums ?? [], ...data.body.items]);
            } else {
                setArtist({
                    ...artist,
                    topTracks: tracks,
                    info: info,
                    id: id,
                    albums: [...albums ?? [], ...data.body.items]
                })
            }
        })
    };

    const getTopTracks = async (id: string) => {
        return spotifyApi.getMe().then((data) => spotifyApi.getArtistTopTracks(id, data.body.country).then((data) => {
            return data.body.tracks
        }))
    };

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            const {id} = router.query;
            setArtist({
                ...artist,
                error: false
            });
            if ((typeof id === "string") && (id != artist.id)) {
                spotifyApi
                    .getArtist(id)
                    .then((data) => {
                        getTopTracks(data.body.id).then((tracks) => {
                            getAlbums(data.body.id, 0, tracks, data.body).then();
                        })
                    })
                    .catch(error => {
                        console.log(error);
                        setArtist({
                            ...artist,
                            error: true
                        });
                    })
            }
        }
    }, [router, spotifyApi])
    return (
        (artist.info) ? <AudioPage info={artist.info} error={artist.error} type={"artist"}>
            <div className={"flex flex-col text-white space-y-1"}>
                <p className={"pl-8 text-2xl md:text-3xl xl:text-5xl font-bold z-[5]"}>Top tracks</p>
            </div>
            <Songs playlist={artist.topTracks}/>
            <div className={"flex flex-col text-white space-y-1"}>
                <p className={"pl-8 text-2xl md:text-3xl xl:text-5xl font-bold z-[5]"}>Albums</p>
            </div>
            <ArtistAlbums>
                {artist.albums?.map((album) => <CollectionCell key={album.id + "_cell"} collection={album}/>)}
            </ArtistAlbums>
        </AudioPage> : <div/>
    );
};

export default Artist;