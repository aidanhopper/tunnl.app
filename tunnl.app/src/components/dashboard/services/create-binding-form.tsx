'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    type: z.string()
})

const CreateBindingForm = () => {
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
                                    The name of your identity that is referenced by services.
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
                        onSubmit={tunnelHostForm.handleSubmit((formData: z.infer<typeof bindingTypeSchema>) => {
                            setBindingType(formData.type as BindingType);
                            setPageIndex(pageIndex + 1);
                        })}
                        className='space-y-8'>
                        <FormField
                            control={tunnelHostForm.control}
                            name='type'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Host</FormLabel>
                                    <FormControl>
                                    </FormControl>
                                    <FormDescription>
                                        The name of your identity that is referenced by services.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
