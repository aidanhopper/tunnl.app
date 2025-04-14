import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Delete, EllipsisVertical, Info, Settings, User, Users } from "lucide-react";
import Link from "next/link";

const communities = [
    {
        community: 'Dartoads',
        members: 10,
        shares: 10,
        joined: '10/23/2023',
        created: '10/23/2023',
    }
]

const Shares = () => {
    return (
        <DashboardLayout>
            <div className='flex'>
                <div className='flex flex-1 w-full items-center gap-8'>
                    <Users size={48} />
                    <h1>Shares</h1>
                </div>
                <div className='flex justify-end items-center gap-2'>
                    <Button className='cursor-pointer invisible lg:visible' variant='ghost' asChild>
                        <Link href='#'>
                            Join
                        </Link>
                    </Button>
                    <Button className='cursor-pointer invisible lg:visible' variant='ghost' asChild>
                        <Link href='/dashboard/communities/create'>
                            Create
                        </Link>
                    </Button>
                </div>
            </div>
            <Table className='mt-10 hidden lg:table'>
                <TableCaption>A list of your services.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Community</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Shares</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {communities.map(item => (
                        <TableRow key={item.community}>
                            <TableCell>
                                <Button variant='link' className='p-0' asChild>
                                    <Link href='#'>
                                        {item.community}
                                    </Link>
                                </Button>
                            </TableCell>
                            <TableCell>{item.members}</TableCell>
                            <TableCell>{item.shares}</TableCell>
                            <TableCell>{item.joined}</TableCell>
                            <TableCell>{item.created}</TableCell>
                            <TableCell className='w-16'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant='ghost' className='cursor-pointer'>
                                            <EllipsisVertical />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>
                                            {item.community}
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem className='cursor-pointer'>
                                                <User size={16} /> Invite
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className='cursor-pointer'>
                                                <Info size={16} /> Info
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className='cursor-pointer'>
                                                <Settings size={16} /> Settings
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className='cursor-pointer duration-100'
                                                variant='destructive'>
                                                <Delete size={16} /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DashboardLayout>
    )
}

export default Shares;
