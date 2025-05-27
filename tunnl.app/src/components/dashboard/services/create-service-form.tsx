'use client'

import { z } from 'zod';
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
import serviceSchema from '@/lib/form-schemas/create-service-form-schema';
import createService from '@/lib/actions/services/create-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const CreateServiceForm = () => {
    const form = useForm<z.infer<typeof serviceSchema>>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: '',
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(createService)} className='space-y-8'>
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
                    name="protocol"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='mb-1'>Protocol Family</FormLabel>
                            <FormControl>
                                <RadioGroup

                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col"
                                >
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="http" />
                                        </FormControl>
                                        <FormLabel className="font-normal">HTTP</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="tcp/udp" />
                                        </FormControl>
                                        <FormLabel className="font-normal">TCP/UDP</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormDescription>
                                Select the protocol that best fits your service. The protocol effects the way your service can be exposed publicly if you choose to do so.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type='submit'
                    variant='outline'
                    className='w-full cursor-pointer'>
                    Submit
                </Button>
            </form>
        </Form>
    );
}

export default CreateServiceForm;
