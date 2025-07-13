'use client'

import { ChartContainer } from "@/components/ui/chart";
import { type ChartConfig } from "@/components/ui/chart"
import { IGetServiceDialsByServiceIdResult } from "@/db/types/service_dials.queries";
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";

const fillDialData = (
    serviceDials: { timestamp: Date; dials: number }[]
): { timestamp: string; dialCount: number }[] => {
    if (serviceDials.length === 0) return [];

    const sorted = [...serviceDials].sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    const start = sorted[0].timestamp;
    const now = new Date();

    const interval = 120; // seconds
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

import { TooltipProps } from 'recharts';

type CustomTooltipProps = TooltipProps<number, string>;

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <div className="rounded-lg bg-white dark:bg-zinc-900 p-3 shadow-lg border text-sm">
            <div className="font-medium text-zinc-700 dark:text-zinc-200">
                {label}
            </div>
            <ul className="mt-1 space-y-1">
                {payload.map((entry, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-zinc-800 dark:text-zinc-100">
                            {entry.name} in the last minute: {entry.value}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
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
                    name="Time"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <YAxis />
                <Area
                    dataKey="dialCount"
                    name="Dials"
                    type="natural"
                    fill="url(#fillDesktop)"
                    stroke="var(--color-desktop)"
                    stackId="a"
                />
                <Tooltip content={<CustomTooltip />} />
            </AreaChart>
        </ChartContainer>
    );
}

export default DialChart;
