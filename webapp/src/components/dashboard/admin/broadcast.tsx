'use client'

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useRef } from "react";

const Broadcast = ({
    onClick
}: {
    onClick: (msg: string) => Promise<void> | void
}) => {
    const router = useRouter();
    const ref = useRef<null | HTMLTextAreaElement>(null)
    return (
        <div className='flex flex-col gap-8'>
            <Textarea
                ref={ref}
                placeholder='Put your message here!' />
            <Button
                onClick={async () => {
                    if (!ref.current) return;
                    await onClick(ref.current.value);
                    router.refresh();
                }}
            >
                Submit
            </Button>
        </div>
    );
}

export default Broadcast;
