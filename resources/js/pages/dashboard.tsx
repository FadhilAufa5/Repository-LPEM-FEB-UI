import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    ArrowRight,
    ArrowUpRight,
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
    '#eab308', // yellow-500
    '#f59e0b', // amber-500
    '#fb923c', // orange-400
    '#fbbf24', // amber-400
    '#fcd34d', // amber-300
    '#fde047', // yellow-300
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

    const growthIsPositive = Number(yearGrowth) > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-3xl">
                        Dashboard Overview
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                        Monitor your research repository statistics and insights
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Repositories */}
                    <Card className="border-l-4 border-l-yellow-500 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                                    Total Repositories
                                </CardTitle>
                                <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                                    <BookOpen className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stats.totalRepositories}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                                All time collection
                            </p>
                        </CardContent>
                    </Card>

                    {/* This Year */}
                    <Card className="border-l-4 border-l-amber-500 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                                    This Year
                                </CardTitle>
                                <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                                    <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stats.totalThisYear}
                            </div>
                            <div className="mt-1 flex items-center gap-1">
                                {growthIsPositive ? (
                                    <>
                                        <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                                        <p className="text-xs font-medium text-green-600 dark:text-green-400">
                                            +{yearGrowth}% from last year
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-xs text-gray-500 dark:text-neutral-500">
                                        {yearGrowth}% from last year
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Unique Authors */}
                    <Card className="border-l-4 border-l-orange-500 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                                    Unique Authors
                                </CardTitle>
                                <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                                    <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stats.uniqueAuthors}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                                Contributing researchers
                            </p>
                        </CardContent>
                    </Card>

                    {/* Last Year */}
                    <Card className="border-l-4 border-l-yellow-600 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                                    Last Year
                                </CardTitle>
                                <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                                    <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stats.totalLastYear}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                                Previous year total
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Repositories by Year */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Repositories by Year
                            </CardTitle>
                            <CardDescription>
                                Publication trends over the last 5 years
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={charts.byYear}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#e5e7eb"
                                        className="dark:stroke-neutral-800"
                                    />
                                    <XAxis
                                        dataKey="year"
                                        stroke="#9ca3af"
                                        className="dark:stroke-neutral-500"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis
                                        stroke="#9ca3af"
                                        className="dark:stroke-neutral-500"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fefce8',
                                            border: '1px solid #eab308',
                                            borderRadius: '8px',
                                            padding: '12px',
                                        }}
                                        labelStyle={{
                                            color: '#713f12',
                                            fontWeight: 600,
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        name="Total Repositories"
                                        stroke="#eab308"
                                        strokeWidth={3}
                                        dot={{ fill: '#eab308', r: 5 }}
                                        activeDot={{ r: 7 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Repositories by Type */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Repositories by Type</CardTitle>
                            <CardDescription>
                                Distribution across document categories
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
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
                                            backgroundColor: '#fefce8',
                                            border: '1px solid #eab308',
                                            borderRadius: '8px',
                                            padding: '12px',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Top 5 Research Groups */}
                    <Card className="shadow-sm lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Top 5 Research Groups</CardTitle>
                            <CardDescription>
                                Most active research teams by publication count
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={charts.byGroup}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#e5e7eb"
                                        className="dark:stroke-neutral-800"
                                    />
                                    <XAxis
                                        dataKey="group"
                                        stroke="#9ca3af"
                                        className="dark:stroke-neutral-500"
                                        style={{ fontSize: '11px' }}
                                        angle={-15}
                                        textAnchor="end"
                                        height={100}
                                    />
                                    <YAxis
                                        stroke="#9ca3af"
                                        className="dark:stroke-neutral-500"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fefce8',
                                            border: '1px solid #eab308',
                                            borderRadius: '8px',
                                            padding: '12px',
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="total"
                                        name="Total Repositories"
                                        fill="#eab308"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Repositories */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Repositories</CardTitle>
                                <CardDescription>
                                    Latest research publications added to the collection
                                </CardDescription>
                            </div>
                            <Link href={repository().url}>
                                <Button size="sm" className="gap-1">
                                    View All
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentRepositories.map((repo) => (
                                <Link
                                    key={repo.id}
                                    href={`/repository/${repo.id}`}
                                    className="group flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-yellow-400 hover:bg-yellow-50 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-yellow-600 dark:hover:bg-yellow-950/20"
                                >
                                    <div className="rounded-lg bg-yellow-100 p-2.5 transition-colors group-hover:bg-yellow-200 dark:bg-yellow-900/30 dark:group-hover:bg-yellow-900/50">
                                        <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="line-clamp-1 font-semibold text-gray-900 transition-colors group-hover:text-yellow-600 dark:text-white dark:group-hover:text-yellow-400">
                                                {repo.title}
                                            </h4>
                                            <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-400 opacity-0 transition-all group-hover:text-yellow-600 group-hover:opacity-100 dark:group-hover:text-yellow-400" />
                                        </div>
                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-neutral-400">
                                            <span className="flex items-center gap-1.5">
                                                <Users className="h-3.5 w-3.5" />
                                                {repo.author}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {repo.year}
                                            </span>
                                            <Badge variant="secondary" className="font-medium">
                                                {repo.type}
                                            </Badge>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
