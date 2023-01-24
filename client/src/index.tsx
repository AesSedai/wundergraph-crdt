import CssBaseline from "@mui/material/CssBaseline"
import {
    // unstable_createMuiStrictModeTheme as createMuiTheme,
    createTheme,
    ThemeProvider
} from "@mui/material/styles"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import App from "./app/app"
import "./index.scss"
import { persistor, store } from "./redux/store/store"

const darkTheme = createTheme({
    palette: {
        mode: "dark"
    }
})

const container = document.getElementById("root")
if (container == null) {
    throw new Error("Container cannot be null")
}
const root = createRoot(container)

root.render(
    // <StrictMode>
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </ThemeProvider>
    // </StrictMode>,
)
