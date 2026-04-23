import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, IndianRupee, ShoppingBag, Package, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatINR } from "@/lib/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderRow {
  id: string;
  subtotal: number;
  status: string;
  created_at: string;
}
interface OrderItemRow {
  product_name: string;
  product_image: string | null;
  qty: number;
  unit_price: number;
  order_id: string;
}

const RANGES = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

export function DashboardTab() {
  const [days, setDays] = useState("30");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      const since = new Date();
      since.setDate(since.getDate() - Number(days));
      const sinceIso = since.toISOString();

      const [ordersRes, itemsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("id, subtotal, status, created_at")
          .gte("created_at", sinceIso)
          .order("created_at", { ascending: true }),
        supabase
          .from("order_items")
          .select("product_name, product_image, qty, unit_price, order_id, orders!inner(created_at)")
          .gte("orders.created_at", sinceIso),
      ]);
      if (cancel) return;
      setOrders((ordersRes.data ?? []) as OrderRow[]);
      setItems((itemsRes.data ?? []) as unknown as OrderItemRow[]);
      setLoading(false);
    })();
    return () => {
      cancel = true;
    };
  }, [days]);

  const stats = useMemo(() => {
    const paidStatuses = new Set(["paid", "shipped", "delivered"]);
    const revenueOrders = orders.filter((o) => paidStatuses.has(o.status));
    const revenue = revenueOrders.reduce((s, o) => s + Number(o.subtotal), 0);
    const totalOrders = orders.length;
    const aov = revenueOrders.length ? revenue / revenueOrders.length : 0;
    const totalUnits = items.reduce((s, it) => s + Number(it.qty), 0);
    return { revenue, totalOrders, aov, totalUnits };
  }, [orders, items]);

  const dailyData = useMemo(() => {
    const map = new Map<string, { date: string; revenue: number; orders: number }>();
    const n = Number(days);
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map.set(key, { date: key, revenue: 0, orders: 0 });
    }
    const paidStatuses = new Set(["paid", "shipped", "delivered"]);
    orders.forEach((o) => {
      const key = o.created_at.slice(0, 10);
      const entry = map.get(key);
      if (!entry) return;
      entry.orders += 1;
      if (paidStatuses.has(o.status)) entry.revenue += Number(o.subtotal);
    });
    return Array.from(map.values()).map((e) => ({
      ...e,
      label: new Date(e.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    }));
  }, [orders, days]);

  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; image: string | null; qty: number; revenue: number }>();
    items.forEach((it) => {
      const cur = map.get(it.product_name) ?? {
        name: it.product_name,
        image: it.product_image,
        qty: 0,
        revenue: 0,
      };
      cur.qty += Number(it.qty);
      cur.revenue += Number(it.qty) * Number(it.unit_price);
      map.set(it.product_name, cur);
    });
    return Array.from(map.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [items]);

  const statusBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => map.set(o.status, (map.get(o.status) ?? 0) + 1));
    return Array.from(map.entries()).map(([status, count]) => ({ status, count }));
  }, [orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Sales overview</p>
        <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {RANGES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<IndianRupee className="h-4 w-4" />} label="Revenue" value={formatINR(stats.revenue)} />
        <StatCard icon={<ShoppingBag className="h-4 w-4" />} label="Orders" value={String(stats.totalOrders)} />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Avg. order value" value={formatINR(stats.aov)} />
        <StatCard icon={<Package className="h-4 w-4" />} label="Units sold" value={String(stats.totalUnits)} />
      </div>

      <div className="rounded-2xl border bg-card p-4 sm:p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Revenue over time</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                formatter={(v: number) => [formatINR(v), "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#revFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-4 sm:p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Orders per day</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 sm:p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Order status</h3>
          {statusBreakdown.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10 text-center">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {statusBreakdown.map((s) => {
                const pct = stats.totalOrders ? (s.count / stats.totalOrders) * 100 : 0;
                return (
                  <li key={s.status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize font-medium">{s.status}</span>
                      <span className="text-muted-foreground">{s.count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-4 sm:p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Top selling products</h3>
        {topProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">No sales in this period.</p>
        ) : (
          <ul className="divide-y">
            {topProducts.map((p, i) => (
              <li key={p.name} className="flex items-center gap-4 py-3">
                <span className="text-muted-foreground w-6 text-sm font-medium">#{i + 1}</span>
                {p.image ? (
                  <img src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-secondary" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.qty} units · {formatINR(p.revenue)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
