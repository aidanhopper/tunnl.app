'use client'

import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { EnrichedZitiCircuitEvent } from '@/lib/events/event-enricher';
import { ZitiCircuitEvent } from '@/lib/events/types';
import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DialChartProps {
    events: EnrichedZitiCircuitEvent[];
    hoursBack?: number;
    intervalMinutes?: number;
}

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--color-foreground)",
    },
} satisfies ChartConfig

const DialEventsChart: React.FC<DialChartProps> = ({
    events,
    hoursBack = 24,
    intervalMinutes = 5 
}) => {
    const [chartData, setChartData] = useState<{
        timestamp: string;
        time: string;
        date: string;
        count: number;
    }[]>([]);

    useEffect(() => {
        const now = new Date();
        const startTime = new Date(now.getTime() - (hoursBack * 60 * 60 * 1000));

        // Filter events within the time range
        const filteredEvents = events.filter(event => {
            const eventTime = new Date(event.event.createdAt);
            return eventTime >= startTime && eventTime <= now;
        });

        // Create time buckets
        const buckets = new Map<string, number>();
        const intervalMs = intervalMinutes * 60 * 1000;

        // Initialize all buckets with 0
        for (let i = 0; i < (hoursBack * 60) / intervalMinutes; i++) {
            const bucketStart = new Date(startTime.getTime() + (i * intervalMs));
            const bucketKey = bucketStart.toISOString();
            buckets.set(bucketKey, 0);
        }

        // Count events in each bucket
        filteredEvents.forEach(event => {
            const eventTime = new Date(event.event.createdAt);
            const bucketIndex = Math.floor((eventTime.getTime() - startTime.getTime()) / intervalMs);
            const bucketStart = new Date(startTime.getTime() + (bucketIndex * intervalMs));
            const bucketKey = bucketStart.toISOString();

            if (buckets.has(bucketKey)) {
                buckets.set(bucketKey, buckets.get(bucketKey)! + 1);
            }
        });

        // Convert to chart data format
        const ret = Array.from(buckets.entries())
            .map(([timestamp, count]) => ({
                timestamp,
                time: new Date(timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                date: new Date(timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                }),
                count
            }))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        setChartData(ret);
    }, [events, hoursBack, intervalMinutes]);

    const formatTooltip = (value: any, name: string) => {
        if (name === 'count') {
            return [`${value} dials`, 'Count'];
        }
        return [value, name];
    };

    const formatLabel = (label: string) => {
        const data = chartData.find(d => d.time === label);
        return data ? `${data.date} ${data.time}` : label;
    };

    return (
        <ChartContainer config={chartConfig}>
            <BarChart
                data={chartData}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="time"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={Math.floor(chartData.length / 8)} // Show ~8 labels max
                />
                <YAxis />
                <Tooltip
                    formatter={formatTooltip}
                    labelFormatter={formatLabel}
                    contentStyle={{
                        backgroundColor: 'var(--color-card)', // Dark gray background
                        border: 'var(--color-border)',
                        borderRadius: '8px',
                    }}
                    labelStyle={{
                        color: 'var(--color-card-foreground)'
                    }}
                />
                <Bar
                    dataKey="count"
                    fill="var(--color-primary)"
                    name="Dials"
                />
            </BarChart>
        </ChartContainer>
    );
};

export default DialEventsChart;
