'use client'

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IGetIdentityBySlugResult } from "@/db/types/identities.queries";

const IdentityStatusCard = ({ identity }: { identity: IGetIdentityBySlugResult }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Status</CardTitle>
                <CardDescription>
                    {identity.is_online ? <>
                        Online since {identity.last_seen?.toLocaleString()}
                    </> : identity.last_seen ?
                        <>
                            Offline since {identity.last_seen.toLocaleString()}
                        </> :
                        <>
                            Never online
                        </>}
                </CardDescription>
            </CardHeader>
            {/* <CardContent> </CardContent> */}
        </Card>
    );
}

export default IdentityStatusCard;
