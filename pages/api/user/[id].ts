// noinspection JSUnusedGlobalSymbols

import type {NextApiRequest, NextApiResponse} from 'next'
import {IUser} from "../../../models/User"
import mongodbConnect from "../../../util/mongodb"
import UserModel from "../../../models/User"

export default async function handleUserRequests(
    request: NextApiRequest,
    response: NextApiResponse<IUser | IUser[] | { errorMessage: string }>
) {
    await mongodbConnect()

    let currentUser
    try {
        currentUser = await UserModel.findById(request.query.id)
    } catch (error) {
        if (error instanceof Error) response.status(500).json({errorMessage: error.message})
    }

    if (currentUser) {
        switch (request.method) {
            case "GET":
                response.status(200).json(currentUser)
                break
            case "PUT":
                currentUser.email = request.body.email
                currentUser.name = request.body.name
                currentUser.surname = request.body.surname
                currentUser.address = request.body.address

                try {
                    const updatedUser = await currentUser.save()
                    response.json(updatedUser)
                } catch (error) {
                    response.status(400).json({errorMessage: (error as Error).message})
                }
                break
            case "DELETE":
                try {
                    const deletedUser = await currentUser.delete()
                    response.json(deletedUser);
                } catch (error) {
                    response.status(500).json({errorMessage: (error as Error).message})
                }
                break
            default:
                response.status(404).json({errorMessage: "Not found!"})
        }
    } else {
        response.status(404).json({errorMessage: "Cannot find user!"})
    }
}