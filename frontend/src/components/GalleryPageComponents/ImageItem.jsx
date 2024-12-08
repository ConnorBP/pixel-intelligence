import React from "react";
import { Link } from "react-router-dom";
import { usePreserveQueryParamsNavigate } from "../../hooks/usePreserveQueryParamsNavigate";

export const ImageItem = ({ image }) => {

    const navigate = usePreserveQueryParamsNavigate();

    return (
        <div className="images">
            <img
                className=""
                src={image.imgDataUrl}
                alt={`Gallery Image ${image.name}`}
                style={{ width: "100%" }}
                onClick={() => navigate(`/viewImage/${image._id}`)}
            />
        </div>
    );
};
