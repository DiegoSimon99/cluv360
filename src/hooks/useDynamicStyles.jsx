import { useEffect } from "react";

export const useDynamicStyles = (stylePath, id) => {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = stylePath;
        link.id = id;
        document.head.appendChild(link);

        return () => {
            const existingLink = document.getElementById(id);
            if (existingLink) {
                existingLink.remove();
            }
        };
    }, [stylePath, id]);
};
