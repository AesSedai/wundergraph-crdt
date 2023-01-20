import CssBaseline from "@mui/material/CssBaseline"
import {
    // unstable_createMuiStrictModeTheme as createMuiTheme,
    createTheme,
    ThemeProvider
} from "@mui/material/styles"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import App from "./app/app"
import "./index.scss"
import { persistor, store } from "./redux/store/store"
import * as serviceWorker from "./serviceWorker"

const darkTheme = createTheme({
    palette: {
        mode: "dark"
    }
})

ReactDOM.render(
    // <StrictMode>
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </ThemeProvider>,
    // </StrictMode>,
    document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
