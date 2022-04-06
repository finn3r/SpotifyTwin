import React from 'react';
import {useRouter} from "next/router";

const PlaylistCell = (props: { playlist: SpotifyApi.PlaylistObjectSimplified }) => {
    const router = useRouter();
    function cutTags(str: string) {
        const regex = /( |<([^>]+)>)/ig;
        return str.replace(regex, " ");
    }
    return (
        <div className={"flex flex-col content-start m-2 bg-[#121212] rounded-xl p-4 hover:cursor-pointer duration-500 hover:bg-[#202020] transition-all"} onClick={() => router.push(`/playlist/${props.playlist.id}`)}>
            <div className={"mb-2 basis-[60%] rounded-md relative pt-[100%]"}>
            {(props.playlist.images?.[0]?.url) ?
                <img alt={""} src={props.playlist.images[0].url} loading="lazy" className={"object-cover w-full h-full absolute top-0 left-0 rounded-md"}/> :
                <svg viewBox="-20 -25 100 100"
                     className="bg-[#2a2a2a] rounded-md w-full h-full absolute top-0 left-0" aria-hidden="true"
                     data-testid="card-image-fallback">
                    <path
                        d="M16 7.494v28.362A8.986 8.986 0 0 0 9 32.5c-4.962 0-9 4.038-9 9s4.038 9 9 9 9-4.038 9-9V9.113l30-6.378v27.031a8.983 8.983 0 0 0-7-3.356c-4.962 0-9 4.038-9 9 0 4.963 4.038 9 9 9s9-4.037 9-9V.266L16 7.494zM9 48.5c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7c0 3.859-3.141 7-7 7zm32-6.09c-3.86 0-7-3.14-7-7 0-3.859 3.14-7 7-7s7 3.141 7 7c0 3.861-3.141 7-7 7z"
                        fill="currentColor" fillRule="evenodd"/>
                </svg>}
            </div>
            <p className={"mb-2 text-white basis-[15%] truncate font-bold"}>{props.playlist.name}</p>
            <p className={"text-gray-500 basis-[25%] line-clamp-2"}>{(props.playlist.description) ? cutTags(props.playlist.description) : ("Автор: " + props.playlist.owner.display_name)}</p>
        </div>
    );
};

export default PlaylistCell;