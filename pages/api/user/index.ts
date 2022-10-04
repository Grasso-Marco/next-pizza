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

    switch (request.method) {
        case "GET":
            try {
                const allUsers = await UserModel.find()
                response.status(200).json(allUsers)
            } catch (error) {
                response.status(500).json({errorMessage: (error as Error).message})
            }
            break
        case "POST":
            try {
                const newUser = await UserModel.create({
                    email: request.body.email,
                    password: request.body.password,
                    name: request.body.name,
                    surname: request.body.surname,
                    address: {
                        country: request.body.address.country,
                        state: request.body.address.state,
                        city: request.body.address.city,
                        postalCode: request.body.address.postalCode,
                        street: request.body.address.street,
                        houseNumber: request.body.address.houseNumber
                    }
                });

                response.status(201).json(newUser)
            } catch (error) {
                response.status(400).json({errorMessage: (error as Error).message})
            }
            break
        default:
            response.status(404).json({errorMessage: "Not found!"})
    }
}
