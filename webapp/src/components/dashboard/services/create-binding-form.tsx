'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import createTunnelBinding from "@/lib/actions/services/create-tunnel-binding";
import privateHttpsFormSchema from "@/lib/form-schemas/create-private-https-binding-form-schema";
import tunnelHostFormSchema from "@/lib/form-schemas/tunnel-host-form-schema";
import tunnelInterceptFormSchema from "@/lib/form-schemas/tunnel-intercept-form-schema";
import tunnelShareFormSchema from "@/lib/form-schemas/tunnel-share-form-schema";
import { IdentityClientData } from "@/lib/models/identity";
import { ServiceClientData } from "@/lib/models/service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type BindingType = 'tunnel' | 'private-https' | 'port' | null;

const bindingTypeSchema = z.object({
    type: z.string().nonempty()
});

const CreateBindingForm = ({
    identities,
    service,
}: {
    identities: IdentityClientData[],
    service: ServiceClientData,
}) => {
    const [pageIndex, setPageIndex] = useState(0);
    const [bindingType, setBindingType] = useState<BindingType>(null);
    const [tunnelHostConfig, setTunnelHostConfig] = useState<null | z.infer<typeof tunnelHostFormSchema>>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [tunnelInterceptConfig, setTunnelInterceptConfig] = useState<null | z.infer<typeof tunnelInterceptFormSchema>>(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const bindingTypeForm = useForm<z.infer<typeof bindingTypeSchema>>({
        resolver: zodResolver(bindingTypeSchema),
        defaultValues: {
            type: '',
        },
    });

    const privateHttpsForm = useForm<z.infer<typeof privateHttpsFormSchema>>({
        resolver: zodResolver(privateHttpsFormSchema),
        defaultValues: {
            domain: ''
        }
    })

    const tunnelHostForm = useForm<z.infer<typeof tunnelHostFormSchema>>({
        resolver: zodResolver(tunnelHostFormSchema),
        defaultValues: {
            protocol: '',
            address: '',
            identity: '',
            portConfig: {
                forwardPorts: false,
                port: '',
            }
        }

    });

    const tunnelInterceptForm = useForm<z.infer<typeof tunnelInterceptFormSchema>>({
        resolver: zodResolver(tunnelInterceptFormSchema),
        defaultValues: {
            address: '',
            portConfig: {
                forwardPorts: false,
                port: ''
            }
        }
    });

    const tunnelHostFormForwardPorts = tunnelHostForm.watch('portConfig.forwardPorts');
    useEffect(() => {
        tunnelHostForm.setValue('portConfig.portRange', '');
        tunnelHostForm.setValue('portConfig.port', '');
        tunnelInterceptForm.setValue('portConfig.forwardPorts', tunnelHostForm.getValues().portConfig.forwardPorts)
        if (tunnelHostForm.getValues().portConfig.forwardPorts) tunnelInterceptForm.setValue('portConfig.port', '');
    }, [tunnelHostFormForwardPorts, tunnelHostForm, tunnelInterceptForm]);

    const tunnelShareForm = useForm<z.infer<typeof tunnelShareFormSchema>>({
        resolver: zodResolver(tunnelShareFormSchema),
        defaultValues: {
            type: ''
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
                                            {/* <SelectItem className='cursor-pointer' value="private-https">Private HTTPS</SelectItem> */}
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
                            setTunnelHostConfig(formData);
                            setPageIndex(pageIndex + 1);
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
                        <FormField
                            control={tunnelHostForm.control}
                            name='portConfig.forwardPorts'
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
                        <div className='flex gap-4'>
                            <span className='w-full'>
                                <FormField
                                    control={tunnelHostForm.control}
                                    name='address'
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
                            {!tunnelHostForm.getValues().portConfig.forwardPorts &&
                                <span className='w-24'>
                                    <FormField
                                        control={tunnelHostForm.control}
                                        name='portConfig.port'
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
                        {tunnelHostForm.getValues().portConfig.forwardPorts &&
                            <FormField
                                control={tunnelHostForm.control}
                                name='portConfig.portRange'
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
                                        <FormDescription>
                                            The identity your service will be accessed from
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='grid grid-cols-2'>
                            <span>
                                <Button
                                    onClick={() => setPageIndex(pageIndex - 1)}
                                    type='button'
                                    className='cursor-pointer'>
                                    <ArrowLeft />
                                </Button>
                            </span>
                            <span className='grid justify-end'>
                                <Button
                                    onSubmit={(e) => e.preventDefault()}
                                    type='submit'
                                    className='cursor-pointer'>
                                    <ArrowRight />
                                </Button>
                            </span>
                        </div>
                    </form>
                </Form>
            </>,
            <>
                <h3 className='font-semibold'>Configure the intercept</h3>
                <Form {...tunnelInterceptForm}>
                    <form
                        onSubmit={tunnelInterceptForm.handleSubmit(async (formData: z.infer<typeof tunnelInterceptFormSchema>) => {
                            // setPageIndex(pageIndex + 1);
                            // setTunnelInterceptConfig(formData);
                            if (!tunnelHostConfig) return;
                            const res = await createTunnelBinding({
                                serviceSlug: service.slug,
                                hostConfig: tunnelHostConfig,
                                interceptConfig: formData,
                                shareConfig: { type: 'automatic' }
                            });

                            if (!res) return;

                            // reset and close when successful
                            setIsOpen(false);
                            setPageIndex(0);
                            router.refresh();
                        })}
                        className='space-y-8'>
                        <div className='flex gap-4'>
                            <span className='w-full'>
                                <FormField
                                    control={tunnelInterceptForm.control}
                                    name='address'
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
                            {!tunnelInterceptForm.getValues().portConfig.forwardPorts &&
                                <span className='w-24'>
                                    <FormField
                                        control={tunnelInterceptForm.control}
                                        name='portConfig.port'
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
                        <div className='grid grid-cols-2'>
                            <span>
                                <Button
                                    onClick={() => setPageIndex(pageIndex - 1)}
                                    type='button'
                                    className='cursor-pointer'>
                                    <ArrowLeft />
                                </Button>
                            </span>
                            <span className='grid justify-end'>
                                <Button
                                    onSubmit={e => e.preventDefault()}
                                    type='submit'
                                    className='cursor-pointer'>
                                    Submit
                                </Button>
                            </span>
                        </div>
                    </form>
                </Form>
            </>,
            <>
                <Form {...tunnelShareForm}>
                    <form
                        onSubmit={tunnelShareForm.handleSubmit(async (formData: z.infer<typeof tunnelShareFormSchema>) => {
                            if (!tunnelHostConfig) return;
                            const res = await createTunnelBinding({
                                serviceSlug: service.slug,
                                hostConfig: tunnelHostConfig,
                                interceptConfig: tunnelInterceptConfig,
                                shareConfig: formData
                            });

                            if (!res) return;

                            // reset and close when successful
                            setIsOpen(false);
                            setPageIndex(0);
                            router.refresh();
                        })}
                        className='space-y-8'>
                        <div className='flex gap-4'>
                            <span className='w-full'>
                                <FormField
                                    control={tunnelShareForm.control}
                                    name='type'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Share settings</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem
                                                            value="automatic"
                                                            id="automatic"
                                                            className='cursor-pointer' />
                                                        <Label
                                                            htmlFor="automatic"
                                                            className='cursor-pointer'>
                                                            Automatic
                                                        </Label>
                                                        <Label
                                                            htmlFor="automatic"
                                                            className='text-muted-foreground text-xs ml-1 cursor-pointer'>
                                                            Share the service binding with all identities automatically
                                                        </Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem
                                                            value="manual"
                                                            id="manual"
                                                            className='cursor-pointer' />
                                                        <Label
                                                            htmlFor="manual"
                                                            className='cursor-pointer'>
                                                            Manual
                                                        </Label>
                                                        <Label
                                                            htmlFor="manual"
                                                            className='text-muted-foreground text-xs ml-6 cursor-pointer'>
                                                            Share the service binding with identities manually
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </span>
                        </div>
                        <div className='grid grid-cols-2'>
                            <span>
                                <Button
                                    onClick={() => setPageIndex(pageIndex - 1)}
                                    type='button'
                                    className='cursor-pointer'>
                                    <ArrowLeft />
                                </Button>
                            </span>
                            <span className='grid justify-end'>
                                <Button
                                    onSubmit={e => e.preventDefault()}
                                    type='submit'
                                    className='cursor-pointer'>
                                    Submit
                                </Button>
                            </span>
                        </div>
                    </form>
                </Form>
            </>
        ];

        const privateHttpsPages = [
            <>
                <Form {...privateHttpsForm}>
                    <form
                        onSubmit={privateHttpsForm.handleSubmit(async (formData: z.infer<typeof privateHttpsFormSchema>) => {
                            // await createPrivateHttpsBinding({
                            //     privateHttpsFormData: formData,
                            //     tunnelBindingId: tunnelBinding.id,
                            //     mainDomain: ".cs.tunnl.app",
                            // });
                        })}
                        className='space-y-8'>
                        <FormField
                            control={privateHttpsForm.control}
                            name='domain'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Domain</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="my-service"
                                                {...field}
                                                className="pr-[9rem]"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                                .cs.tunnl.app
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>
                                        The domain the service will be accessible on
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <div className='w-full flex'>
                            <span className='flex-1'>
                                <Button
                                    onClick={() => setPageIndex(pageIndex - 1)}
                                    type='button'
                                    className='cursor-pointer'>
                                    <ArrowLeft />
                                </Button>
                            </span>
                            <span>
                                <Button
                                    type='submit'
                                    className='cursor-pointer'>
                                    Submit
                                </Button>
                            </span>
                        </div>
                    </form>
                </Form>
            </>
        ]

        switch (pageIndex) {
            case 0: return bindingTypePage
            default:
                switch (bindingType) {
                    case 'tunnel': return <>{tunnelPages[pageIndex - 1]}</>;
                    case 'private-https': return <>{privateHttpsPages[pageIndex - 1]}</>;
                    default: return <Button
                        className='cursor-pointer'
                        onClick={() => setPageIndex(pageIndex - 1)}>
                        <ArrowLeft />
                    </Button>;
                }
        }
    }

    const bindingTitles = (type: string) => {
        switch (type) {
            case 'private-https': return 'Private HTTPS';
            case 'tunnel': return 'Private HTTPS';
            default: return type
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className='cursor-pointer'
                    variant='secondary'
                    onClick={() => setIsOpen(true)}>
                    Create
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create a <span>{
                            bindingType && pageIndex !== 0 ? bindingTitles(bindingType) : ''}
                        </span> Binding
                    </DialogTitle>
                </DialogHeader>
                <div className='grid gap-4'>
                    {getCurrentPage(bindingType)}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CreateBindingForm;
