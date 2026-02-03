import AppLayout from '@/layouts/app-layout';
import { dashboard, repository } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Calendar,
    FileText,
    TrendingUp,
    Users,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    stats: {
        totalRepositories: number;
        totalThisYear: number;
        totalLastYear: number;
        uniqueAuthors: number;
    };
    charts: {
        byYear: Array<{ year: string; total: number }>;
        byType: Array<{ type: string; total: number }>;
        byGroup: Array<{ group: string; total: number }>;
    };
    recentRepositories: Array<{
        id: number;
        title: string;
        author: string;
        year: number;
        type: string;
    }>;
}

const COLORS = [
    '#0ea5e9',
    '#06b6d4',
    '#14b8a6',
    '#10b981',
    '#84cc16',
    '#eab308',
];

export default function Dashboard({
    stats,
    charts,
    recentRepositories,
}: DashboardProps) {
    const yearGrowth =
        stats.totalLastYear > 0
            ? (
                  ((stats.totalThisYear - stats.totalLastYear) /
                      stats.totalLastYear) *
                  100
              ).toFixed(1)
            : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:from-blue-950/20 dark:to-slate-900">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Total Repositories
                                </p>
                                <h3 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
                                    {stats.totalRepositories}
                                </h3>
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                                    All time
                                </p>
                            </div>
                            <div className="rounded-xl bg-blue-100 p-3 transition-transform group-hover:scale-110 dark:bg-blue-900/30">
                                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-400 to-blue-600" />
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-cyan-50 to-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:from-cyan-950/20 dark:to-slate-900">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    This Year
                                </p>
                                <h3 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
                                    {stats.totalThisYear}
                                </h3>
                                <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                    {yearGrowth}% from last year
                                </p>
                            </div>
                            <div className="rounded-xl bg-cyan-100 p-3 transition-transform group-hover:scale-110 dark:bg-cyan-900/30">
                                <Calendar className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-400 to-cyan-600" />
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-teal-50 to-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:from-teal-950/20 dark:to-slate-900">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Unique Authors
                                </p>
                                <h3 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
                                    {stats.uniqueAuthors}
                                </h3>
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                                    Contributing researchers
                                </p>
                            </div>
                            <div className="rounded-xl bg-teal-100 p-3 transition-transform group-hover:scale-110 dark:bg-teal-900/30">
                                <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-teal-400 to-teal-600" />
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:from-emerald-950/20 dark:to-slate-900">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Last Year
                                </p>
                                <h3 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
                                    {stats.totalLastYear}
                                </h3>
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                                    Previous year total
                                </p>
                            </div>
                            <div className="rounded-xl bg-emerald-100 p-3 transition-transform group-hover:scale-110 dark:bg-emerald-900/30">
                                <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Repositories by Year
                            </h3>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                Last 5 years trend
                            </p>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={charts.byYear}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e2e8f0"
                                    opacity={0.5}
                                />
                                <XAxis
                                    dataKey="year"
                                    stroke="#64748b"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        padding: '12px',
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    name="Total Repositories"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    dot={{ fill: '#0ea5e9', r: 6 }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Repositories by Type
                            </h3>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                Distribution across categories
                            </p>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={charts.byType}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry: any) =>
                                        `${entry.type}: ${(entry.percent * 100).toFixed(0)}%`
                                    }
                                    outerRadius={90}
                                    fill="#8884d8"
                                    dataKey="total"
                                >
                                    {charts.byType.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        padding: '12px',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-700 dark:bg-slate-900">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Top 5 Research Groups
                            </h3>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                Most active research teams
                            </p>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={charts.byGroup}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e2e8f0"
                                    opacity={0.5}
                                />
                                <XAxis
                                    dataKey="group"
                                    stroke="#64748b"
                                    style={{ fontSize: '11px' }}
                                    angle={-15}
                                    textAnchor="end"
                                    height={100}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        padding: '12px',
                                    }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="total"
                                    name="Total Repositories"
                                    fill="#0ea5e9"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Recent Repositories
                            </h3>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                Latest research publications
                            </p>
                        </div>
                        <Link
                            href={repository().url}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md dark:hover:bg-blue-700"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentRepositories.map((repo) => (
                            <Link
                                key={repo.id}
                                href={`/repository/${repo.id}`}
                                className="group flex items-start gap-4 rounded-xl border border-slate-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-md dark:border-slate-700 dark:hover:border-blue-600 dark:hover:bg-slate-800"
                            >
                                <div className="rounded-lg bg-blue-100 p-2.5 transition-colors group-hover:bg-blue-200 dark:bg-blue-900/30 dark:group-hover:bg-blue-900/50">
                                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="line-clamp-1 font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                        {repo.title}
                                    </h4>
                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                                        <span className="flex items-center gap-1.5">
                                            <Users className="h-3.5 w-3.5" />
                                            {repo.author}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {repo.year}
                                        </span>
                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700 transition-colors group-hover:bg-blue-200 group-hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400">
                                            {repo.type}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
