import LoginClient from "./page-client"
import { Suspense } from 'react'

const Login = () => {
    return (
        <Suspense>
            <LoginClient />
        </Suspense>
    )
}

export default Login;
