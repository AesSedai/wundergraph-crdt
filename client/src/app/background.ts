import { FC, useEffect } from "react"
import { apply } from "../redux/slices/authorSlice"
import { useAppDispatch, useAppSelector } from "../redux/store/hooks"
import { useSubscription } from "../utils/wundergraph"

const Background: FC = () => {
    const dispatch = useAppDispatch()
    const sv = useAppSelector((state) => state.author.sv)

    console.log("background sv", sv)

    const { data, error } = useSubscription({
        operationName: "CrdtAuthors",
        input: { limit: 100, sv: sv }
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
