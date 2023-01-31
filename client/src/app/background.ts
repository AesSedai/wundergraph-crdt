import { FC, useEffect } from "react"
import { apply } from "../redux/slices/authorSlice"
import { useAppDispatch, useAppSelector } from "../redux/store/hooks"
import { useSubscription } from "../utils/wundergraph"

const Background: FC = () => {
    const dispatch = useAppDispatch()
    const sv = useAppSelector((state) => state.author.sv)
    const clientId = useAppSelector((state) => state.author.clientID)
    const guid = useAppSelector((state) => state.author.guid)

    console.log("background sv", sv, "clientId", clientId, "guid", guid)

    const { data, error } = useSubscription({
        operationName: "CrdtAuthors",
        input: { limit: 100, sv: sv, clientId: clientId.toString(), guid: guid }
        // enabled: true,
        // subscribeOnce: true,
        //     onSuccess: useCallback((response: any) => {
        //         console.log("authorSub: successfully established SubscribeAuthors", response)
        //    }, [])
    })

    useEffect(() => {
        console.log("data changed", data)
        if (data != null) {
            // data is technically just a string
            dispatch(apply(data as unknown as string))
        }
    }, [data])

    return null
}

export default Background
