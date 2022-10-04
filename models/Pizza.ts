import {model, models, Schema} from "mongoose"

export interface IPizza {
    name: string,
    price: number
}

const pizzaSchema = new Schema<IPizza>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    }
})

const PizzaModel = models.Pizza ?? model<IPizza>("Pizza", pizzaSchema, "pizza")

export default PizzaModel