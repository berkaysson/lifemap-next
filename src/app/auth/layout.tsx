import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex flex-col">
      <header className="p-4 flex justify-between items-center bg-back">
        <Link href="/" className="flex items-center space-x-2 text-primary">
          <Image src="/logo.png" alt="Logo" width={48} height={48} />
          <span className="text-lg font-bold text-primary group-data-[collapsible=icon]:hidden">
            habivita
          </span>
        </Link>
        <div className="flex space-x-4">
          <Link
            href="login"
            className="flex items-center space-x-2 text-primary font-semibold"
          >
            <span>Login</span>
          </Link>
          <Link
            href="register"
            className="flex items-center space-x-2 text-primary font-semibold"
          >
            <span>Register</span>
          </Link>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
