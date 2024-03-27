'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Copy } from 'lucide-react';
import { decrypt } from '@/lib/crypto';
import Link from 'next/link';

function DecryptContent() {
    const searchParams = useSearchParams();
    const [passphrase, setPassphrase] = useState('');
    const [showPassphrase, setShowPassphrase] = useState(false);
    const [decryptedMessage, setDecryptedMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const encryptedMessage = searchParams.get('message');
        const seed = searchParams.get('seed');

        if (!encryptedMessage || !seed) {
            setError('Invalid or incomplete URL. Please check the link and try again.');
        }
    }, [searchParams]);

    const handleDecrypt = () => {
        if (!passphrase) {
            setError('Please enter the passphrase.');
            return;
        }

        const encryptedMessage = searchParams.get('message');
        const seed = searchParams.get('seed');
        if (encryptedMessage && seed) {
            const decryptedMessage = decrypt(encryptedMessage, passphrase, seed);
            setDecryptedMessage(decryptedMessage);
            setError('');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(decryptedMessage).then(() => {
            alert('Decrypted message copied to clipboard!');
        });
    };

    return (
        <>
            <p className="mb-2 text-xl text-white">🔐 Enter the passphrase to decrypt the message</p>
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400"/>
                </div>
                <Input
                    type={showPassphrase ? 'text' : 'password'}
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Enter the passphrase"
                    className="pl-10 bg-gray-700 text-white"
                    maxLength={100}
                    aria-label="Passphrase input"
                />
                <Button
                    variant="ghost"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassphrase(!showPassphrase)}
                    aria-label="Toggle passphrase visibility"
                >
                    {showPassphrase ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                </Button>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Button onClick={handleDecrypt} className="bg-gray-600 hover:bg-gray-700">
                🔓 Decrypt Message
            </Button>
            {decryptedMessage && (
                <div className="mt-4">
                    <p className="text-xl text-white">📜 Decrypted Message:</p>
                    <Textarea value={decryptedMessage} readOnly className="mt-2 bg-gray-700 text-white text-xl"
                              aria-label="Decrypted message"/>
                    <Button variant="ghost" className="mt-2 text-white" onClick={handleCopy} aria-label="Copy decrypted message">
                        <Copy className="h-4 w-4 mr-2"/>
                        Copy to Clipboard
                    </Button>
                </div>
            )}
            <div className="mt-8">
                <Link href="/">
                    <Button className="bg-gray-600 hover:bg-gray-700">
                        🔒 Encrypt a New Message
                    </Button>
                </Link>
            </div>
        </>
    );
}

export default function Decrypt() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            <Card className="w-2/3 bg-gray-800 shadow-lg">
                <CardHeader>
                <CardTitle className="text-white text-xl">🔓 Decrypt Your Secret Message 🔓</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div>Loading...</div>}>
                        <DecryptContent />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}