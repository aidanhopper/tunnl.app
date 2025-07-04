'use client'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const SharesTable = () => {
    return (
        <Table>
            <TableCaption>A list of your shares.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Info</TableHead>
                    <TableHead />
                </TableRow>
            </TableHeader>
            <TableBody>
                {}
            </TableBody>
        </Table>
    );
}

export default SharesTable;
