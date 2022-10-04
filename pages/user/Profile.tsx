import type {NextPage} from "next"
import {useSession} from "next-auth/react";
import {useEffect} from "react";
import {useRouter} from "next/router";


const Profile: NextPage = () => {
    const router = useRouter();
    const {status, data} = useSession();

    useEffect(() => {
        if(status === "unauthenticated") router.replace("../auth/Login").then(_ => {})
    }, [router, status])

    if(status === "authenticated") {
        return (
            <div>
                {JSON.stringify(data)}
            </div>
        );
    } else {
        return (
            <div>
                Loading...
            </div>
        );
    }

};

export default Profile;