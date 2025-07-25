import EditBindingForm from "@/components/dashboard/services/edit-binding-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth";

const BindingPage = async ({ params }: { params: Promise<{ slug: string, binding_slug: string }> }) => {
    const session = await getServerSession();
    const email = session?.user?.email;
    if (!email) unauthorized();

    const bindingSlug = (await params).binding_slug;

    return (
        <div className='grid gap-8'>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Edit Binding
                    </CardTitle>
                    <CardDescription>
                        Edit the settings of this binding. Click save to update the binding.
                    </CardDescription>
                </CardHeader>
            </Card>
            <EditBindingForm
                identities={identities}
                hostingIdentitySlug={hostingIdentitySlug}
                binding={binding} />
        </div>
    )
}

export default BindingPage;
