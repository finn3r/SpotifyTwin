import type {NextPage} from 'next'
import SideBar from "../components/SideBar";
import Center from "../components/Center";
import Player from "../components/Player";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";

const Home: NextPage = () => {
    return (
        <div className={"bg-black h-screen overflow-hidden"}>
            <main className={"flex"}>
                <SideBar/>
                <Center/>
            </main>
            <div className={"sticky bottom-0"}>
                <Player/>
            </div>
        </div>
    )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    return{
        props:{
            session
        }
    }
}