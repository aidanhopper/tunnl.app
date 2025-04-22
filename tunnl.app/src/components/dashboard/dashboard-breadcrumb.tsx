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

const DashboardBreadcrumb = () => {
    const path = usePathname().split('/').filter(e => e !== '');
    return (
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
                                        {e}
                                    </Link>
                                </BreadcrumbLink> :
                                <BreadcrumbPage
                                    className='capitalize'>
                                    {e.split('-').length === 1 ?
                                        e : e.split('-').slice(0, -1).join(' ')}
                                </BreadcrumbPage>}
                        </BreadcrumbItem>
                        {i !== path.length - 1 ? <BreadcrumbSeparator /> : null}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb >
    );
}

export default DashboardBreadcrumb;
