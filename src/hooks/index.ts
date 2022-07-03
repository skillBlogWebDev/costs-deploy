import { useEffect, useState } from "react";

export const useTheme = () => {
    const [theme, setTheme] = useState(JSON.parse(localStorage.getItem('theme') as string) || 'dark')
    const darkThemeUrl = 'https://cdn.jsdelivr.net/npm/@forevolve/bootstrap-dark@1.1.0/dist/css/bootstrap-dark.min.css';
    const lightThemeUrl = 'https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css';

    const switchTheme = () => {
        const inverseMode = theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', JSON.stringify(inverseMode))

        const link = document.getElementById('theme-link') as HTMLLinkElement
        link.href = theme === 'dark' ? darkThemeUrl : lightThemeUrl

        setTheme(inverseMode);
    }

    useEffect(() => {
        const link = document.getElementById('theme-link') as HTMLLinkElement
        link.href = theme === 'dark' ? darkThemeUrl : lightThemeUrl;
    }, [theme]);

    return { switchTheme, theme }
}