'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Copy } from 'lucide-react';
import { encrypt } from '@/lib/crypto';

export default function Encrypt() {
    const [seed, setSeed] = useState('');
    const [message, setMessage] = useState('');
    const [passphrase, setPassphrase] = useState('');
    const [showPassphrase, setShowPassphrase] = useState(false);
    const [encryptedUrl, setEncryptedUrl] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setSeed((prevSeed) => {
                const newSeed = prevSeed + e.clientX + e.clientY;
                return newSeed.slice(-100);
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const handleEncrypt = () => {
        if (!message || !passphrase) {
            setError('Please enter a message and a passphrase.');
            return;
        }

        const encryptedMessage = encrypt(message, passphrase, seed);
        setEncryptedUrl(`/decrypt?message=${encodeURIComponent(encryptedMessage)}&seed=${encodeURIComponent(seed)}`);
        setError('');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(encryptedUrl).then(() => {
            alert('Encrypted URL copied to clipboard!');
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            <Card className="w-2/3 bg-gray-800 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-white text-xl">🔒 Encrypt Your Secret Message 🔒</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-white text-xl">🐭 Move your mouse to generate a random seed 🐭</p>
                    <div className="mb-4 p-2 bg-gray-700 rounded">
                        <p className="break-all text-white">🔑 Random Seed: {seed}</p>
                    </div>
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="✍️ Enter your secret message"
                        className="mb-4 bg-gray-700 text-white text-xl"
                        maxLength={1000}
                        aria-label="Secret message input"
                    />
                    <p className="mb-2 text-xl text-white">🔐 Passphrase (required to decrypt message)</p>
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            type={showPassphrase ? 'text' : 'password'}
                            value={passphrase}
                            onChange={(e) => setPassphrase(e.target.value)}
                            placeholder="Enter a passphrase"
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
                            {showPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <Button onClick={handleEncrypt} className="bg-gray-600 hover:bg-gray-700">
                        🔒 Encrypt Message
                    </Button>
                    {encryptedUrl && (
                        <div className="mt-4">
                            <p>🔗 Encrypted URL:</p>
                            <div className="flex items-center">
                                <a href={encryptedUrl} className="text-white hover:underline break-all">
                                    {encryptedUrl}
                                </a>
                                <Button
                                    variant="ghost"
                                    className="ml-2"
                                    onClick={handleCopy}
                                    aria-label="Copy encrypted URL"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}