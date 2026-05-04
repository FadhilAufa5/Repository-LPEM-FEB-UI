import { useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import otp from '@/routes/otp';
import { Form, Head } from '@inertiajs/react';
import { KeyRound, Mail } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('otp');
    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState('');

    return (
        <AuthLayout
            title="Masuk ke Akun Anda"
            description={
                loginMethod === 'otp'
                    ? otpSent
                        ? 'Enter the OTP code sent to your email'
                        : 'Enter your registered email to receive an OTP code'
                    : 'Enter your email and password below to log in'
            }
        >
            <Head title="Masuk" />

            {/* Status Message */}
            {status && (
                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400">
                    {status}
                </div>
            )}

            {/* Login Method Toggle */}
            <div className="mb-6 flex gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1 dark:border-neutral-800 dark:bg-neutral-900">
                <button
                    type="button"
                    onClick={() => {
                        setLoginMethod('otp');
                        setOtpSent(false);
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        loginMethod === 'otp'
                            ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200 dark:bg-neutral-800 dark:text-white dark:ring-neutral-700'
                            : 'text-gray-500 hover:text-gray-700 dark:text-neutral-500 dark:hover:text-neutral-300'
                    }`}
                >
                    <Mail className="h-4 w-4" />
                    OTP Login
                </button>
                <button
                    type="button"
                    onClick={() => setLoginMethod('password')}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        loginMethod === 'password'
                            ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200 dark:bg-neutral-800 dark:text-white dark:ring-neutral-700'
                            : 'text-gray-500 hover:text-gray-700 dark:text-neutral-500 dark:hover:text-neutral-300'
                    }`}
                >
                    <KeyRound className="h-4 w-4" />
                    Password Login
                </button>
            </div>

            {/* OTP Login Flow — Step 1: Email */}
            {loginMethod === 'otp' && !otpSent && (
                <Form
                    {...otp.request.form()}
                    onSuccess={() => setOtpSent(true)}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Alamat email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                        autoComplete="email"
                                        placeholder="nama@gmail.com"
                                        className="h-11"
                                    />
                                    <InputError message={errors.email} />
                                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                                        Hanya akun terdaftar yang dapat menggunakan
                                        OTP. Hubungi admin jika membutuhkan akses.
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="h-11 w-full bg-yellow-600 text-white hover:bg-yellow-700"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    Kirim kode OTP
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            )}

            {/* OTP Login Flow — Step 2: Verify */}
            {loginMethod === 'otp' && otpSent && (
                <Form
                    {...otp.verify.form()}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="email" value={email} />
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="otp">Kode OTP</Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        name="otp"
                                        required
                                        autoFocus
                                        maxLength={6}
                                        placeholder="000000"
                                        className="h-14 text-center text-2xl font-bold tracking-[0.5em]"
                                    />
                                    <InputError message={errors.otp} />
                                    <InputError message={errors.email} />
                                    <p className="text-center text-xs text-gray-500 dark:text-neutral-400">
                                        Periksa email{' '}
                                        <span className="font-semibold text-gray-700 dark:text-neutral-200">
                                            {email}
                                        </span>{' '}
                                        untuk kode 6-digit
                                    </p>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox id="remember" name="remember" />
                                    <Label htmlFor="remember">Ingat saya</Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="h-11 w-full bg-yellow-600 text-white hover:bg-yellow-700"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    Verifikasi &amp; Masuk
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 w-full"
                                    onClick={() => setOtpSent(false)}
                                >
                                    Kembali ke Email
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            )}

            {/* Password Login Flow */}
            {loginMethod === 'password' && (
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Alamat email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="nama@gmail.com"
                                        className="h-11"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Kata sandi</Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="text-xs text-yellow-600 hover:text-yellow-700 dark:text-yellow-400"
                                                tabIndex={5}
                                            >
                                                Lupa kata sandi?
                                            </TextLink>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Kata sandi"
                                        className="h-11"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                    />
                                    <Label htmlFor="remember">Ingat saya</Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="h-11 w-full bg-yellow-600 text-white hover:bg-yellow-700"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner />}
                                    Masuk
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            )}

            {/* {canRegister && (
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Belum punya akun?{' '}
                    <TextLink href={register()} tabIndex={5}>
                        Daftar
                    </TextLink>
                </div>
            )} */}
        </AuthLayout>
    );
}
