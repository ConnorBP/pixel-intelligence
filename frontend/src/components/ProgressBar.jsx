import React, { useEffect, useState } from 'react'
import "../css/ProgressBar.css"
import { RGBAToHex } from '../utils';

const ProgressBar = ({ percent, clamp = true }) => {
    let p = percent;
    if (clamp) {
        p = Math.max(0, Math.min(1, p));
    }
    const percentString = Number(p).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 });

    const [textColor, setTextColor] = useState(`linear-gradient(to right, var(--popup-bg), var(--text-color))`);

    useEffect(() => {
        setTextColor(RGBAToHex(p*255, 200 + p * 55, 180 + p * 60, 255));
    }, [percent]);

    return (
        <div className="progress-bar-container">

            <div className="progress-bar-background">
                <div className="progress-bar-fill" style={{ width: `${p * 100}%` }}>

                </div>
            </div>
            {/* background: linear-gradient(to right, var(--popup-bg), var(--text-color)); */}

            <span className="progress-bar-text" style={{
                backgroundColor: `${textColor}`
            }}>
                {percentString}
            </span>
        </div>
    )
}

export default ProgressBar