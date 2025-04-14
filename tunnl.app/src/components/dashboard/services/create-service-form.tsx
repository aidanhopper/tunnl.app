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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
    name: z.string().min(4),
    privateDomain: z.string().min(4).refine((s) => {
        return s.split(' ').reduce((acc, v) => {
            const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i;
            if (s === '') return false;
            if (!domainRegex.test(v)) return false;
            return acc && true;
        }, true);
    }, { message: 'Private domain must be a valid domain.' }),
    identity: z.string().nonempty({ message: 'Must select an Identity'})
})

const identities = ['VPS-1', 'Macbook', 'Linux Desktop']

const CreateServiceForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            privateDomain: '',
            identity: ''
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log('values', values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder='eg. My Jellyfin Server' {...field} />
                            </FormControl>
                            <FormDescription>
                                Your services public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='privateDomain'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Private Domain</FormLabel>
                            <FormControl>
                                <Input placeholder='eg. my.jellyfin.server' {...field} />
                            </FormControl>
                            <FormDescription>
                                Your services private access point over the Ziti network. Technically it can be anything,
                                but its best to make sure its not a real FQDN to avoid conflicts.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='identity'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Identity</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Identity' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {identities.map(v => (
                                        <Button variant='ghost' key={v} asChild>
                                            <SelectItem value={v} className='w-full' >
                                                {v}
                                            </SelectItem>
                                        </Button>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                The identity that can host the service.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' variant='outline' className='w-full cursor-pointer'>
                    Submit
                </Button>
            </form>
        </Form>
    );
}

export default CreateServiceForm;
