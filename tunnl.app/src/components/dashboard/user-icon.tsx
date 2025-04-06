'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLocalSession } from '@/lib/hooks';

const UserIcon = () => {
    const { data } = useLocalSession();
    return !data?.user ? <></> : (
        <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage />
            <AvatarFallback className="rounded-lg">
                {data.user.name ? data.user.name[0] : null}
            </AvatarFallback>
        </Avatar>
    );
}

export default UserIcon;
