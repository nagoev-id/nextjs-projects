'use client';

import {Card} from '@/components/ui/card';
import {HeartHandshake} from 'lucide-react';
import Link from 'next/link';

/**
 * Компонент футера приложения
 */
export default function Footer() {
    const getCurrentYear = () => new Date().getFullYear();

    return (
        <footer>
            <Card className="grid place-items-center text-center p-4 xl:px-0 gap-2">
                <p>Copyright © {getCurrentYear()}. All rights reserved.</p>
                <p className="inline-flex gap-1">
                    Made with <HeartHandshake className="text-red-500" size={20} aria-hidden="true"/> by{' '}
                    <Link href="https://github.com/nagoev-alim" target="_blank"
                          className="text-blue-500 hover:underline">
                        Nagoev Alim
                    </Link>
                </p>
            </Card>
        </footer>
    );
}
