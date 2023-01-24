import { Box, Button, Divider, Stack, Theme } from "@mui/material"
import async from "async"
import { last, random, sample } from "lodash"
import { DateTime } from "luxon"
import { FC, useState } from "react"
import { hasura_authors_insert_input } from "../../graphql/models"
import { db } from "../../redux/store/storage"
import { sleep } from "../../utils/sleep"
import { useMutation, useSubscription } from "../../utils/wundergraph"

export const Sidebar: FC = () => {
    const [running, setRunning] = useState<boolean>(false)
    const [actions, setActions] = useState({ total: 100, current: 0 })
    const [actionList, setActionList] = useState<string[]>([])

    const { data, error } = useSubscription({
        operationName: "SubscribeAuthors",
        input: { limit: 100 }
        // onSuccess: (response) => {
        //     console.log("sidebar: successfully established SubscribeAuthors", response)
        // }
    })

    const { trigger: updateAuthorMutation } = useMutation({
        operationName: "UpdateAuthorName"
    })

    const { trigger: updateBookMutation } = useMutation({
        operationName: "UpdateBook"
    })

    const { trigger: addBookMutation } = useMutation({
        operationName: "CreateBook"
    })

    const { trigger: deleteBookMutation } = useMutation({
        operationName: "DeleteBook"
    })

    const { trigger: resetAuthorsMutation } = useMutation({
        operationName: "ResetAuthors"
    })

    const { trigger: seedAuthorsMutation } = useMutation({
        operationName: "SeedAuthors"
    })

    if (error != null || data == null) {
        if (error != null) {
            console.log("errors", error)
        }
        return null
    }

    const updateAuthor = async () => {
        if (data?.hasura_authors != null) {
            const randomAuthor = sample(data.hasura_authors)
            if (randomAuthor != null) {
                const name = `New Author Name ${random(1000, 9999)}`
                const action = `Update authors:${randomAuthor.id} name from ${randomAuthor.name} to ${name}`
                setActionList((prev) => [...prev, action])
                await updateAuthorMutation({
                    id: randomAuthor.id,
                    name: name
                })
            }
        }
    }

    const updateBook = async () => {
        if (data?.hasura_authors != null) {
            const randomAuthor = sample(data.hasura_authors)
            if (randomAuthor != null) {
                const randomBook = sample(randomAuthor.books)
                if (randomBook != null) {
                    const title = `New Book Title ${random(1000, 9999)}`
                    const action = `Update books:${randomBook.id} title from ${randomBook.title} to ${title}`
                    setActionList((prev) => [...prev, action])
                    await updateBookMutation({
                        id: randomBook.id,
                        title: title
                    })
                }
            }
        }
    }

    const addBook = async () => {
        if (data?.hasura_authors != null) {
            const randomAuthor = sample(data.hasura_authors)
            if (randomAuthor != null) {
                const title = `New Book Title ${random(1000, 9999)}`
                const action = `Add book (title ${title}) to authors:${randomAuthor.name}`
                setActionList((prev) => [...prev, action])
                await addBookMutation({
                    book: {
                        author_id: randomAuthor.id,
                        title: title,
                        isbn: `978-${random(1, 9)}-${random(1000, 9999)}-${random(1000, 9999)}-${random(1, 9)}`
                    }
                })
            }
        }
    }

    const deleteBook = async () => {
        if (data?.hasura_authors != null) {
            const randomAuthor = sample(data.hasura_authors)
            if (randomAuthor != null) {
                const randomBook = sample(randomAuthor.books)
                if (randomBook != null) {
                    const action = `Remove books:${randomBook.id} from authors:${randomAuthor.id}`
                    setActionList((prev) => [...prev, action])
                    await deleteBookMutation({
                        id: randomBook.id
                    })
                }
            }
        }
    }

    const randomActions = async () => {
        const ops = [updateAuthor, updateBook, addBook, deleteBook]
        setActions({ total: 100, current: 0 })
        setRunning(true)
        await async.eachSeries(Array.from(Array(100).keys()), async (f: number) => {
            const op = sample(ops)
            if (op != null) {
                await op()
                await sleep(300)
            }
            setActions({ ...actions, current: f })
        })
        setRunning(false)
    }

    const removeAll = async () => {
        await resetAuthorsMutation()
    }

    const seed = async () => {
        const lastAuthorIdx =
            data?.hasura_authors.reduce((acc, author) => {
                const name = author.name || ""
                console.log(
                    "split name",
                    name.split(" "),
                    "last",
                    last(name.split(" ")),
                    "idx",
                    parseInt(last(name.split(" ")) || "1").toString()
                )
                const idx = parseInt(last(name.split(" ")) || "1")
                return acc > idx ? acc : idx || 0
            }, 0) || 0

        console.log("lastAuthorIdx", lastAuthorIdx)

        const a: hasura_authors_insert_input[] = Array.from(Array(3), (_j, i) => {
            return {
                name: `Author ${(i + 1 + lastAuthorIdx).toString().padStart(3, "0")}`,
                books: {
                    data: Array.from(Array(random(1, 5)), (_j, j) => {
                        return {
                            title: `Book ${(i + 1 + lastAuthorIdx) * 1000 + j}`,
                            isbn: `978-${random(1, 9)}-${random(1000, 9999)}-${random(1000, 9999)}-${random(1, 9)}`
                        }
                    })
                }
            }
        })

        await seedAuthorsMutation({ authors: a })
    }

    const resetCache = async () => {
        await db.clear()
        window.location.reload()
    }

    const redo = async () => {
        const t0 = DateTime.utc().toISO()
        const actions = [addBook(), deleteBook()]
        await Promise.all(actions)
        const t1 = DateTime.utc().toISO()
        // console.log("sent at", t0, "receiverd at", t1)
    }

    return (
        <Box display="flex" sx={{ flex: "1 1 100%" }}>
            <Stack sx={{ width: "100%" }}>
                <Button onClick={removeAll}>Remove Authors from Database</Button>
                <Button onClick={resetCache}>Reset web cache and refresh</Button>
                <Divider></Divider>
                <Button onClick={seed}>Add 3 Authors</Button>
                <Button onClick={updateAuthor}>Update Random Author</Button>
                <Button onClick={updateBook}>Update Random Book</Button>
                <Button onClick={addBook}>Add Random Book</Button>
                <Button onClick={deleteBook}>Remove Random Book</Button>
                <Divider></Divider>
                <Button onClick={randomActions} disabled={running}>
                    {running ? `Action ${actions.current} / ${actions.total}` : "Perform 100 Random Actions"}
                </Button>
                <Divider></Divider>
                <Button onClick={redo}>Redo</Button>
                {/* {actionList.map((action) => (
                    <Typography key={action}>{action}</Typography>
                ))} */}
            </Stack>
        </Box>
    )
}
