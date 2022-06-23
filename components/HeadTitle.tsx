import React from 'react';
import Head from "next/head";
import {useRecoilValue} from "recoil";
import {titleAtom} from "../Atoms/titleAtom";

const HeadTitle = () => {
    const title = useRecoilValue(titleAtom);
    return (
        <Head>
            <title>
                {title ?? "Spotify tween"}
            </title>
        </Head>
    );
};

export default HeadTitle;