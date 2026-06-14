"use client";

import {
    Area,
    Bar,
    BarChart,
    ComposedChart,
    Legend,
    Line,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import useResize from "@/hooks/useResize";
import {
    ChartContainer,
    ChartPie,
    ToolTipPersonalizado,
} from "@/components/charts/Charts";
import { toCurrency } from "@/lib/toCurrency";
import { ChartArea, ChartPieIcon, UsersRound } from "lucide-react";
import { useDataContext } from "@/contexts/DataContext";
import { useMemo } from "react";

export function ChartArrecadacao({ data }: { data: any[] }) {
    const isMobile = useResize(480);
    return (
        <ChartContainer>
            <ComposedChart data={data}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="var(--brand-primary)"
                            stopOpacity={0.5}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--brand-primary)"
                            stopOpacity={0.05}
                        />
                    </linearGradient>
                </defs>

                <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    style={{
                        fill: "var(--text-secondary)",
                        fontSize: 12,
                        fontFamily: "var(--font-serif)",
                    }}
                />
                <YAxis
                    hide={isMobile}
                    orientation="left"
                    yAxisId={"esquerda"}
                    domain={[0, (dataMax) => Math.round(dataMax * 1.15)]}
                    tick={(props) => {
                        const { x, y, payload } = props;
                        return (
                            <text
                                x={x}
                                y={y}
                                dy={4}
                                textAnchor="end"
                                fill="var(--text-secondary)"
                                style={{
                                    fontSize: isMobile ? "10px" : "13px",
                                    textTransform: "capitalize",
                                    fontFamily: "var(--font-serif)",
                                }}
                            >
                                {toCurrency(payload.value)}
                            </text>
                        );
                    }}
                />
                <YAxis
                    yAxisId={"direita"}
                    orientation={"right"}
                    hide
                    domain={[0, (dataMax) => dataMax * 1.15]}
                />
                <Tooltip content={ToolTipPersonalizado} />
                <Legend
                    formatter={(v) => (
                        <span style={{ textTransform: "capitalize" }}>{v}</span>
                    )}
                />
                <Line
                    type={"monotone"}
                    yAxisId="esquerda"
                    dataKey="arrecadado"
                    strokeWidth="3"
                    stroke="var(--accent-color)"
                    dot={{
                        r: 4,
                        stroke: "var(--accent-color)",
                        fill: "var(--bg-primary)",
                        strokeWidth: 2,
                    }}
                    activeDot={{
                        stroke: "var(--accent-color)",
                        fill: "var(--accent-color)",
                        r: 6,
                    }}
                />
                <Area
                    yAxisId="direita"
                    type={"monotone"}
                    strokeWidth={3}
                    fill="url(#colorUv)"
                    stroke="var(--brand-primary)"
                    dataKey="vendas"
                    activeDot={{
                        stroke: "var(--brand-primary)",
                        fill: "var(--brand-primary)",
                        r: 6,
                    }}
                />
            </ComposedChart>
        </ChartContainer>
    );
}

export function BarPorCongregacao({ data }: { data: any[] }) {
    const isMobile = useResize(480);

    return (
        <ChartContainer heigth={data.length * 50}>
            <BarChart
                layout="vertical"
                data={data}
                margin={
                    isMobile
                        ? { top: 0, left: 0, right: 0, bottom: 0 }
                        : { top: 10, right: 30, left: 10, bottom: 0 }
                }
            >
                <XAxis type="number" hide />

                <YAxis
                    type="category"
                    dataKey="name"
                    width={isMobile ? 100 : 120}
                    axisLine={false}
                    tickLine={false}
                    textAnchor="end"
                    tick={(props) => {
                        const { x, y, payload } = props;
                        return (
                            <text
                                x={x}
                                y={y}
                                dy={4}
                                textAnchor="end"
                                fill="var(--text-secondary)"
                                style={{
                                    fontSize: isMobile ? "10px" : "13px",
                                    textTransform: "capitalize",
                                    fontFamily: "var(--font-serif)",
                                }}
                            >
                                {payload.value}
                            </text>
                        );
                    }}
                />

                <Tooltip
                    content={ToolTipPersonalizado}
                    cursor={{ fill: "var(--bg-secondary)" }}
                />

                <Bar
                    dataKey="inscritos"
                    fill="var(--brand-primary)"
                    radius={[0, 4, 4, 0]}
                    barSize={28}
                    label={{
                        position: "center",
                        fill: "var(--text-primary)",
                        fontSize: 12,
                    }}
                />
            </BarChart>
        </ChartContainer>
    );
}

export default function ChartsLista() {
    const {
        responsesMemo: {
            transacoesArrecadacao,
            transacoesPorStatus,
            credenciaisPorCongregacao,
        },
    } = useDataContext();
    const transacoesStatus = useMemo(
        () => Object.values(transacoesPorStatus),
        [],
    );

    return (
        <div className="admin__charts">
            <div className="admin__chart">
                <h2>
                    <i>
                        <ChartArea />
                    </i>
                    <span>Vendas X Arrecadação</span>
                </h2>

                <ChartArrecadacao data={transacoesArrecadacao} />
            </div>
            <div className="admin__chart">
                <h2>
                    <i>
                        <ChartPieIcon />
                    </i>
                    <span>Status Pagamentos</span>
                </h2>

                <ChartPie dataKey="value" data={transacoesStatus} />
            </div>
            <div className="admin__chart">
                <h2>
                    <i>
                        <UsersRound />
                    </i>
                    <span>Pessoas por Congregação</span>
                </h2>

                <BarPorCongregacao data={credenciaisPorCongregacao} />
            </div>
        </div>
    );
}
