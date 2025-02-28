import SidebarButton from './SidebarButton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ScrollingListButton = ({ to, active, children }: { to: string, active: boolean, children?: React.ReactNode }) => {
    return (
        <SidebarButton to={to} active={active}>
            <div className="flex w-full">
                <div className="flex flex-1 justify-start items-center">
                    {children}
                </div>
                <div className="flex flex-1 justify-end items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="text-3xl invisible group-hover:visible p-1 cursor-pointer group"
                            onClick={() => {
                            }}>
                            <div className="w-1 mb-[2px] h-1 rounded bg-black" />
                            <div className="w-1 mb-[2px] h-1 rounded bg-black" />
                            <div className="w-1 h-1 rounded bg-black " />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className="font-bold text-red-600">
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </SidebarButton>
    );
}

type ListItem = {
    to: string,
    content: string,
    id: string,
};

const ScrollingList = ({ listItems, activeItemId }: { listItems: ListItem[], activeItemId: string }) => {
    return (
        <div className="flex flex-1 flex-col overflow-y-scroll h-full mt-4">
            {
                listItems.map((item, i) => {
                    return (
                        <ScrollingListButton
                            to={item.to}
                            active={activeItemId === item.id}
                            key={i}>
                            {item.content}
                        </ScrollingListButton>
                    );
                })
            }
        </div>
    );
}

export default ScrollingList;
