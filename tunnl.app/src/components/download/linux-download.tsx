'use client'

import DownloadButton from "./download-button";

const LinuxDownload = () => {
    return (
        <div className='w-96 flex flex-col gap-4'>
            <p>
                I recommend using Docker for hosting on Linux. For hosting <b>and</b> accessing
                services on Linux you need to download the Ziti Edge Tunnel binary
                and create a systemd service yourself. Eventually when I get the time
                I will make this setup easier.
            </p>
            <p>
                If theres enough demand for a Linux tunneler I could also work on creating a
                Ziti Desktop Edge for popular Linux distributions.
            </p>
            <div className='flex justify-center mt-4'>
                <DownloadButton href='https://github.com/openziti/ziti-tunnel-sdk-c/releases'>
                    Linux Tunneler Binary Releases
                </DownloadButton>
            </div>
        </div>
    );
}

export default LinuxDownload;
