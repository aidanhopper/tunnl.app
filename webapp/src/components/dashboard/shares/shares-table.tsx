'use client'

import AreYouSure from "@/components/are-you-sure";
import { AreYouSureProvider } from "@/components/are-you-sure-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { EllipsisVertical } from "lucide-react";
import DeleteShareButton from "./delete-share-button";
import deleteShare from "@/lib/actions/shares/delete-share";
import { ShareClientData } from "@/lib/models/share";

const SharesTable = ({ shares }: { shares: ShareClientData[] }) => {
    return (
        <Table>
            <TableCaption>A list of your shares.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Config</TableHead>
                    <TableHead />
                </TableRow>
            </TableHeader>
            <TableBody>
                {shares.map((share, i) => {
                    return (
                        <TableRow key={i}>
                            <TableCell>{share.service.name}</TableCell>
                            <TableCell>{share.granterEmail}</TableCell>
                            <TableCell>{share.service.protocol}</TableCell>
                            <TableCell>
                                <div>
                                    {share.service.entryPoint.intercept}
                                </div>
                                <div>
                                    {share.service.entryPoint.portRange}
                                </div>
                            </TableCell>
                            <TableCell className='w-16'>
                                <AreYouSureProvider>
                                    <AreYouSure
                                        yesText=<>Delete the share</>
                                        refreshOnYes={true}
                                        onClickYes={async () => await deleteShare({ shareSlug: share.slug })}>
                                        Are you sure you want to delete this share?
                                        You will lose access to the service once deleted.
                                    </AreYouSure>
                                    <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='ghost' className='cursor-pointer'>
                                                <EllipsisVertical />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DeleteShareButton />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </AreYouSureProvider>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

export default SharesTable;
