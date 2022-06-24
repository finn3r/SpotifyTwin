import React, {lazy, Suspense, useEffect, useState} from 'react';
import useSpotify from "../../hooks/useSpotify";
import {useRouter} from "next/router";
import CollectionCell from "../../components/Collection/Cell";
import {useRecoilState} from "recoil";
import {titleAtom} from "../../Atoms/titleAtom";
import Spinner from "../../components/Spinner";

const AudioPage = lazy(() => import("../../components/AudioPage"));
const ArtistAlbums = lazy(() => import("../../components/ArtistAlbums"));
const Songs = lazy(() => import("../../components/Songs"));

const Artist = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const spotifyApi = useSpotify();
    const router = useRouter();
    const [artist, setArtist] = useState<{ id: string, info: undefined | SpotifyApi.SingleArtistResponse, error: boolean, topTracks: SpotifyApi.TrackObjectFull[], albums: SpotifyApi.AlbumObjectSimplified[] }>({
        id: "",
        info: undefined,
        error: false,
        topTracks: [],
        albums: []
    });

    const getArtistAlbums = async (id: string) => {
        let fetching = true;
        let offset = 0;
        const albums: SpotifyApi.AlbumObjectSimplified[] = [];
        do {
            const newAlbums = await spotifyApi.getArtistAlbums(id, {offset, limit: 50}).then(data => data.body);
            albums.push(...newAlbums.items);
            if (newAlbums.next) {
                offset = Number(newAlbums.next.split("offset=")[1].split("&")[0]);
            } else fetching = false;
        } while (fetching);
        return albums
    };

    const getArtist = async (id: string) => {
        try {
            const profileCountry = await spotifyApi.getMe().then(data => data.body.country);
            const info = await spotifyApi.getArtist(id).then(data => data.body);
            const albums = await getArtistAlbums(id);
            const topTracks = await spotifyApi.getArtistTopTracks(id, profileCountry).then(data => data.body.tracks);
            setArtist({
                ...artist,
                topTracks,
                info,
                id,
                albums
            });
        } catch (e) {
            console.log(e);
            setArtist({
                ...artist,
                error: true
            });
        }
    };

    useEffect(() => {
        setTitle(artist.info?.name ? (artist.info?.name + " - Artist - Spotify tween") : "Spotify tween");
    }, [artist.info]);

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            const {id} = router.query;
            setArtist({
                ...artist,
                error: false
            });
            if ((typeof id === "string") && (id != artist.id)) {
                getArtist(id).then();
            }
        }
    }, [router, spotifyApi.getAccessToken()]);

    return (
        (artist.info) ?
            <Suspense fallback={<Spinner/>}>
                <AudioPage info={artist.info} error={artist.error} type={"artist"}>
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
                </AudioPage>
            </Suspense> : <div/>
    );
};

export default Artist;