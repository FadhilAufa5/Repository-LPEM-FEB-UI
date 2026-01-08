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

            {/* Login Method Toggle */}
            <div className="mb-6 flex gap-2 rounded-lg bg-muted p-1">
                    <button
                    type="button"
                    onClick={() => {
                        setLoginMethod('otp');
                        setOtpSent(false);
                    }}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        loginMethod === 'otp'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    OTP Login
                </button>
                <button
                    type="button"
                    onClick={() => setLoginMethod('password')}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        loginMethod === 'password'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Password Login
                </button>
            </div>

            {/* OTP Login Flow */}
            {loginMethod === 'otp' && !otpSent && (
                <Form
                    {...otp.request.form()}
                    onSuccess={() => setOtpSent(true)}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Alamat email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        autoFocus
                                        autoComplete="email"
                                        placeholder="nama@gmail.com"
                                    />
                                    <InputError message={errors.email} />
                                    <p className="text-xs text-muted-foreground">
                                        Hanya akun terdaftar yang dapat menggunakan
                                        OTP. Hubungi admin jika membutuhkan akses.
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
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

            {/* OTP Verification */}
            {loginMethod === 'otp' && otpSent && (
                <Form
                    {...otp.verify.form()}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="email" value={email} />
                            <div className="grid gap-6">
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
                                        className="text-center text-2xl tracking-widest"
                                    />
                                    <InputError message={errors.otp} />
                                    <InputError message={errors.email} />
                                    <p className="text-xs text-muted-foreground">
                                        Periksa email Anda untuk kode 6-digit
                                    </p>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox id="remember" name="remember" />
                                    <Label htmlFor="remember">
                                        Ingat saya
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    Verifikasi & Masuk
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
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
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
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
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Kata sandi
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="ml-auto text-sm"
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
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                    />
                                    <Label htmlFor="remember">
                                        Ingat saya
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-4 w-full"
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

            {canRegister && (
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Belum punya akun?{' '}
                    <TextLink href={register()} tabIndex={5}>
                        Daftar
                    </TextLink>
                </div>
            )}

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
            
        </AuthLayout>
        
    );
}
