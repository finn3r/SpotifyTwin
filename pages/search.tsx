import React, {lazy, Suspense, useEffect, useState} from 'react';
import useDebounce from "../hooks/useDebounce";
import useSpotify from "../hooks/useSpotify";
import {useRecoilState} from "recoil";
import {titleAtom} from "../Atoms/titleAtom";
import Spinner from "../components/Spinner";

const Cell = lazy(() => import("../components/Collection/Cell"));
const Songs = lazy(() => import("../components/Songs"));

const Search = () => {
    const [, setTitle] = useRecoilState(titleAtom);
    const spotifyApi = useSpotify();
    const [value, setValue] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [searchResults, setSearchResults] = useState<SpotifyApi.SearchResponse>();
    const debouncedValue = useDebounce<string>(value, 250);
    const cellMinWidth: number = 250;
    const [columnCount, setColumnCount] = React.useState(0);
    const widthHandler = () => {
        (columnCount !== Math.round(window.innerWidth / cellMinWidth)) ? setColumnCount(Math.round(window.innerWidth / cellMinWidth)) : null
    };

    useEffect(() => {
        window.addEventListener("resize", widthHandler);
        setColumnCount(Math.round(window.innerWidth / cellMinWidth));
        return () => {
            window.removeEventListener("resize", widthHandler);
        }
    }, []);

    const SearchRequest = async () => {
        try {
            setIsFetching(true);
            const results = await spotifyApi.search(debouncedValue, ["artist", "track", "album"], {limit: 10}).then(data => data.body);
            setSearchResults(results);
        } catch (e) {
            console.log(e);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (debouncedValue) {
            setTitle(`Search:${debouncedValue} - Spotify tween`);
            SearchRequest().then();
        } else {
            setTitle("Search - Spotify tween")
            setSearchResults(undefined);
        }
    }, [debouncedValue]);

    return (
        <div className={"w-full h-screen bg-[#121212]"}>
            <div className={"w-full flex items-center m-5"}>
                <input value={value}
                       onChange={value => setValue(value.target.value)}
                       placeholder={"Artist, track or album"}
                       type="text"
                       className={"p-5 w-[calc(100%-13rem)] h-10 rounded-full bg-white border-gray-300 border-2 outline-none"}
                />
            </div>
            {((searchResults?.tracks?.total !== 0 || searchResults?.artists?.total !== 0 || searchResults?.albums?.total !== 0) && searchResults) ?
                <Suspense fallback={<Spinner/>}>
                    <div className={"pb-36 h-screen scrollbar-hide overflow-y-scroll"}>
                        <p className={"flex flex-row space-x-4 text-white text-xl md:text-2xl xl:text-3xl font-bold m-5"}>{searchResults.tracks?.items.length !== 0 ? "Tracks" : "Tracks not found"}</p>
                        <Songs playlist={searchResults.tracks?.items.slice(0, columnCount)}/>
                        <p className={"flex flex-row space-x-4 text-white text-xl md:text-2xl xl:text-3xl font-bold m-5"}>{searchResults.artists?.items.length !== 0 ? "Artists" : "Artists not found"}</p>
                        <div
                            className={"auto-rows-min " + (columnCount !== 0 ? "grid" : "hidden")}
                            style={{gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`}}>
                            {searchResults.artists?.items.slice(0, columnCount).map(artist =>
                                <Cell key={artist.id + "_cell"} collection={artist}/>)}
                        </div>
                        <p className={"flex flex-row space-x-4 text-white text-xl md:text-2xl xl:text-3xl font-bold m-5"}>{searchResults.albums?.items.length !== 0 ? "Albums" : "Albums not found"}</p>
                        <div
                            className={"auto-rows-min " + (columnCount !== 0 ? "grid" : "hidden")}
                            style={{gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`}}>
                            {searchResults.albums?.items.slice(0, columnCount).map(album =>
                                <Cell key={album.id + "_cell"} collection={album}/>)}
                        </div>
                    </div>
                </Suspense>
                :
                debouncedValue && (!isFetching)
                    ?
                    <p className={"flex flex-row space-x-4 text-white text-xl md:text-2xl xl:text-3xl font-bold m-5"}>Nothing
                        was found</p>
                    :
                    null}
        </div>
    );
};

export default Search;