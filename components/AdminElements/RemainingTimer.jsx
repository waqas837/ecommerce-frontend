"use client"
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { timerManager } from '@/lib/globalTimerService';
 

const CountdownTimer = ({
    publishTime,
    postId,
    slug,
    onPublish
}) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isPublished, setIsPublished] = useState(false);

    useEffect(() => {
        // Check initial state
        const now = new Date().getTime();
        const publishDate = new Date(publishTime).getTime();
        if (now >= publishDate) {
            setIsPublished(true);
            return;
        }

        // Register with timer manager
        timerManager.addTimer(postId, publishTime, () => {
            setIsPublished(true);
            onPublish(slug);
        });

        // Local time display update
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const publishDate = new Date(publishTime).getTime();
            const difference = publishDate - now;

            if (difference <= 0) {
                setTimeLeft('');
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            let timeString = '';
            if (days > 0) timeString += `${days}d `;
            if (hours > 0 || days > 0) timeString += `${hours}h `;
            if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}m `;
            timeString += `${seconds}s`;

            setTimeLeft(timeString);
        };

        const displayTimer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        // return () => {
        //     clearInterval(displayTimer);
        //     timerManager.removeTimer(postId);
        // };
    }, [publishTime, postId]);

    if (isPublished) {
        return (
            <div className="inline-flex absolute left-0 top-0 items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                <span className="text-sm font-medium">Published</span>
            </div>
        );
    }

    return (
        <div className="absolute right-2 bottom-2 inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{timeLeft}</span>
        </div>
    );
};

export default CountdownTimer;