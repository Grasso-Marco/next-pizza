import type {NextPage} from "next"
import {PageContentBoxMinHeight} from "../../components/PageContentBox";
import {Alert, Box, Button, FormLabel, MenuItem, Paper, Select, Stack, TextField, Typography} from "@mui/material";
import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import axiosInstance from "../../config/AxiosConfig";
import {signIn} from "next-auth/react";

interface RegisterInformation {
    name: string,
    surname: string,
    email: string,
    address: {
        country: string,
        state: string,
        city: string,
        postalCode: string,
        street: string,
        houseNumber: string
    },
    password: string
}

const initialRegisterFormState: RegisterInformation = {
    name: "",
    surname: "",
    email: "",
    address: {
        country: "",
        state: "",
        city: "",
        postalCode: "",
        street: "",
        houseNumber: ""
    },
    password: ""
}

const countries: { [key: string]: string[] } = {
    "Germany": [
        "Baden-Württemberg",
        "Bayern",
        "Berlin",
        "Brandenburg",
        "Bremen",
        "Hamburg",
        "Hessen",
        "Mecklenburg-Vorpommern",
        "Niedersachsen",
        "Nordrhein-Westfalen",
        "Rheinland-Pfalz",
        "Saarland",
        "Sachsen",
        "Sachsen-Anhalt",
        "Schleswig-Holstein"
    ],
    "USA": [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming"
    ]
}

const Register: NextPage = () => {
    const {t} = useTranslation(["auth"]);
    const [formData, setFormData] = useState<RegisterInformation>(initialRegisterFormState)
    const [confirmPassword, setConfirmPassword] = useState<string>("")

    const [currentErrorMessage, setCurrentErrorMessage] = useState<string>("")
    const formTitleRef = useRef<HTMLDivElement>(null)

    const [successfulRegister, setSuccessfulRegister] = useState<boolean>(false)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setCurrentErrorMessage("")

        const clientFormValidationList: { test: boolean, errorMessage: string }[] = [
            {
                test: /\d/.test(formData.name),
                errorMessage: "Name field may not contain numbers!"
            },
            {
                test: formData.surname.match(/\d/) !== null,
                errorMessage: "Surname field may not contain numbers!"
            },
            {
                // Source: https://www.section.io/engineering-education/password-strength-checker-javascript/
                test: formData.password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?=.{8,})/) === null,
                errorMessage: "Please use a minimum eight character long password with at least one upper and lower case letter, one number and one special character!"
            }
        ]

        for (const validation of clientFormValidationList) {
            if (validation.test) {
                setCurrentErrorMessage(validation.errorMessage)
                formTitleRef.current?.scrollIntoView()
                return
            }
        }

        /*console.log("Register form information: " + JSON.stringify(formData))*/

        try {
            await axiosInstance.post("/api/user", formData)
            setSuccessfulRegister(true)
            await signIn("credentials", {email: formData.email, password: formData.password, callbackUrl: "/"})
        } catch (error) {
            console.error((error as Error).message)
            setCurrentErrorMessage("Registration failed!")
            formTitleRef.current?.scrollIntoView()
        }
    }

    const errorMessage = currentErrorMessage !== "" ?
        <Alert variant="filled" severity="error" sx={{margin: "1vh 0"}}>
            {currentErrorMessage}
        </Alert> : <></>

    const registerForm = <Box ref={formTitleRef} sx={{width: {xs: "90%", md: "50%"}}}>
        <Typography variant="h3" sx={{textAlign: "center"}}>{t("Register")}</Typography>
        <br/>
        {errorMessage}
        <form onSubmit={(event) => handleSubmit(event)}>
            <Stack direction="column" spacing="2vh">
                <FormLabel htmlFor="name">{t("Name")}</FormLabel>
                <TextField id="name" type="text" value={formData.name} variant="outlined" required
                           onChange={(event) => setFormData({...formData, name: event.target.value})}/>
                <FormLabel htmlFor="surname">{t("Surname")}</FormLabel>
                <TextField id="surname" type="text" value={formData.surname} variant="outlined" required
                           onChange={(event) => setFormData({...formData, surname: event.target.value})}/>

                <FormLabel htmlFor="country-select">{t("Country")}</FormLabel>
                <Select
                    labelId="country-select-label"
                    id="country-select"
                    value={formData.address.country}
                    label=""
                    onChange={(event) => setFormData({
                        ...formData,
                        address: {...formData.address, country: event.target.value}
                    })}
                >
                    {Object.keys(countries).map((country, index) => (
                        <MenuItem key={index} value={country}>{country}</MenuItem>
                    ))}
                </Select>

                <FormLabel htmlFor="state-select">{t("State")}</FormLabel>
                <Select
                    labelId="state-select-label"
                    id="state-select"
                    value={formData.address.state}
                    label=""
                    onChange={(event) => setFormData({
                        ...formData,
                        address: {...formData.address, state: event.target.value}
                    })}
                >
                    {countries[formData.address.country]?.map((state, index) => (
                        <MenuItem key={index} value={state}>{state}</MenuItem>
                    ))}
                </Select>

                <FormLabel htmlFor="city">{t("City")}</FormLabel>
                <TextField id="city" type="text" value={formData.address.city}
                           variant="outlined" required
                           onChange={(event) => setFormData({
                               ...formData,
                               address: {...formData.address, city: event.target.value}
                           })}/>
                <FormLabel htmlFor="postalCode">{t("PostalCode")}</FormLabel>
                <TextField id="postalCode" type="text" value={formData.address.postalCode}
                           variant="outlined" required
                           onChange={(event) => setFormData({
                               ...formData,
                               address: {...formData.address, postalCode: event.target.value}
                           })}/>
                <FormLabel htmlFor="street">{t("Street")}</FormLabel>
                <TextField id="street" type="text" value={formData.address.street}
                           variant="outlined" required
                           onChange={(event) => setFormData({
                               ...formData,
                               address: {...formData.address, street: event.target.value}
                           })}/>
                <FormLabel htmlFor="houseNumber">{t("HouseNumber")}</FormLabel>
                <TextField id="houseNumber" type="text" value={formData.address.houseNumber}
                           variant="outlined" required
                           onChange={(event) => setFormData({
                               ...formData,
                               address: {...formData.address, houseNumber: event.target.value}
                           })}/>

                <FormLabel htmlFor="email">{t("E-mail")}</FormLabel>
                <TextField id="email" type="email" value={formData.email} variant="outlined" required
                           onChange={(event) => setFormData({...formData, email: event.target.value})}/>

                <FormLabel htmlFor="password">{t("Password")}</FormLabel>
                <TextField id="password" type="password" value={formData.password}
                           variant="outlined" required
                           onChange={(event) => setFormData({...formData, password: event.target.value})}/>
                <FormLabel htmlFor="confirmPassword">{t("ConfirmPassword")}</FormLabel>
                <TextField id="confirmPassword" type="password" value={confirmPassword}
                           variant="outlined" required
                           onChange={(event) => setConfirmPassword(event.target.value)}
                           error={formData.password !== confirmPassword}
                           helperText={formData.password !== confirmPassword ? "Passwords don't match!" : ""}/>

                <Button type="submit" color="primary" variant="contained">{t("Submit")}</Button>
            </Stack>
        </form>
    </Box>

    const successMessage = <Alert variant="filled" severity="success">
        Registration successful!
    </Alert>

    return (
        <PageContentBoxMinHeight sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "2vh",
            paddingBottom: "2vh"
        }}>
            <Paper sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: "3vh 3vw",
                width: "80%"
            }} elevation={6}>
                {successfulRegister ? successMessage : registerForm}
            </Paper>
        </PageContentBoxMinHeight>
    );
};

export default Register;