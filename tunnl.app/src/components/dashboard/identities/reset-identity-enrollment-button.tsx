'use client'

import { Button } from "@/components/ui/button";
import resetIdentityEnrollment from "@/lib/actions/identities/reset-identtiy-enrollment";

const ResetIdentityEnrollmentButton = ({ name }: { name: string }) => {
    const onClick = async () => {
        await resetIdentityEnrollment(name);
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
