import AppLayout from '@/layouts/app-layout';
import { dashboard, repository } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BookOpen, TrendingUp, Users, Calendar, FileText, Award } from 'lucide-react';

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

const COLORS = ['#ca8a04', '#eab308', '#facc15', '#fde047', '#fef08a', '#fef9c3'];

export default function Dashboard({ stats, charts, recentRepositories }: DashboardProps) {
    const yearGrowth = stats.totalLastYear > 0 
        ? ((stats.totalThisYear - stats.totalLastYear) / stats.totalLastYear * 100).toFixed(1)
        : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-yellow-50 to-white p-6 shadow-sm dark:border-sidebar-border dark:from-yellow-950/20 dark:to-neutral-900">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">Total Repositories</p>
                                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.totalRepositories}</h3>
                                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">All time</p>
                            </div>
                            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                                <BookOpen className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm dark:border-sidebar-border dark:from-blue-950/20 dark:to-neutral-900">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">This Year</p>
                                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.totalThisYear}</h3>
                                <p className="mt-1 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                    <TrendingUp className="h-3 w-3" />
                                    {yearGrowth}% from last year
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm dark:border-sidebar-border dark:from-purple-950/20 dark:to-neutral-900">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">Unique Authors</p>
                                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.uniqueAuthors}</h3>
                                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">Contributing researchers</p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-green-50 to-white p-6 shadow-sm dark:border-sidebar-border dark:from-green-950/20 dark:to-neutral-900">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">Last Year</p>
                                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.totalLastYear}</h3>
                                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">Previous year total</p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Repositories by Year - Line Chart */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-neutral-900">
                        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Repositories by Year (Last 5 Years)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={charts.byYear}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis 
                                    dataKey="year" 
                                    stroke="#6b7280"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis 
                                    stroke="#6b7280"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1f2937', 
                                        border: 'none', 
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="total" 
                                    name="Total Repositories"
                                    stroke="#ca8a04" 
                                    strokeWidth={3}
                                    dot={{ fill: '#ca8a04', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Repositories by Type - Pie Chart */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-neutral-900">
                        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Repositories by Type</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={charts.byType}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry: any) => `${entry.type}: ${(entry.percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="total"
                                >
                                    {charts.byType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1f2937', 
                                        border: 'none', 
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Repositories by Research Group - Bar Chart */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-neutral-900 lg:col-span-2">
                        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Top 5 Research Groups</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={charts.byGroup}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis 
                                    dataKey="group" 
                                    stroke="#6b7280"
                                    style={{ fontSize: '11px' }}
                                    angle={-15}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis 
                                    stroke="#6b7280"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#1f2937', 
                                        border: 'none', 
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Legend />
                                <Bar 
                                    dataKey="total" 
                                    name="Total Repositories"
                                    fill="#ca8a04" 
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Repositories */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Repositories</h3>
                        <Link 
                            href={repository().url}
                            className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentRepositories.map((repo) => (
                            <Link
                                key={repo.id}
                                href={`/repository/${repo.id}`}
                                className="group flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:border-yellow-300 hover:shadow-md dark:border-neutral-800 dark:hover:border-yellow-700"
                            >
                                <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/30">
                                    <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-yellow-600 dark:text-white dark:group-hover:text-yellow-400">
                                        {repo.title}
                                    </h4>
                                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-neutral-400">
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {repo.author}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {repo.year}
                                        </span>
                                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
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
