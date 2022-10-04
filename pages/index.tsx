import type {NextPage} from 'next'
import PageContentBox from "../components/PageContentBox";
import {Box} from "@mui/material";

const Home: NextPage = () => {
    return (
        <PageContentBox>
            <Box sx={{
                height: "40vh",
                width: "100%",
                backgroundImage: "url('/images/PizzaStartPage.jpg')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
            }}>
                Test
            </Box>
        </PageContentBox>
    )
}

export default Home
