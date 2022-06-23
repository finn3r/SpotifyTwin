import React, {useEffect} from 'react';
import {ClientSafeProvider, getProviders, signIn} from "next-auth/react";
import spotifyLogo from "../public/spotify-logo.svg";
import {GetServerSideProps} from "next";
import {LiteralUnion} from "next-auth/react/types";
import {BuiltInProviderType} from "next-auth/providers";
import {useRecoilState} from "recoil";
import {titleAtom} from "../Atoms/titleAtom";

const Login = (props: { [p: string]: Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider> }) => {
    const [, setTitle] = useRecoilState(titleAtom);

    useEffect(() => {
        setTitle("Login - Spotify tween");
    },[]);

    return (
        <div className={"absolute z-50 flex flex-col items-center bg-black min-h-screen w-full justify-center"}>
            <img src={spotifyLogo} alt="Spotify Logo" className={"w-52 mb-5"}/>
            {Object.values(props.providers).map((provider) => (
                <div key={provider.name}>
                    <button
                        className={"bg-[#18D860] text-white p-5 rounded-full"}
                        onClick={() => signIn(provider.id, {callbackUrl: "/"})}
                    >
                        Login with {provider.name}
                    </button>
                </div>
            ))}
        </div>
    );
};
export default Login;

export const getServerSideProps: GetServerSideProps = async () => {
    const providers: Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider> | null = await getProviders();
    return {
        props: {
            providers,
        }
    };
}