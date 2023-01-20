import localForage from "localforage"

export const db = localForage.createInstance({
    name: "mydb"
})

export const storage = () => {
    return {
        db,
        getItem: db.getItem,
        setItem: db.setItem,
        removeItem: db.removeItem
    }
}
