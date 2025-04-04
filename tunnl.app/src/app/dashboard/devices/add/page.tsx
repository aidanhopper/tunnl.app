import DashboardLayout from "@/components/dashboard/dashboard-layout";
import CopyDeviceUrl from "@/components/copy-device-url";

const AddDevice = () => {

    return (
        <DashboardLayout>
            <div className='mx-auto flex flex-col gap-8 max-w-xl'>
                <h1>Add a device</h1>
                <p className='text-2xl text-justify'>
                    To add a device copy the url below and make a GET request on the device you are trying to add. To do this on a browser just copy and paste the URL into the search bar. If you don&apos;t have a GUI use <code>curl</code>. This will authenticate your user with the local daemon allowing you to share and access services on that device.
                </p>
                <div className='flex justify-center'>
                    <CopyDeviceUrl url='http://localhost:12344/123-abc-123' />
                </div>
                <p className='text-2xl text-justify'>
                    In the future you will authenticate directly with the daemon using a CLI application or GUI interface on the desktop but for now this is how it&apos;s done.
                </p>
            </div>
        </DashboardLayout>
    );
}

export default AddDevice;