'use client'

import tunnelHostFormSchema from "@/lib/form-schemas/tunnel-host-form-schema";
import tunnelInterceptFormSchema from "@/lib/form-schemas/tunnel-intercept-form-schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import editTunnelBinding from "@/lib/actions/services/edit-tunnel-binding";
import { useState } from "react";
import { TunnelBindingClientData } from "@/lib/models/tunnel-binding";
import { IdentityClientData } from "@/lib/models/identity";
import { ServiceClientData } from "@/lib/models/service";

const combinedSchema = z.object({
    host: tunnelHostFormSchema,
    intercept: tunnelInterceptFormSchema
})

const EditTunnelBindingForm = ({
    service,
    tunnelBinding,
    hostingIdentity,
    identities
}: {
    service: ServiceClientData,
    tunnelBinding: TunnelBindingClientData,
    hostingIdentity: IdentityClientData | null,
    identities: IdentityClientData[]
}) => {
    const router = useRouter();
    const [isSaveSuccessful, setIsSaveSuccessful] = useState<boolean | null>(null);

    const combinedForm = useForm<z.infer<typeof combinedSchema>>({
        resolver: zodResolver(combinedSchema),
        defaultValues: {
            host: {
                protocol: tunnelBinding.zitiData?.host.protocol ?? '',
                address: tunnelBinding.zitiData?.host.address ?? '',
                identity: hostingIdentity?.slug ?? '',
                portConfig: tunnelBinding.zitiData?.host.portConfig?.forwardPorts === true ? {
                    forwardPorts: true,
                    portRange: tunnelBinding.zitiData.host.portConfig.allowedPortRanges ?? ''
                } : tunnelBinding.zitiData?.host.portConfig?.forwardPorts === false ? {
                    forwardPorts: false,
                    port: tunnelBinding.zitiData?.host.portConfig.port ?? '',
                } : {
                    forwardPorts: false,
                    port: ''
                }
            },
            intercept: {
                address: tunnelBinding.zitiData?.intercept.address,
                portConfig: tunnelBinding.zitiData?.intercept.portConfig?.forwardPorts === true ? {
                    forwardPorts: true,
                } : tunnelBinding.zitiData?.intercept.portConfig?.forwardPorts === false ? {
                    forwardPorts: false,
                    port: tunnelBinding.zitiData?.intercept.portConfig.portRange ?? ''
                } : {
                    forwardPorts: false,
                    port: ''
                },
            }
        }
    });

    combinedForm.watch('host.portConfig.forwardPorts');

    const handleSubmit = async (formData: z.infer<typeof combinedSchema>) => {
        console.log(formData);
        const res = await editTunnelBinding({
            hostConfig: formData.host,
            interceptConfig: formData.intercept,
            serviceSlug: service.slug,
            tunnelBindingSlug: tunnelBinding.slug
        });
        setIsSaveSuccessful(res === undefined ? null : res);
    }

    return (
        <Form {...combinedForm}>
            <form
                className='space-y-8'
                onSubmit={combinedForm.handleSubmit(handleSubmit)}>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    <span>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Host
                                </CardTitle>
                                <CardDescription>
                                    The hosting settings for this binding
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-8'>
                                <FormField
                                    control={combinedForm.control}
                                    name='host.protocol'
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
                                <FormField
                                    control={combinedForm.control}
                                    name='host.portConfig.forwardPorts'
                                    render={({ field }) => {
                                        const handleChange = (checked: boolean) => {
                                            field.onChange(checked);
                                            combinedForm.setValue('host.portConfig.portRange', '');
                                            combinedForm.setValue('host.portConfig.port', '');
                                            combinedForm.setValue(
                                                'intercept.portConfig.forwardPorts',
                                                combinedForm.getValues().host.portConfig.forwardPorts
                                            );
                                            if (combinedForm.getValues().host.portConfig.forwardPorts)
                                                combinedForm.setValue('intercept.portConfig.port', '');
                                        }
                                        return (
                                            <FormItem>
                                                <FormLabel>Forward Ports</FormLabel>
                                                <FormControl>
                                                    <Switch
                                                        onChange={field.onChange}
                                                        checked={field.value}
                                                        onCheckedChange={handleChange}
                                                        className='cursor-pointer' />
                                                </FormControl>
                                                <FormDescription>
                                                    Choose whether the ports are forwarded from the intercept or not
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                                <div className='flex gap-4'>
                                    <span className='w-full'>
                                        <FormField
                                            control={combinedForm.control}
                                            name='host.address'
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
                                    {!combinedForm.getValues().host.portConfig.forwardPorts &&
                                        <span className='w-24'>
                                            <FormField
                                                control={combinedForm.control}
                                                name='host.portConfig.port'
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
                                    }
                                </div>
                                <div>
                                    {combinedForm.getValues().host.portConfig.forwardPorts &&
                                        <FormField
                                            control={combinedForm.control}
                                            name='host.portConfig.portRange'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Allowed Port Ranges</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='6559-7308 443' {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        The port ranges you are allowing to be forwarded from the intercept to the host
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />}
                                </div>
                                <div>
                                    <FormField
                                        control={combinedForm.control}
                                        name='host.identity'
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
                                                            <SelectValue />
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
                                                <FormDescription>
                                                    The identity your service will be accessed from
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </span>
                    <span>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Intercept
                                </CardTitle>
                                <CardDescription>
                                    The intercept settings for this binding
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='flex gap-4'>
                                    <span className='w-full'>
                                        <FormField
                                            control={combinedForm.control}
                                            name='intercept.address'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='my.service'
                                                            {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                    <FormDescription>
                                                        The address clients can use to connect to the service
                                                    </FormDescription>
                                                </FormItem>
                                            )}
                                        />
                                    </span>
                                    {!combinedForm.getValues().intercept.portConfig.forwardPorts &&
                                        <span className='w-24'>
                                            <FormField
                                                control={combinedForm.control}
                                                name='intercept.portConfig.port'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Port</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder='443'
                                                                {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </span>}
                                </div>
                            </CardContent>
                        </Card>
                    </span>
                </div>
                <Button
                    className='cursor-pointer w-full lg:w-fit'
                    type='submit'>
                    Save
                </Button>
                <span className='ml-6'>
                    {isSaveSuccessful !== null && (isSaveSuccessful ?
                        <>Success!</> : <>Fail</>)}
                </span>
            </form>
        </Form>
    );
}

export default EditTunnelBindingForm;

