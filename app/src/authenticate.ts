import { getProfile } from './API';
import Store from './store';

const authenticate = async (email: string) => {
    const token = await Store.get(email);

    const response = await getProfile(token);

    if (response.status === 403) {
        return null;
    }

    if (response.status !== 200) {
        return null;
    }

    if (!response.data.user) {
        return null;
    }

    const u = {
        token: token,
        ...response.data.user,
    }

    Store.set("current user", email);


    return u;
}

export default authenticate;
