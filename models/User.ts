import {Document, model, models, Schema} from "mongoose"
import bcrypt from "bcrypt"

const SALT_WORK_FACTOR = 10

export interface IUser {
    email: string,
    password: string,
    validatePassword(password: string): Promise<boolean>,
    name: string,
    surname: string,
    address: {
        country: string,
        state: string,
        city: string,
        postalCode: string,
        street: string,
        houseNumber: string
    }
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    address: {
        type: Object,
        required: true
    }
})

userSchema.pre<IUser & Document>("save", async function (next) {
    // Get current user
    let user = this

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next()

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)

        // Hash the password using our new salt
        // and override the cleartext password with the hashed one
        user.password = await bcrypt.hash(user.password, salt)

        // Continue with next step
        return next()
    } catch (error) {
        return next(error as Error)
    }
})

userSchema.methods.validatePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const UserModel = models.User || model<IUser>("User", userSchema, "users")

export default UserModel