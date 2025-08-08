import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { ChevronDown } from 'lucide-react';
import { Button } from "./ui/button";

const NavMenu = ({ className = '' }: { className?: string }) => {
    return (
        <NavigationMenu className={className}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className='bg-transparent' />
                    <NavigationMenuContent className='p-1'>
                        <NavigationMenuLink>
                            <a className='slide2' href='#'>
                                <Button
                                    variant='ghost'
                                    className='text-muted-foreground w-full'>
                                    FAQ
                                </Button>
                            </a>
                        </NavigationMenuLink>
                        <NavigationMenuLink>
                            <a className='slide3' href='#'>
                                <Button
                                    variant='ghost'
                                    className='text-muted-foreground w-full'>
                                    Contact
                                </Button>
                            </a>
                        </NavigationMenuLink>
                        <NavigationMenuLink>
                            <a className='slide4' href='https://github.com/aidanhopper/tunnl.app' target='_blank'>
                                <Button
                                    variant='ghost'
                                    className='text-muted-foreground w-full'>
                                    Github
                                </Button>
                            </a>
                        </NavigationMenuLink>
                        <NavigationMenuLink>
                            <a className='slide5' href='#'>
                                <Button
                                    variant='ghost'
                                    className='text-muted-foreground w-full'>
                                    Docs
                                </Button>
                            </a>
                        </NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

export default NavMenu;
