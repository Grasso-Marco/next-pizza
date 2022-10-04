import '../styles/globals.css'
import type {AppProps} from 'next/app'
import * as React from 'react'
import {createTheme, responsiveFontSizes, ThemeOptions, ThemeProvider} from "@mui/material/styles"
import {CssBaseline, StyledEngineProvider} from "@mui/material"
import Head from "next/head"
import NavigationBar from "../components/NavigationBar"
import {SessionProvider} from "next-auth/react"
import {Session} from "next-auth"

export const ColorModeContext = React.createContext({
    toggleColorMode: () => {
    }
})

// Translation files
import english from "../languages/English/English.json"
import german from "../languages/German/German.json"
import englishAuth from "../languages/English/EnglishAuth.json"
import germanAuth from "../languages/German/GermanAuth.json"
import i18next, {Resource} from "i18next"
import {initReactI18next} from "react-i18next"


export interface Language {
    code: string,
    title: string
}

export const languages: Language[] = [
    {code: "en", title: "English"},
    {code: "de", title: "German"}
]

const i18nextResources: Resource = {
    en: {
        translation: english,
        auth: englishAuth
    },
    de: {
        translation: german,
        auth: germanAuth
    }
}

i18next
    .use(initReactI18next)
    .init({
        resources: i18nextResources,
        defaultNS: "translation",
        lng: "en",
        fallbackLng: "en",
        interpolation: {escapeValue: false}
    })
    .then(_ => {
    })

// noinspection JSUnusedGlobalSymbols
export default function MyApp({Component, pageProps}: AppProps<{ session: Session }>) {
    const [mode, setMode] = React.useState<'light' | 'dark'>('dark')

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
            },
        }),
        [],
    )

    let theme = React.useMemo(() => {
            const themeOptionsDark: ThemeOptions = {
                palette: {
                    mode: 'dark',
                    primary: {
                        main: '#f06400',
                    },
                    secondary: {
                        main: '#1786c3',
                    },
                    background: {
                        default: '#121212',
                        paper: '#121212',
                    },
                    warning: {
                        main: '#ff5900',
                    },
                    error: {
                        main: '#d20a0a',
                    }
                }
            }

            const themeOptionsLight: ThemeOptions = {
                palette: {
                    mode: "light",
                    primary: {
                        main: "#f06400",
                    },
                    secondary: {
                        main: "#4658b9",
                    },
                    error: {
                        main: "#d50000",
                    },
                    background: {
                        default: "#fafafa"
                    }
                }
            }

            if (mode === "dark")
                return createTheme(themeOptionsDark)
            else
                return createTheme(themeOptionsLight)
        },
        [mode],
    )

    theme = responsiveFontSizes(theme);

    return (
        <SessionProvider session={pageProps.session}>
            <StyledEngineProvider injectFirst>
                <ColorModeContext.Provider value={colorMode}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline/>
                        <Head>
                            <meta charSet="utf-8"/>
                            <meta name="description" content="NextTs Pizza Delivery Portfolio Project"/>
                            <meta name="viewport" content="width=device-width, initial-scale=1"/>
                            <title>Next Pizza</title>
                            <link rel="icon" href="/favicon.ico"/>
                        </Head>
                        <NavigationBar/>
                        <Component {...pageProps} />
                    </ThemeProvider>
                </ColorModeContext.Provider>
            </StyledEngineProvider>
        </SessionProvider>
    )
}
