import { createContext, useState, useEffect } from "react";
import lang from '../language.json';

export const languageContext = createContext();

export default function LanguageContext({ children }) {
    const [language, setLanguage] = useState(lang.en); 

    useEffect(() => {
        if (typeof window !== "undefined") {
            let data = localStorage.getItem('lang');
            if (data === 'ru') {
                setLanguage(lang.ru);
            } else if (data === 'aze') {
                setLanguage(lang.aze);
            } else {
                setLanguage(lang.en);
            }
        }
    }, []);

    return (
        <languageContext.Provider value={[language, setLanguage]}>
            {children}
        </languageContext.Provider>
    );
}
