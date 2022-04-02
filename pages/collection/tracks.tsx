import React, {useEffect, useState} from 'react';
import Songs from "../../components/Songs";
import useSpotify from "../../hooks/useSpotify";
import {useSession} from "next-auth/react";

const Tracks = () => {
    const {data: session} = useSession();
    const spotifyApi = useSpotify();
    const [tracks, setTracks] = useState<SpotifyApi.SavedTrackObject[]>();

    const getTracks = async () => {
        const tracksArray: SpotifyApi.SavedTrackObject[] = [];
        for (let i = 0; i < 200; i++) {
            const length: number = await spotifyApi.getMySavedTracks({offset: i * 50, limit: 50}).then((data) => {
                tracksArray.push(...data.body.items);
                return data.body.items.length;
            });
            if(length !== 50){
                setTracks(tracksArray);
                break;
            }
        }
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            getTracks().then();
        }
    }, [session, spotifyApi]);

    return (
        <div className={"flex-grow h-screen overflow-y-scroll scrollbar-hide w-full"}>
            {(tracks) ?
                <section
                    className={`flex items-end space-x-7 h-80 text-white p-8`}
                    style={{backgroundImage: `linear-gradient(to bottom, #4c29b0, #000)`}}
                >
                    <img
                        src="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
                        alt=""
                        className={"object-cover h-44 w-44 shadow-2xl"}
                    />
                    <div>
                        <p>PLAYLIST</p>
                        <h1 className={"text-2xl md:text-3xl xl:text-5xl font-bold"}>
                            Saved tracks
                        </h1>
                    </div>
                </section> : <div/>}
            <div>
                <Songs playlist={tracks}/>
            </div>
        </div>
    );
};

export default Tracks;