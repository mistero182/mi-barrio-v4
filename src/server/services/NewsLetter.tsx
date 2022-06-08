import {responseError, responseSuccess} from "../globalResponse";

const COLLECTION = "newsletters"

const insertDocument = async (data: any, db: any) => {
    try {
        const prev = await db.collection(COLLECTION).findOne({email: data.email})
        if (prev) {
            return responseError('Email already registered')
        } else {
            await db.collection(COLLECTION).insertOne(data)
            return responseSuccess('Newsletter saved successfully')
        }
    } catch (e) {
        return response(null, e.message)
    }
}

const findAll = async (db: any) => {
    const data = await db.collection(COLLECTION).findAll()
    return responseSuccess(data)
}

export {insertDocument, findAll}