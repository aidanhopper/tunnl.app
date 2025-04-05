'use client'

import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const devices = ["Mac", "Desktop", "VPS-1", 'aidanhoppers-lxpc1'];

const isValidPort = (str: string) => {
    const num = Number(str);
    return Number.isInteger(num) && num >= 1 && num <= 65535;
};

const isValidPortRange = (str: string) => {
    return str.split('-').map(n => {
        const num = Number(n);
        return Number.isInteger(num) && num >= 1 && num <= 65535;
    }).reduce((acc, v) => acc && v, true)
}

const discriminatorUnion = z.discriminatedUnion('forwardPorts', [
    z.object({
        forwardPorts: z.literal(true),
        ports: z
            .string()
            .nonempty()
            .refine(values => {
                return values
                    .split(/\s+/)
                    .reduce((acc, v) => acc && isValidPortRange(v), true);
            }, {
                message: 'Invalid range of ports'
            })
    }),
    z.object({
        forwardPorts: z.literal(false),
        sourcePort: z
            .string()
            .nonempty()
            .refine(value => value.split(/\s+/).length === 1, {
                message: 'Port can only be one value'
            })
            .refine(isValidPort, {
                message: 'Not a valid port'
            }),
        accessPort: z
            .string()
            .nonempty()
            .refine(value => value.split(/\s+/).length === 1, {
                message: 'Port can only be one value'
            })
            .refine(isValidPort, {
                message: 'Not a valid port'
            }),
    }),
]);

const formSchema = z.object({
    name: z.string().min(2).max(50),
    device: z.string().nonempty(),
    host: z
        .string()
        .nonempty()
        .refine(value => {
            const isDomain = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*$/i.test(value);
            const isIpv4 = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/.test(value);
            const isIpv6 = /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)|(([0-9a-fA-F]{1,4}:){1,7}|:):(([0-9a-fA-F]{1,4}:){1,6}|:)|::([0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4})$/.test(value);
            return isDomain || isIpv4 || isIpv6;
        }, { message: 'Invalid host (can be IPv4, IPv6, or Domain)' }),
    domain: z
        .string()
        .min(2)
        .max(50)
        .refine(value => /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*$/i.test(value), {
            message: 'Invalid domain'
        }),
}).and(discriminatorUnion);

const CreateServiceForm = () => {
    const [forwardPorts, setForwardPorts] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            forwardPorts: false,
            name: '',
            device: '',
            host: '',
            domain: '',
            sourcePort: '',
            accessPort: '',
        },
    });

    const handleToggleForwardPorts = (value: boolean) => {
        if (value) {
            form.reset({
                name: form.getValues('name'),
                domain: form.getValues('domain'),
                device: form.getValues('device'),
                host: form.getValues('host'),
                forwardPorts: true,
                ports: ''
            });
        } else {
            form.reset({
                name: form.getValues('name'),
                domain: form.getValues('domain'),
                device: form.getValues('device'),
                host: form.getValues('host'),
                forwardPorts: false,
                sourcePort: '',
                accessPort: '',
            });
        }
        setForwardPorts(value);
    }

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="eg. My Web Server" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your services public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="device"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Device</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className='w-md cursor-pointer'>
                                        <SelectValue placeholder="Select a device" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className='w-md'>
                                    {devices.map(item => (
                                        <SelectItem
                                            className='cursor-pointer'
                                            key={item}
                                            value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                This is the tunneler that will be used as the to the service.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Domain</FormLabel>
                            <FormControl>
                                <Input placeholder='eg. my.web.server' {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the domain users can use to access the serivce over the tunneler.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="host"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Host</FormLabel>
                            <FormControl>
                                <Input placeholder='eg. 127.0.0.1' {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the host of the service relative to the device.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormItem>
                    <FormLabel>Forward Ports</FormLabel>
                    <FormControl>
                        <Switch
                            onClick={() => handleToggleForwardPorts(!forwardPorts)}
                            className='cursor-pointer'
                        />
                    </FormControl>
                    <FormDescription>
                        Select whether to forward the ports on your service or not.
                        Forward ports when your service runs on more than one port.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                {forwardPorts &&
                    <>
                        <FormField
                            control={form.control}
                            name='ports'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Source Ports</FormLabel>
                                    <FormControl>
                                        <Input placeholder='eg. 80 443 100-500' {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        These are the ports your service is running on.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                }
                {!forwardPorts &&
                    <>
                        <FormField
                            control={form.control}
                            name='sourcePort'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Source Port</FormLabel>
                                    <FormControl>
                                        <Input placeholder='eg. 3000' {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the port your service is running on.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='accessPort'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Access Port</FormLabel>
                                    <FormControl>
                                        <Input placeholder='eg. 80' {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the port your service is accessed on.
                                        Think of it as a reverse proxy from the source
                                        port to the access port.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                }
                <Button className="cursor-pointer w-full" type="submit">
                    Submit
                </Button>
            </form>
        </Form>
    );
};

export default CreateServiceForm;
