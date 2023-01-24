import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { TreeItem, TreeView } from "@mui/lab"
import { Box, Button, Stack, Typography } from "@mui/material"
import { FC, useState } from "react"
import { useAppSelector } from "../../redux/store/hooks"

export const AuthorCrdtSub: FC = () => {
    const [expanded, setExpanded] = useState<string[]>([])

    const { data } = useAppSelector((state) => state.author.response)
    const error = useAppSelector((state) => state.author.error)
    const [lastTransferred, transferred] = useAppSelector((state) => [
        state.author.lastTransferred,
        state.author.transferred
    ])

    console.log("data", data)

    //   operationName: OperationName;
    //   subscribeOnce?: boolean;
    //   resetOnMount?: boolean;
    //   enabled?: boolean;
    //   input?: Input;
    //   onSuccess?(response: ClientResponse<Data>): void;
    //   onError?(error: Error): void;

    if (error != null || data == null) {
        if (error != null) {
            console.log("errors", error)
        }
        return null
    }

    const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
        setExpanded(nodeIds)
    }

    const handleExpandClick = () => {
        if (data != null && data.hasura_authors != null) {
            const authorIds = data.hasura_authors.map((author: any) => author.id)
            setExpanded((oldExpanded) => (oldExpanded.length === 0 ? authorIds : []))
        }
    }

    return (
        <Box display="flex" sx={{ flex: "1 0 100%" }}>
            <Stack sx={{ width: "100%" }}>
                <Typography variant="h4" align="center">
                    CRDT Subscription
                </Typography>
                <Box sx={{ my: 1 }}>
                    <Typography>Last data: {lastTransferred} bytes</Typography>
                    <Typography>Total data: {transferred} bytes</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Button onClick={handleExpandClick}>{expanded.length === 0 ? "Expand all" : "Collapse all"}</Button>
                </Box>
                <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    onNodeToggle={handleToggle}
                    expanded={expanded}>
                    {data.hasura_authors.map((author: any) => (
                        <TreeItem key={author.id} nodeId={author.id} label={author.name ?? ""}>
                            {author.books.map((book: any) => (
                                <TreeItem key={book.id} nodeId={book.id} label={book.title ?? ""}></TreeItem>
                            ))}
                        </TreeItem>
                    ))}
                </TreeView>
                <Box sx={{ my: 1 }}>
                    <pre>{JSON.stringify(data.hasura_authors, null, 2)}</pre>
                </Box>
            </Stack>
        </Box>
    )
}
