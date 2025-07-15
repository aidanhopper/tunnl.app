'use client'

import { Card, CardContent } from "../ui/card";
import AndroidDownload from "./android-download";
import DockerDownload from "./docker-download";
import IOSDownload from "./ios-download";
import LinuxDownload from "./linux-download";
import MacOSDownload from "./macos-download";
import { usePlatform } from "./platform-provider";
import WindowsDownload from "./windows-download";

const Switch = () => {
    const { platform } = usePlatform();
    switch (platform) {
        case 'iOS': return <IOSDownload />;
        case 'MacOS': return <MacOSDownload />;
        case 'Linux': return <LinuxDownload />;
        case 'Docker': return <DockerDownload/>;
        case 'Android': return <AndroidDownload />;
        case 'Windows': return <WindowsDownload />;
        default: return <></>;
    }
}

const PlatformSwitch = () => {
    const { platform } = usePlatform();
    return platform ? (
        <Card>
            <CardContent className='flex items-center justify-center'>
                <Switch />
            </CardContent>
        </Card>
    ) : <></>;
}

export default PlatformSwitch;
