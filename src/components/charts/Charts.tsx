"use client";

import { toCurrency } from "@/lib/toCurrency";
import { ReactNode } from "react";
import {
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Sector,
    Tooltip,
    TooltipContentProps,
} from "recharts";
import "./charts-admin.scss";

export const ToolTipPersonalizado = ({
    payload,
    active,
    label,
}: TooltipContentProps) => {
    if (!active || !payload.length) return null;
    return (
        <div className="tooltip-dinheiro">
            {label && (
                <div className="tooltip-dinheiro__header">
                    <h3>{label}</h3>
                </div>
            )}

            <div className="tooltip-dinheiro__body">
                <div className="tooltip-dinheiro__secao">
                    {payload.map((v: any) => (
                        <div key={v.name} className="tooltip-dinheiro__item">
                            <h4 style={{ color: v.color }}>{v.name}</h4>
                            <p style={{ color: v.color }}>
                                {v.name === "arrecadado" ||
                                v.dataKey === "arrecadado"
                                    ? toCurrency(v.value)
                                    : v.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const ChartContainer = ({
    children,
    heigth,
}: {
    children: ReactNode;
    heigth?: number | `${number}%`;
}) => (
    <div className="admin__chart-chart">
        <ResponsiveContainer width={"100%"} height={heigth || 400}>
            {children}
        </ResponsiveContainer>
    </div>
);

export function ChartPie({
    data,
    dataKey,
    fontSize = 20,
}: {
    data: any[];
    dataKey: string;
    fontSize?: number;
}) {
    return (
        <ChartContainer>
            <PieChart data={data}>
                <Tooltip content={ToolTipPersonalizado} />
                <Legend
                    formatter={(v) => (
                        <span style={{ textTransform: "capitalize" }}>{v}</span>
                    )}
                />
                <Pie
                    dataKey={dataKey}
                    nameKey="name"
                    outerRadius={130}
                    opacity={0.8}
                    label={({ x, y, textAnchor, fill, value, dataKey }) => (
                        <text
                            x={x}
                            y={y}
                            fill={fill}
                            style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: fontSize,
                                textAnchor,
                            }}
                        >
                            {dataKey === "arrecadado"
                                ? toCurrency(value)
                                : value}
                        </text>
                    )}
                    stroke="0"
                    labelLine={false}
                    cornerRadius={5}
                    isAnimationActive
                    shape={(props: any) => {
                        const RADIAN = Math.PI / 180;
                        const { cx, cy, midAngle, isActive } = props;
                        const sin = Math.sin(-RADIAN * (midAngle ?? 1));
                        const cos = Math.cos(-RADIAN * (midAngle ?? 1));
                        const offset = 1.5;
                        const newCx = cx + offset * cos;
                        const newCy = cy + offset * sin;

                        return (
                            <Sector
                                {...props}
                                opacity={isActive ? 1 : 0.8}
                                outerRadius={isActive ? 125 : 130}
                                cx={isActive ? newCx : cx}
                                cy={isActive ? newCy : cy}
                            />
                        );
                    }}
                />
            </PieChart>
        </ChartContainer>
    );
}
