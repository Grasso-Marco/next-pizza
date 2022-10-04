// noinspection JSUnusedGlobalSymbols

import type {NextApiRequest, NextApiResponse} from 'next'
import {IPizza} from "../../../models/Pizza"
import mongodbConnect from "../../../util/mongodb"
import PizzaModel from "../../../models/Pizza"

export default async function handlePizzaRequests(
    request: NextApiRequest,
    response: NextApiResponse<IPizza | IPizza[] | { errorMessage: string }>
) {
    await mongodbConnect()

    let currentPizza
    try {
        currentPizza = await PizzaModel.findById(request.query.id)
    } catch (error) {
        if (error instanceof Error) response.status(500).json({errorMessage: error.message})
    }

    if (currentPizza) {
        switch (request.method) {
            case "GET":
                response.status(200).json(currentPizza)
                break
            case "PUT":
                currentPizza.name = request.body.name
                currentPizza.price = request.body.price

                try {
                    const updatedPizza = await currentPizza.save()
                    response.json(updatedPizza)
                } catch (error) {
                    response.status(400).json({errorMessage: (error as Error).message})
                }
                break
            case "DELETE":
                try {
                    const deletedPizza = await currentPizza.delete()
                    response.json(deletedPizza);
                } catch (error) {
                    response.status(500).json({errorMessage: (error as Error).message})
                }
                break
            default:
                response.status(404).json({errorMessage: "Not found!"})
        }
    } else {
        response.status(404).json({errorMessage: "Cannot find pizza!"})
    }
}