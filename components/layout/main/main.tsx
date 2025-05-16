'use client';
import {ReactNode} from "react";

interface MainProps {
    children: ReactNode;
}

const Main = ({children}: MainProps) => (
    <main className="flex-grow flex flex-col p-4 xl:px-0 max-w-6xl w-full mx-auto">
        {children}
    </main>
)

export default Main;