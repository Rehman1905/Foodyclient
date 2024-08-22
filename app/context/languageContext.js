import { createContext, useState, useEffect } from "react";
import lang from '../language.json';

export const languageContext = createContext();

export default function LanguageContext({ children }) {
    const [language, setLanguage] = useState(lang.en); 

    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const data = localStorage.getItem('lang');
                switch (data) {
                    case 'ru':
                        setLanguage(lang.ru);
                        break;
                    case 'aze':
                        setLanguage(lang.aze);
                        break;
                    default:
                        setLanguage(lang.en);
                        break;
                }
            }
        } catch (error) {
            console.error("Error accessing localStorage: ", error);
        }
    }, []);

    return (
        <languageContext.Provider value={[language, setLanguage]}>
            {children}
        </languageContext.Provider>
    );
}
