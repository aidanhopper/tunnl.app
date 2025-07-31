'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserClientData } from "@/lib/models/user";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const UserApprover = ({
    searchUser,
    approveUser,
    unapproveUser
}: {
    searchUser: (email: string) => Promise<UserClientData | null>,
    approveUser: (email: string) => Promise<boolean>
    unapproveUser: (email: string) => Promise<boolean>
}) => {
    const emailRef = useRef<HTMLInputElement | null>(null);
    const [user, setUser] = useState<UserClientData | null | undefined>(undefined);
    return (
        <div className='flex flex-col gap-3'>
            <Label>
                Email
            </Label>
            <div className='flex gap-2'>
                <Input
                    type='email'
                    ref={emailRef}
                    placeholder='name@domain.com' />
                <Button
                    onClick={async () => {
                        setUser(undefined);
                        if (!emailRef.current) return;
                        setUser(await searchUser(emailRef.current.value));
                    }}
                    size='icon'
                    className='cursor-pointer'>
                    <Search />
                </Button>
            </div>
            <div>
                {user === null &&
                    <p className='text-red-400'>Failed to find user</p>}
                {user &&
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    Email
                                </TableHead>
                                <TableHead>
                                    Last Login
                                </TableHead>
                                <TableHead>
                                    Approved
                                </TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    {user.email}
                                </TableCell>
                                <TableCell>
                                    {user.lastLogin.toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {user.isApproved ? <>True</> : <>False</>}
                                </TableCell>
                                <TableCell>
                                    {!user.isApproved ?
                                        <Button
                                            onClick={async () => {
                                                await approveUser(user.email);
                                                setUser(await searchUser(user.email));
                                            }}
                                            size='sm' 
                                            className='cursor-pointer'
                                        >
                                            Approve
                                        </Button> :
                                        <Button
                                            onClick={async () => {
                                                await unapproveUser(user.email);
                                                setUser(await searchUser(user.email));
                                            }}
                                            size='sm'
                                            className='cursor-pointer'
                                            variant='destructive'
                                        >
                                            Unapprove
                                        </Button>
                                    }
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>}
            </div>
        </div>
    );
}

export default UserApprover;
