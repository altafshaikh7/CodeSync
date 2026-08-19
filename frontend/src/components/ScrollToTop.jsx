import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ 
    smooth = true, 
    offset = 80, 
    delay = 100,
    excludePaths = [] // Paths where scroll to top should be disabled
}) => {
    const { pathname, search, hash } = useLocation();
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Check if current path should be excluded
        if (excludePaths.some(path => pathname.startsWith(path))) {
            return;
        }

        // Skip first render if needed
        if (isFirstRender.current) {
            isFirstRender.current = false;
        }

        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            // Handle hash navigation
            if (hash) {
                const element = document.getElementById(hash.replace('#', ''));
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const elementPosition = window.pageYOffset + rect.top - offset;
                    
                    window.scrollTo({
                        top: elementPosition,
                        behavior: smooth ? 'smooth' : 'auto'
                    });
                    return;
                }
            }

            // If no hash, scroll to top
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }, delay);

        return () => clearTimeout(timer);
    }, [pathname, search, hash, smooth, offset, delay, excludePaths]);

    return null;
};

export default ScrollToTop;