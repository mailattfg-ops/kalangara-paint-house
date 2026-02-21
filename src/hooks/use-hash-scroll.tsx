import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useHashScroll = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const scrollToElement = () => {
                const element = document.querySelector(location.hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    return true;
                }
                return false;
            };

            if (!scrollToElement()) {
                const interval = setInterval(() => {
                    if (scrollToElement()) {
                        clearInterval(interval);
                    }
                }, 100);

                // Stop retrying after 3 seconds
                setTimeout(() => clearInterval(interval), 3000);
                return () => clearInterval(interval);
            }
        }
    }, [location.hash]);
};
