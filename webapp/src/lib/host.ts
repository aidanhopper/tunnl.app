import { headers } from 'next/headers';

const capitalize = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const host = async () => {
    const headersList = await headers();
    return capitalize(headersList.get('host')?.split(':')[0] ?? 'Tunnl.app');
}

export default host;
