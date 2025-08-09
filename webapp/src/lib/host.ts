import { headers } from 'next/headers';

const host = async () => {
    const headersList = await headers();
    return headersList.get('host')?.split(':')[0] ?? 'Tunnl.app';
}

export default host;
