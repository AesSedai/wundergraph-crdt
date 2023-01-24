import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { TreeItem, TreeView } from "@mui/lab"
import { Box, Button, Stack, Typography } from "@mui/material"
import { FC, useEffect, useState } from "react"
import { useSubscription } from "../../utils/wundergraph"

export const AuthorSub: FC = () => {
    const [expanded, setExpanded] = useState<string[]>([])
    const [totalData, setTotalData] = useState<number>(0)

    const { data, error } = useSubscription({
        operationName: "SubscribeAuthors",
        input: { limit: 100 }
        // enabled: true,
        // subscribeOnce: true,
        // onSuccess: (response: any) => {
        //     console.log("authorSub: successfully established SubscribeAuthors", response)
        // }
    })

    // console.log("data", data)

    //   operationName: OperationName;
    //   subscribeOnce?: boolean;
    //   resetOnMount?: boolean;
    //   enabled?: boolean;
    //   input?: Input;
    //   onSuccess?(response: ClientResponse<Data>): void;
    //   onError?(error: Error): void;

    useEffect(() => {
        if (data != null && data.hasura_authors != null) {
            setTotalData((prevState) => prevState + JSON.stringify(data.hasura_authors).length)
            // const authorIds = data.hasura_authors.map((author) => author.id)
            // setExpanded(authorIds)
        }
    }, [data])

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
                    Regular Subscription
                </Typography>
                <Box sx={{ my: 1 }}>
                    <Typography>Last data: {JSON.stringify(data.hasura_authors).length} bytes</Typography>
                    <Typography>Total data: {totalData} bytes</Typography>
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
