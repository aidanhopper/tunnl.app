'use client'

import { ChartContainer } from "@/components/ui/chart";
import { type ChartConfig } from "@/components/ui/chart"
import { IGetServiceDialsByServiceIdResult } from "@/db/types/service_dials.queries";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

const fillDialData = (
    serviceDials: { timestamp: Date; dials: number }[]
): { timestamp: string; dialCount: number }[] => {
    if (serviceDials.length === 0) return [];

    const sorted = [...serviceDials].sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    const start = sorted[0].timestamp;
    const now = new Date();

    const interval = 60; // seconds
    const result: { timestamp: string; dialCount: number }[] = [];

    // Map of rounded timestamps (in seconds) to dials
    const dataMap = new Map(
        sorted.map(d => [Math.floor(d.timestamp.getTime() / 1000), d.dials])
    );

    for (let t = start.getTime(); t <= now.getTime(); t += interval * 1000) {
        const seconds = Math.floor(t / 1000);
        const dials = dataMap.get(seconds) ?? 0;
        result.push({
            timestamp: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            dialCount: dials,
        });
    }

    return result;
};

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--color-primary)",
    },
} satisfies ChartConfig

const DialChart = ({ serviceDials }: { serviceDials: IGetServiceDialsByServiceIdResult[] }) => {
    const chartData = fillDialData(serviceDials);
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <AreaChart accessibilityLayer data={chartData}>
                <defs>
                    <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="var(--color-desktop)"
                            stopOpacity={0.6}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-desktop)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={true} />
                <XAxis
                    dataKey="timestamp"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                // tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <Area
                    dataKey="dialCount"
                    type="natural"
                    fill="url(#fillDesktop)"
                    stroke="var(--color-desktop)"
                    stackId="a"
                />
                <Tooltip />
            </AreaChart>
        </ChartContainer>
    );
}

export default DialChart;
