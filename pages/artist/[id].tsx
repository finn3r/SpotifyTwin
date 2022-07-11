import React, {useEffect, useState} from 'react';
import useSpotify from "../../hooks/useSpotify";
import {useRouter} from "next/router";
import CollectionCell from "../../components/Collection/Cell";
import {useRecoilState} from "recoil";
import {titleAtom} from "../../Atoms/titleAtom";
import Spinner from "../../components/Spinner";
import {useSession} from "next-auth/react";
import AudioPage from "../../components/AudioPage";
import ArtistAlbums from "../../components/ArtistAlbums";
import Songs from "../../components/Songs";

const Artist = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const router = useRouter();
    const [artist, setArtist] = useState<{ id: string, info: undefined | SpotifyApi.SingleArtistResponse, status: string, topTracks: SpotifyApi.TrackObjectFull[], albums: SpotifyApi.AlbumObjectSimplified[] }>({
        id: "",
        info: undefined,
        topTracks: [],
        albums: [],
        status: "pending",
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
                topTracks,
                info,
                id,
                albums,
                status: "success"
            });
        } catch (e) {
            setArtist({
                ...artist,
                status: "error"
            });
        }
    };

    useEffect(() => {
        setTitle(artist.info?.name ? (artist.info?.name + " - Artist - Spotify tween") : "Spotify tween");
    }, [artist.info]);

    useEffect(() => {
        const {id} = router.query;
        if (spotifyApi.getAccessToken() && (id !== artist.id)) {
            setArtist({
                ...artist,
                status: "pending"
            });
            if (typeof id === "string") {
                getArtist(id).then();
            } else setArtist({...artist, status: "error"});
        }
    }, [router, spotifyApi, session]);

    if(artist.status === "pending") return (<Spinner/>);

    return (
        <AudioPage info={artist.info} error={artist.status === "error"} type={"artist"}>
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
    );
};

export default Artist;