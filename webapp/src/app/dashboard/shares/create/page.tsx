import CommunityForm from "@/components/dashboard/communities/community-form";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

export const dynamic = "force-dynamic";

const CreateCommunity = () => {
    return (
        <DashboardLayout>
            <div className='mx-auto flex flex-col gap-8 max-w-md'>
                <span className='text-4xl font-extrabold'>Create a Community</span>
                <CommunityForm />
            </div>
        </DashboardLayout>
    );
}

export default CreateCommunity;
