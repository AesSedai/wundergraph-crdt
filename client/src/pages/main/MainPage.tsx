import { Box, Divider, Grid, Paper, Theme } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { FC } from "react"
import { AuthorCrdtSub } from "./authorCrdtSub"
import { AuthorSub } from "./authorSub"
import { Sidebar } from "./sidebar"

const useStyles = makeStyles<Theme>((theme) => ({
    paper: {
        padding: theme.spacing(2),
        width: "100%",
        display: "flex"
    }
}))

export const MainPage: FC = () => {
    const classes = useStyles()

    return (
        <Grid container spacing={2} p={2} columns={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 12 }}>
            <Grid item xs={4} sm={4} md={4}>
                <Paper className={classes.paper}>
                    <Sidebar />
                </Paper>
            </Grid>
            <Grid item xs={4} sm={6}>
                <Paper className={classes.paper}>
                    <Box display="flex" sx={{ flex: "1 0 50%" }}>
                        <AuthorSub />
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box display="flex" sx={{ flex: "1 0 50%", pl: 2 }}>
                        <AuthorCrdtSub />
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={3}></Grid>
        </Grid>
    )
}
