'use client'

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import createIdentity from '@/lib/actions/identities/create-identity';
import identitySchema from '@/lib/form-schemas/create-identity-form-schema';

const CreateIdentityForm = () => {
    const form = useForm<z.infer<typeof identitySchema>>({
        resolver: zodResolver(identitySchema),
        defaultValues: {
            name: '',
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(createIdentity)} className='space-y-8'>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder='eg. My iPhone' {...field} />
                            </FormControl>
                            <FormDescription>
                                The name of your identity that is referenced by services.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' className='w-full cursor-pointer'>
                    Submit
                </Button>
            </form>
        </Form>
    );
}

export default CreateIdentityForm;
