import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const managementAPI = `${process.env.ZITI_CONTROLLER_URL}/edge/management/v1`;

let apiToken = "";

const getToken = async () => {
    const url = `${managementAPI}/authenticate?method=password`;
    const response = await fetch(url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: process.env.ZITI_ADMIN_USERNAME,
                password: process.env.ZITI_ADMIN_PASSWORD,
            })
        }
    );
    const token = (await response.json()).data.token;
    apiToken = token;
}
