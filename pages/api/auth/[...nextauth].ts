import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import mongodbConnect from "../../../util/mongodb"
import UserModel, {IUser} from "../../../models/User"
import {Document} from "mongoose"

export default NextAuth({
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            // The name to display on the sign-in form (e.g. "Sign in with...")
            name: "Credentials",
            type: "credentials",
            // The credentials are used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            /*credentials: {
                email: {label: "E-mail", type: "email"},
                password: {label: "Password", type: "password"}
            },*/
            credentials: {},
            async authorize(credentials, req) {
                // Connect to MongoDB
                await mongodbConnect()

                // Destructure credentials
                const {email, password} = credentials as {email: string, password: string}

                // Find user by E-mail
                const user: IUser & {_id: string} | null = await UserModel.findOne({email: email})

                // Check if the user exists
                if(user === null) throw new Error("User document does not exist!")

                // Test if password is correct
                if(await user.validatePassword(password)) {
                    console.log("Login userData: " + JSON.stringify({ id: user._id, name: user.name + " " + user.surname, email: user.email }))
                    return { id: user._id, name: user.name + " " + user.surname, email: user.email }
                } else {
                    throw new Error("Wrong credentials!")
                }
            }
        })
    ],
    pages: {
        signIn: "../../auth/Login"
    }
})