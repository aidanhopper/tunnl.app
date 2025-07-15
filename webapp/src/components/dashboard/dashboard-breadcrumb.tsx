'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import Link from 'next/link'

const isSlug = (token: string) => {
    const tokenSplit = token.split('-');
    if (tokenSplit.length < 2) return false;
    const end = tokenSplit[tokenSplit.length - 1];
    if (/^[a-zA-Z0-9]{12}$/.test(end)) return true;
}

const DashboardBreadcrumb = () => {
    const path = usePathname()?.split('/').filter(e => e !== '');
    return path ? (
        <Breadcrumb>
            <BreadcrumbList>
                {path.map((e, i) => (
                    <Fragment key={i}>
                        <BreadcrumbItem>
                            {i !== path.length - 1 ?
                                <BreadcrumbLink
                                    asChild
                                    className='capitalize'>
                                    <Link
                                        href={'/' + path.slice(0, i + 1).join('/')}>
                                        {!isSlug(e) ?
                                            e : e.split('-').slice(0, -1).join(' ').replace('-', ' ')}
                                    </Link>
                                </BreadcrumbLink> :
                                <BreadcrumbPage
                                    className='capitalize'>
                                    {!isSlug(e) ?
                                        e : e.split('-').slice(0, -1).join(' ')}
                                </BreadcrumbPage>}
                        </BreadcrumbItem>
                        {i !== path.length - 1 ? <BreadcrumbSeparator /> : null}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    ) : null;
}

export default DashboardBreadcrumb;
