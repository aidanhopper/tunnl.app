import DashboardLayout from "@/components/dashboard/dashboard-layout";
import CreateServiceForm from "@/components/dashboard/services/create-service-form";

const CreateService = () => {
    return (
        <DashboardLayout>
            <div className='mx-auto flex flex-col gap-8 max-w-md'>
                <span className='text-4xl font-extrabold'>Create a Service</span>
                <CreateServiceForm />
            </div>
        </DashboardLayout>
    );
}

export default CreateService;
