import {
    ChartContainer,
    ToolTipPersonalizado,
} from "@/components/charts/Charts";
import {
    Area,
    Bar,
    BarChart,
    ComposedChart,
    DefaultLegendContent,
    Label,
    LabelList,
    Legend,
    Pie,
    PieChart,
    PieSectorDataItem,
    Sector,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { toCurrency } from "@/lib/toCurrency";
import { Props } from "recharts/types/component/Legend";
import { useState } from "react";
import { DollarSign, Layers } from "lucide-react";

const LengendOrdenada = (props: Props) => {
    const { payload } = props as any;
    const payloadAtualizado = payload.sort((a: any, b: any) =>
        a.dataKey === "arrecadado" ? -1 : b.dataKey === "arrecadado" ? 1 : 0,
    );
    return <DefaultLegendContent {...props} payload={payloadAtualizado} />;
};
const renderShape = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    dataKey,
    percent,
    value,
}: PieSectorDataItem) => {
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * (midAngle ?? 1));
    const cos = Math.cos(-RADIAN * (midAngle ?? 1));
    const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
    const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
    const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
    const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 15;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
        <g>
            <text
                style={{ textTransform: "capitalize" }}
                x={cx}
                y={cy}
                dy={8}
                textAnchor="middle"
                fill={fill}
            >
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={(outerRadius ?? 0) + 6}
                outerRadius={(outerRadius ?? 0) + 10}
                fill={fill}
            />
            <path
                d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                stroke={fill}
                fill="none"
            />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                textAnchor={textAnchor}
                fill={fill}
                style={{ fontFamily: "var(--font-serif)", textAlign: "center" }}
            >
                {dataKey === "arrecadado"
                    ? toCurrency(value)
                    : `${value} vendas`}
            </text>
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                dy={18}
                textAnchor={textAnchor}
                fill="var(--text-secondary)"
                style={{ fontFamily: "var(--font-serif)" }}
            >
                {`${((percent ?? 1) * 100).toFixed(2)}%`}
            </text>
        </g>
    );
};
const CustomPie = (props: any) => {
    if (!props.isActive) return <Sector {...props} />;

    return renderShape(props);
};

export function ChartFaturamento({
    isMobile,
    data,
    areaKeyName,
    bars,
}: {
    isMobile: boolean;
    data: any[];
    bars: any[];
    areaKeyName: string;
}) {
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

                <Tooltip content={ToolTipPersonalizado} />

                <YAxis
                    yAxisId={"esquerda"}
                    orientation="left"
                    domain={[0, (dataMax) => Math.round(dataMax * 1.05)]}
                    axisLine={false}
                    tickLine={false}
                    hide={isMobile}
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
                                    fontSize: "13px",
                                    textTransform: "capitalize",
                                    fontFamily: "var(--font-serif)",
                                }}
                            >
                                {areaKeyName === "arrecadado"
                                    ? toCurrency(payload.value)
                                    : payload.value}
                            </text>
                        );
                    }}
                />
                <YAxis
                    hide
                    yAxisId={"direita"}
                    orientation={"right"}
                    domain={[0, (dataMax) => dataMax * 1.05]}
                />
                <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    style={{
                        fill: "var(--text-secondary)",
                        fontSize: 13,
                        fontFamily: "var(--font-serif)",
                    }}
                />
                <Legend
                    formatter={(v) => (
                        <span style={{ textTransform: "capitalize" }}>{v}</span>
                    )}
                    content={LengendOrdenada}
                />

                <Area
                    yAxisId="esquerda"
                    type={"monotone"}
                    strokeWidth={3}
                    fill="url(#colorUv)"
                    stroke="var(--brand-primary)"
                    dataKey={areaKeyName}
                    activeDot={{
                        stroke: "var(--brand-primary)",
                        fill: "var(--brand-primary)",
                        r: 6,
                    }}
                />
                {bars.map((v, i) => (
                    <Bar
                        stackId={2}
                        yAxisId={"direita"}
                        {...v}
                        key={`${i}-bar`}
                        radius={[4, 4, 4, 4]}
                        barSize={25}
                        opacity={0.5}
                        activeBar={{
                            stroke: "var(--text-primary)",
                            opacity: 0.8,
                        }}
                    >
                        <LabelList
                            dataKey={v.dataKey}
                            content={(props) => {
                                const { x, y, width, height, value } = props;
                                if (!value || value === 0) return null;

                                return (
                                    <text
                                        x={Number(x) + Number(width) * 0.5}
                                        y={Number(y) + Number(height) * 0.5}
                                        fill="var(--text-primary)"
                                        textAnchor="middle"
                                        dy={4}
                                        style={{
                                            fontSize: "12px",
                                            fontFamily: "var(--montserrat)",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {value}
                                    </text>
                                );
                            }}
                        />
                    </Bar>
                ))}
            </ComposedChart>
        </ChartContainer>
    );
}

export function ChartPieCustom({
    data,
    isMobile,
    type,
}: {
    data: any[];
    type: string;
    isMobile: boolean;
}) {
    return (
        <ChartContainer>
            <PieChart data={data}>
                <Tooltip active content={() => null} defaultIndex={0} />
                <Legend
                    formatter={(v) => (
                        <span style={{ textTransform: "capitalize" }}>{v}</span>
                    )}
                />
                <Pie
                    dataKey={type}
                    nameKey="name"
                    outerRadius={isMobile ? 80 : 120}
                    innerRadius={isMobile ? 50 : "50%"}
                    shape={CustomPie}
                    cx="50%"
                    cy="50%"
                    opacity={0.6}
                    stroke="0"
                    labelLine={false}
                />
            </PieChart>
        </ChartContainer>
    );
}

export function ChartPiePagamentos({
    data,
    isMobile,
}: {
    data: any[];
    isMobile: boolean;
}) {
    const [type, setType] = useState<"qtd" | "arrecadado">("qtd");

    return (
        <div className="transacoes__graficos__graficos__pie">
            <div className="transacoes__graficos__graficos__pie-opcs">
                <div className="transacoes__graficos__graficos__pie-opc">
                    <label htmlFor="grafico-pie-transacos-qtd">
                        <i>
                            <Layers />
                        </i>
                    </label>
                    <input
                        type="radio"
                        name="grafico-pie-transacoes"
                        id="grafico-pie-transacos-qtd"
                        readOnly
                        checked={type === "qtd"}
                        onChange={() => setType("qtd")}
                    />
                </div>

                <div className="transacoes__graficos__graficos__pie-opc">
                    <label htmlFor="grafico-pie-transacos-arrecadado">
                        <i>
                            <DollarSign />
                        </i>
                    </label>
                    <input
                        type="radio"
                        name="grafico-pie-transacoes"
                        id="grafico-pie-transacos-arrecadado"
                        readOnly
                        checked={type === "arrecadado"}
                        onChange={() => setType("arrecadado")}
                    />
                </div>
            </div>

            <div className="transacoes__graficos__graficos__grafico transacoes__graficos__graficos__grafico--pie">
                <ChartPieCustom data={data} type={type} isMobile={isMobile} />
            </div>
        </div>
    );
}

export function ChartBarPorCargos({
    data,
    keyName,
    onClick,
    isMobile,
    dataKey,
}: {
    data: any[];
    keyName: string;
    onClick: (key: string, name: string) => void;
    isMobile: boolean;
    dataKey?: string;
}) {
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
                    width={isMobile ? 70 : 120}
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
                    dataKey={dataKey || "inscritos"}
                    fill="var(--brand-primary)"
                    radius={[10, 10, 10, 10]}
                    barSize={28}
                    opacity={0.6}
                    label={{
                        position: "center",
                        fill: "var(--text-primary)",
                        fontSize: 12,
                    }}
                    activeBar={{
                        stroke: "var(--text-secondary)",
                        opacity: 1,
                    }}
                    alignmentBaseline="hanging"
                    type="accent"
                    onClick={(v) => onClick(keyName, v.name || "")}
                />
            </BarChart>
        </ChartContainer>
    );
}
