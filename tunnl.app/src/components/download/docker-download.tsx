'use client'

import DownloadButton from "./download-button";

const DockerDownload = () => {
    return (
        <div className='w-96 flex flex-col gap-4'>
            <p>
                There are other docker images that can be used to host a service 
                within the openziti docker organization that you may want to check out.
            </p>
            <div className='flex justify-center mt-4'>
                <DownloadButton href='https://hub.docker.com/r/openziti/ziti-edge-tunnel/tags'>
                    Docker Tunneler Image
                </DownloadButton>
            </div>
        </div>
    );
}

export default DockerDownload;
