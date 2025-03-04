// AccordionContainer.js
import React, { useState } from 'react';

const ModalInput = ({ items }) => {

    return (
        items.map((item) => (
            <div className={`col-12 col-md-${item.numCol} mb-2`} key={item.id}>
                <label htmlFor="emailWithTitle" className="form-label">{item.label}</label>
                <input
                    type="text"
                    value={item.input}
                    readOnly
                    className="form-control" />
            </div>
        ))
    );
};

export default ModalInput;
