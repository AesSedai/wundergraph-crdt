import { Box, Divider, Grid, Paper} from "@mui/material"
import { styled } from "@mui/material/styles"
import { FC } from "react"
import { AuthorCrdtSub } from "./authorCrdtSub"
import { AuthorSub } from "./authorSub"
import { Sidebar } from "./sidebar"

const ThemePaper = styled(Paper)(( {theme}) => ({
    padding: theme.spacing(2),
    width: "100%",
    display: "flex"
}))

export const MainPage: FC = () => {
    return (
        <Grid container spacing={2} p={2} columns={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 12 }}>
            <Grid item xs={4} sm={4} md={4}>
                <ThemePaper>
                    <Sidebar />
                </ThemePaper>
            </Grid>
            <Grid item xs={4} sm={6}>
                <ThemePaper>
                    <Box display="flex" sx={{ flex: "1 0 50%" }}>
                        <AuthorSub />
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box display="flex" sx={{ flex: "1 0 50%", pl: 2 }}>
                        <AuthorCrdtSub />
                    </Box>
                </ThemePaper>
            </Grid>
            <Grid item xs={3}></Grid>
        </Grid>
    )
}
