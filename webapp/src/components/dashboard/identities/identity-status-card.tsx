'use client'

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IdentityClientData } from "@/lib/models/identity";

const IdentityStatusCard = ({ identity }: { identity: IdentityClientData }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Status</CardTitle>
                <CardDescription>
                    {identity.isOnline ? <>
                        Online since {identity.lastSeen?.toLocaleString()}
                    </> : identity.lastSeen ?
                        <>
                            Offline since {identity.lastSeen.toLocaleString()}
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
