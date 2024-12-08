import React from 'react';
import PropTypes from 'prop-types';
import '../../css/GalleryPageCSS/GalleryPagination.css';

const GalleryPagination = ({ currentPage = 1, totalPages = 999, pageSelected }) => {
    const handlePageClick = (page) => {
        if (pageSelected && page >= 1 && page <= totalPages) {
            pageSelected(page);
        }
    };

    return (
        <div className="pagination">
            <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Back
            </button>
            {[...Array(totalPages).keys()].slice(0, 5).map((_, index) => (
                <button
                    key={index + 1}
                    onClick={() => handlePageClick(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}
                >
                    {index + 1}
                </button>
            ))}
            <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

GalleryPagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    pageSelected: PropTypes.func.isRequired,
};

export default GalleryPagination;