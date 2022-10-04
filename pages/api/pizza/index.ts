// noinspection JSUnusedGlobalSymbols

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {IPizza} from "../../../models/Pizza"
import mongodbConnect from "../../../util/mongodb"
import PizzaModel from "../../../models/Pizza"

export default async function handlePizzaRequests(
    request: NextApiRequest,
    response: NextApiResponse<IPizza | IPizza[] | { errorMessage: string }>
) {
    await mongodbConnect()

    switch (request.method) {
        case "GET":
            try {
                const allPizza = await PizzaModel.find()
                response.status(200).json(allPizza)
            } catch (error) {
                response.status(500).json({errorMessage: (error as Error).message})
            }
            break
        case "POST":
            try {
                const newPizza = await PizzaModel.create({
                    name: request.body.name,
                    price: request.body.price
                });

                response.status(201).json(newPizza)
            } catch (error) {
                response.status(400).json({errorMessage: (error as Error).message})
            }
            break
        default:
            response.status(404).json({errorMessage: "Not found!"})
    }
}
