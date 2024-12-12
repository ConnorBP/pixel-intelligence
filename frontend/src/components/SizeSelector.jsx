import React from 'react'

const SizeSelector = ({ label = "Canvas Size:", sizes = [8, 16, 32, 64], currentSize, updateSize }) => {
    return (
        <div className="popup-canvas-size">
            <label className="popup-label">{label}</label>
            <select
                value={currentSize}
                onChange={(e) => {
                    if(updateSize) updateSize(e.target.value)
                }}
                className="select"
            >
                {sizes.map((size, i) => {
                    return <option key={`${i}_${size}x`} value={size}>{size}x{size}</option>;
                })}
                {/* <option value={8}>08x08</option>
                <option value={16}>16x16</option>
                <option value={32}>32x32</option>
                <option value={64}>64x64</option> */}
            </select>
        </div>
    )
}

export default SizeSelector