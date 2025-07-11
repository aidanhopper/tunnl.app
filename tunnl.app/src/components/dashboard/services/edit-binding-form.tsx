'use client'

import tunnelHostFormSchema from "@/lib/form-schemas/tunnel-host-form-schema";
import tunnelInterceptFormSchema from "@/lib/form-schemas/tunnel-intercept-form-schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IGetTunnelBindingBySlugResult } from "@/db/types/tunnel_bindings.queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { IGetIdentitiesByEmailResult } from "@/db/types/identities.queries";

const combinedSchema = z.object({
    host: tunnelHostFormSchema,
    intercept: tunnelInterceptFormSchema
})


const EditBindingForm = ({
    binding,
    hostingIdentitySlug,
    identities
}: {
    binding: IGetTunnelBindingBySlugResult,
    hostingIdentitySlug: string | null,
    identities: IGetIdentitiesByEmailResult[]
}) => {
    const router = useRouter();

    const combinedForm = useForm<z.infer<typeof combinedSchema>>({
        resolver: zodResolver(combinedSchema),
        defaultValues: {
            host: {
                protocol: binding.host_protocol ?? '',
                address: binding.host_address,
                identity: binding.host_ziti_id,
                portConfig: binding.host_forward_ports ? {
                    forwardPorts: true,
                    portRange: binding.host_allowed_port_ranges ?? ''
                } : {
                    forwardPorts: false,
                    port: binding.host_port ?? '',
                }
            },
            intercept: {
                address: binding.intercept_addresses[0],
                portConfig: binding.host_forward_ports ? {
                    forwardPorts: true,
                } : {
                    forwardPorts: false,
                    port: binding.intercept_port_ranges ?? ''
                },
            }
        }

    });

    const handleSubmit = async (formData: z.infer<typeof combinedSchema>) => {
        console.log(formData);
        router.refresh();
    }

    return (
        <Form {...combinedForm}>
            <form
                className='space-y-8'
                onSubmit={combinedForm.handleSubmit(handleSubmit)}>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Forward Ports</FormLabel>
                                        <FormControl>
                                            <Switch
                                                onChange={field.onChange}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className='cursor-pointer' />
                                        </FormControl>
                                        <FormDescription>
                                            Choose whether the ports are forwarded from the intercept or not
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
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
                            asdf
                        </CardContent>
                    </Card>
                </div>
                <Button
                    className='cursor-pointer'
                    type='submit'>
                    Save
                </Button>
            </form>
        </Form>
    );
}

export default EditBindingForm;

