'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { IGetIdentitiesByEmailResult } from "@/db/types/identities.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type BindingType = 'tunnel' | 'proxied' | 'port' | null

const bindingTypeSchema = z.object({
    type: z.string().nonempty()
});

const tunnelHostFormSchema = z.object({
    protocol: z.string().nonempty(),
    ipOrHostname: z.string().nonempty(),
    port: z.string().nonempty(),
    identity: z.string().nonempty()
});

const CreateBindingForm = ({ identities }: { identities: IGetIdentitiesByEmailResult[] }) => {
    const [pageIndex, setPageIndex] = useState(0);
    const [bindingType, setBindingType] = useState<BindingType>(null);

    const bindingTypeForm = useForm<z.infer<typeof bindingTypeSchema>>({
        resolver: zodResolver(bindingTypeSchema),
        defaultValues: {
            type: '',
        },
    });

    const tunnelHostForm = useForm<z.infer<typeof tunnelHostFormSchema>>({
        resolver: zodResolver(tunnelHostFormSchema),
        defaultValues: {
            protocol: '',
            ipOrHostname: '',
            port: '',
            identity: '',
        }
    });

    const getCurrentPage = (bindingType: BindingType) => {
        const bindingTypePage = <>
            <Form {...bindingTypeForm}>
                <form
                    onSubmit={bindingTypeForm.handleSubmit((formData: z.infer<typeof bindingTypeSchema>) => {
                        setBindingType(formData.type as BindingType);
                        setPageIndex(pageIndex + 1);
                    })}
                    className='space-y-8'>
                    <FormField
                        control={bindingTypeForm.control}
                        name='type'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Binding type</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        {...field}>
                                        <SelectTrigger className="w-full cursor-pointer">
                                            <SelectValue placeholder='Binding' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem className='cursor-pointer' value="tunnel">Tunnel</SelectItem>
                                            <SelectItem className='cursor-pointer' value="port">Port</SelectItem>
                                            <SelectItem className='cursor-pointer' value="proxied">Proxied</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    The name of your identity that is referenced by services
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex justify-end'>
                        <Button
                            onSubmit={(e) => e.preventDefault()}
                            type='submit'
                            variant='outline'
                            className='cursor-pointer'>
                            <ArrowRight />
                        </Button>
                    </div>
                </form>
            </Form>
        </>

        const tunnelPages = [
            <>
                <h3 className='font-semibold'>Configure the host</h3>
                <Form {...tunnelHostForm}>
                    <form
                        onSubmit={tunnelHostForm.handleSubmit((formData: z.infer<typeof tunnelHostFormSchema>) => {
                            console.log(formData);
                            // setPageIndex(pageIndex + 1);
                        })}
                        className='space-y-8'>
                        <FormField
                            control={tunnelHostForm.control}
                            name='protocol'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Protocol</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="tcp" id="tcp" className='cursor-pointer' />
                                                <Label htmlFor="tcp" className='cursor-pointer'>TCP</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="udp" id="udp" className='cursor-pointer' />
                                                <Label htmlFor="udp" className='cursor-pointer'>UDP</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="tcp/udp" id="tcp/udp" className='cursor-pointer' />
                                                <Label htmlFor="tcp/udp" className='cursor-pointer'>TCP / UDP</Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormDescription>
                                        Choose the protocol the service is running on
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex gap-4'>
                            <span className='w-full'>
                                <FormField
                                    control={tunnelHostForm.control}
                                    name='ipOrHostname'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>IP / Hostname</FormLabel>
                                            <FormControl>
                                                <Input placeholder='127.0.0.1' {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Where the hosting identity can access the service
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </span>
                            <span className='max-w-32'>
                                <FormField
                                    control={tunnelHostForm.control}
                                    name='port'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Port</FormLabel>
                                            <FormControl>
                                                <Input placeholder='443' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </span>
                        </div>
                        <div>
                            <FormField
                                control={tunnelHostForm.control}
                                name='identity'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hosting identity</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                {...field}>
                                                <SelectTrigger
                                                    className='w-full cursor-pointer'
                                                    value='identity'>
                                                    <SelectValue placeholder='Identity' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {identities.map((elem, i) =>
                                                        <SelectItem
                                                            className='cursor-pointer'
                                                            key={i}
                                                            value={elem.slug}>
                                                            {elem.name}
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='grid grid-cols-2'>
                            <span>
                                <Button
                                    onClick={() => setPageIndex(pageIndex - 1)}
                                    type='button'
                                    variant='outline'
                                    className='cursor-pointer'>
                                    <ArrowLeft />
                                </Button>
                            </span>
                            <span className='grid justify-end'>
                                <Button
                                    onSubmit={(e) => e.preventDefault()}
                                    type='submit'
                                    variant='outline'
                                    className='cursor-pointer'>
                                    <ArrowRight />
                                </Button>
                            </span>
                        </div>
                    </form>
                </Form>
            </>,
            <>
                page 3 !
            </>
        ];

        switch (pageIndex) {
            case 0: return bindingTypePage
            default:
                switch (bindingType) {
                    case 'tunnel': return tunnelPages[pageIndex - 1]
                    default: return <Button
                        className='cursor-pointer'
                        variant='outline'
                        onClick={() => setPageIndex(pageIndex - 1)}>
                        <ArrowLeft />
                    </Button>;
                }
        }
    }

    return (
        <div className='grid gap-4'>
            {getCurrentPage(bindingType)}
        </div>
    );
}

export default CreateBindingForm;
