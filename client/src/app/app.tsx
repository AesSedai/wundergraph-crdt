import { FC } from "react"
import { SWRConfig } from "swr"
import { MainPage } from "../pages/main/MainPage"
import Background from "./background"

const App: FC = () => {
    console.log("rendering app")
    return (
        <SWRConfig>
            <Background />
            <MainPage />
        </SWRConfig>
    )
}

export default App
