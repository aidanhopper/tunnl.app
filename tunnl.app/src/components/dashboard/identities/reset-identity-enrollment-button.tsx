'use client'

import { Button } from "@/components/ui/button";
import resetIdentityEnrollment from "@/lib/actions/identities/reset-identtiy-enrollment";
import { useRouter } from 'next/navigation';

const ResetIdentityEnrollmentButton = ({ name }: { name: string }) => {
    const router = useRouter();

    const onClick = async () => {
        await resetIdentityEnrollment(name);
        router.refresh();
    }

    return (
        <Button
            className='cursor-pointer'
            onClick={onClick}>
            Reset Enrollment
        </Button>
    );
}

export default ResetIdentityEnrollmentButton;
