import React, { useState, useEffect } from "react";
import ClickAwayListener from "react-click-away-listener";

const SREdit = ({ value: initialValue, row: { index }, column: { id }, updateMyData }) => {
    const [value, setValue] = useState(initialValue);
    const [oldValue] = useState(initialValue);
    const [isEdit, setEdit] = useState(false);

    const openEdit = (e) => {
        setEdit(true);
    };

    const onChange = (e) => {
        setValue(e.target.value);
    };

    const saveEdit = () => {
        setEdit(false);
        updateMyData(index, id, value);
    };

    const clearEdit = () => {
        setValue(oldValue);
        setEdit(false);
    };

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <ClickAwayListener onClickAway={clearEdit}>
            <div className="sr-details content">
                <div className={`content-display ${isEdit ? "close" : "open"}`} onClick={openEdit}>
                    {value}
                </div>
                <div className={`content-edit ${isEdit ? "open" : "close"}`}>
                    <input type="text" value={value} onChange={onChange} />
                    <button className="ok" onClick={saveEdit} />
                    <button className="cancel" onClick={clearEdit} />
                </div>
            </div>
        </ClickAwayListener>
    );
};

export default SREdit;