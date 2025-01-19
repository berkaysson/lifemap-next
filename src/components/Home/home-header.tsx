import Link from "next/link";
import { Button } from "../ui/Buttons/button";

export function HomeHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl text-primary">
              LifeMap
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/about" className="text-gray-500 hover:text-gray-900">
              About Us
            </Link>
            <Link href="/help" className="text-gray-500 hover:text-gray-900">
              Help
            </Link>
            <Link href="/contact" className="text-gray-500 hover:text-gray-900">
              Contact
            </Link>
          </nav>
          <div>
            <Button asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
