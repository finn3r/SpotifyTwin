import React from 'react';

const MenuButton = (props:{focus:boolean, changeFocus(state:boolean):void}) => {
    return (
        <button
            className={`absolute top-5 right-20 z-[60] sm:hidden`}
            onClick={() => props.changeFocus(!props.focus)}
        >
            <div
                className={"flex flex-col rounded-3xl items-center opacity-90 cursor-pointer"}>
                <div className={"flex rounded-3xl bg-black space-x-3 flex-row items-center p-1 text-white z-50"}>
                    <div className={`w-10 h-10 flex flex-col justify-around items-center p-2 relative`}>
                        <hr className={`w-[80%] transition-all duration-300 ${props.focus ? "rotate-45 absolute" : ""}`}/>
                        <hr className={`w-[80%] transition-all duration-300 ${props.focus ? "hidden" : "block"}`}/>
                        <hr className={`w-[80%] transition-all duration-300 ${props.focus ? "rotate-[-45deg] absolute" : ""}`}/>
                    </div>
                </div>
            </div>
        </button>
    );
};

export default MenuButton;