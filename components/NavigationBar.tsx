import Link from "next/link";
import * as React from "react";
import {
    AppBar, Avatar, Box,
    Button,
    IconButton,
    Menu,
    MenuItem, Stack,
    Toolbar, Tooltip,
    Typography, useTheme
} from "@mui/material";
import {Menu as MenuIcon, Translate as TranslateIcon, AccountCircle as AccountCircleIcon} from "@mui/icons-material";
import styles from "./NavigationBar.module.scss";
import i18next from "i18next"
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import {ColorModeContext} from "../pages/_app";
import {languages} from "../pages/_app"
import {useTranslation} from "react-i18next";
import {signIn, signOut, useSession} from "next-auth/react";

interface Page {
    url: string,
    title: string,
    inAppBar: boolean
}

const pages: Page[] = [
    {url: "/", title: "Main", inAppBar: true},
    {url: "/auth/Register", title: "Register", inAppBar: false},
    {url: "/auth/Login", title: "Login", inAppBar: false}
]

const userSettings = [
    {title: "Profile", href: "/user/Profile"}
];

export default function NavigationBar() {
    const {status, data} = useSession();

    const {t} = useTranslation();
    const [subMenuAnchor, setSubMenuAnchor] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);

    const [language, setLanguage] = React.useState("en");
    const [langAnchor, setLangAnchor] = React.useState<null | HTMLElement>(null);

    const handleLanguageChange = (newLanguage: string) => {
        if (newLanguage !== language) {
            i18next.changeLanguage(newLanguage).then(() => {
                setLanguage(newLanguage);
                setLangAnchor(null);
            });
        }
    };

    const userProfileMenu = <Box sx={{flexGrow: 0}}>
        <Tooltip title="Open settings">
            <IconButton onClick={(event) => setAnchorElUser(event.currentTarget)} sx={{p: 0}}>
                <Avatar alt="Profile image"
                        sx={{backgroundColor: theme.palette.primary.main}}><AccountCircleIcon/></Avatar>
            </IconButton>
        </Tooltip>
        <Menu
            sx={{mt: '45px'}}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
        >
            {userSettings.map((setting, index) => (
                <MenuItem key={index} onClick={() => setAnchorElUser(null)}>
                    <Link href={setting.href}><Typography textAlign="center">{setting.title}</Typography></Link>
                </MenuItem>
            ))}
            <MenuItem onClick={() => {
                setAnchorElUser(null)
                signOut({callbackUrl: "/"})
            }}>
                <Typography textAlign="center">Logout</Typography>
            </MenuItem>
        </Menu>
    </Box>

    const registerLoginButtons = <Stack direction="row" spacing="1vw" sx={{display: {xs: "none", md: "flex"}}}>
        <Button color="secondary" variant="contained" sx={{textTransform: "none"}}>
            <Link href="auth/Register">Register</Link>
        </Button>
        <Button color="secondary" variant="contained" sx={{textTransform: "none"}}
                onClick={() => signIn()}>Login</Button>
    </Stack>

    return (
        <>
            <AppBar position="static" enableColorOnDark>
                <Toolbar>
                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="main-sub-menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={(event) => setSubMenuAnchor(event.currentTarget)}
                            sx={{color: "white"}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={subMenuAnchor}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(subMenuAnchor)}
                            onClose={() => setSubMenuAnchor(null)}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            {pages
                                .map((page, index) => (
                                    <MenuItem key={index} onClick={() => setSubMenuAnchor(null)}>
                                        <Link key={index} href={page.url} style={{textDecoration: "none"}}>
                                            <Typography key={index} textAlign="center" sx={{
                                                textDecoration: "none",
                                                color: theme.palette.text.primary
                                            }}>
                                                {t(page.title as string)}
                                            </Typography>
                                        </Link>
                                    </MenuItem>
                                ))}
                        </Menu>
                    </Box>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            {pages
                                .filter((page) => page.inAppBar)
                                .map((page, index) => (
                                    <Link key={index} href={page.url}
                                          className={styles.link}>{t(page.title as string)}</Link>
                                ))}
                        </Typography>
                    </Box>
                    <Button
                        startIcon={<TranslateIcon/>}
                        onClick={(event) => setLangAnchor(event.currentTarget)}
                        className={styles.languageButton}
                    >
                        {t("Language")}
                    </Button>
                    <Menu
                        id="language-submenu"
                        anchorEl={langAnchor}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        open={Boolean(langAnchor)}
                        onClose={() => setLangAnchor(null)}
                    >
                        {languages.map((language, index) => (
                            <MenuItem key={index} onClick={() => handleLanguageChange(language.code)}>
                                {t(language.title)}
                            </MenuItem>
                        ))}
                    </Menu>
                    <IconButton onClick={colorMode.toggleColorMode} sx={{color: "white"}}>
                        {theme.palette.mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
                    </IconButton>
                    {status === "authenticated" ? userProfileMenu : registerLoginButtons}
                </Toolbar>
            </AppBar>
        </>
    );
}