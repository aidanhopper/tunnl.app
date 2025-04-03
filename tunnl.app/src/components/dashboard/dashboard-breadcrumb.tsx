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

const DashboardBreadcrumb = () => {
    const path = usePathname().split('/').filter(e => e !== '');
    console.log(path)
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {path.map((e, i) => (
                    <Fragment key={i}>
                        <BreadcrumbItem>
                            {
                                i !== path.length - 1 ?
                                    <BreadcrumbLink
                                        className='capitalize'
                                        href={'/' + path.slice(0, i + 1).join('/')}>
                                        {e}
                                    </BreadcrumbLink> :
                                    <BreadcrumbPage
                                        className='capitalize'>
                                        {e}
                                    </BreadcrumbPage>
                            }
                        </BreadcrumbItem>
                        {i !== path.length - 1 ? <BreadcrumbSeparator /> : null}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb >
    );
}

export default DashboardBreadcrumb;