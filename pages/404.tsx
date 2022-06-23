import React, {useEffect} from 'react';
import {useRecoilState} from "recoil";
import {titleAtom} from "../Atoms/titleAtom";

const Custom404 = () => {
    const [, setTitle] = useRecoilState(titleAtom);

    useEffect(() => {
        setTitle("Spotify tween");
    }, []);

    return (
        <div className={"h-screen w-screen flex justify-center items-center"}>
            <h1 className={"text-white text-2xl md:text-3xl xl:text-5xl font-bold"}>
                Page not found.
            </h1>
        </div>
    );
};

export default Custom404;