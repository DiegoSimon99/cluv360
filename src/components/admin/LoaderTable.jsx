// AccordionContainer.js
import React from 'react';
import { SyncLoader } from 'react-spinners';

const LoaderTable = ({ loading, cantidad }) => {
    if (!loading) return null; // No renderizar nada si `loading` es false

    return (
        cantidad > 0 ? (
            <div className="loader-table">
                <div>
                    <SyncLoader color="var(--color-hover)" loading={loading} size={15} />
                </div>
            </div>
        ) : (
            <tr height="100">
                <div className="loader-table">
                    <div>
                        <SyncLoader color="var(--color-hover)" loading={loading} size={15} />
                    </div>
                </div>
            </tr>
        )
    );
};
export default LoaderTable;
