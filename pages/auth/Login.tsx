import type {NextPage} from "next"
import PageContentBox from "../../components/PageContentBox";
import {Button, FormLabel, Paper, Stack, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {signIn} from "next-auth/react";

const Login: NextPage = () => {
    const {t} = useTranslation(["auth"]);
    const [formData, setFormData] = useState<{email: string, password: string}>({email: "", password: ""});

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        await signIn("credentials", {...formData, callbackUrl: "/"})
    }

    return (
        <PageContentBox sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Paper sx={{padding: "3vh 3vw"}} elevation={6}>
                <Typography variant="h3" sx={{textAlign: "center"}}>{t("Login")}</Typography>
                <br/>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <Stack direction="column" spacing="2vh">
                        <FormLabel htmlFor="email">{t("E-mail")}</FormLabel>
                        <TextField id="email" type="email" label="" value={formData.email} variant="outlined"
                                   onChange={(event) => setFormData({...formData, email: event.target.value})}/>
                        <FormLabel htmlFor="password">{t("Password")}</FormLabel>
                        <TextField id="password" type="password" label="" value={formData.password} variant="outlined"
                                   onChange={(event) => setFormData({...formData, password: event.target.value})}/>
                        <Button type="submit" color="primary" variant="contained">{t("Submit")}</Button>
                    </Stack>
                </form>
            </Paper>
        </PageContentBox>
    );
};

export default Login;