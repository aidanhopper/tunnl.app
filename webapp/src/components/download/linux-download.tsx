'use client'

import DownloadButton from "./download-button";

const LinuxDownload = () => {
    return (
        <div className='flex flex-col gap-4 max-w-xl'>
            <p>
                I recommend using Docker for hosting on Linux. For hosting <b>and</b> accessing
                services on Linux you need to download the Ziti Edge Tunnel Binary.
                If your platform supports it, you could also use the Ziti Edge Tunnel systemd service.
            </p>
            <p>
                If theres enough demand for a Linux tunneler I could also work on creating a
                Ziti Desktop Edge for popular Linux distributions.
            </p>
            <div className='flex flex-col items-center mt-4 gap-5'>
                <DownloadButton href='https://github.com/openziti/ziti-tunnel-sdk-c/releases'>
                    Ziti Edge Tunneler Binary Releases
                </DownloadButton>
                <DownloadButton href='https://openziti.io/docs/reference/tunnelers/linux/'>
                    Ziti Edge Tunneler Service Docs
                </DownloadButton>
            </div>
        </div>
    );
}

export default LinuxDownload;
