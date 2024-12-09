import React from 'react';
import PropTypes from 'prop-types';
import '../../css/GalleryPageCSS/GalleryPagination.css';

const GalleryPagination = ({ currentPage = 1, totalPages = 999, numberOfButtons = 5, onPageSelected }) => {

    const handlePageClick = (page) => {
        if (onPageSelected && page >= 1 && page <= totalPages) {
            onPageSelected(page);
        }
    };

    // calculate where to display the base page number from in the list
    const basePage = Math.max(1, Math.min(currentPage - Math.floor(numberOfButtons / 2), totalPages - numberOfButtons + 1));

    return (
        <div className="pagination">
            <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Back
            </button>
            {[...Array(totalPages).keys()].slice(basePage - 1, basePage + 4).map((v) => (

                <button
                    key={v + 1}
                    onClick={() => handlePageClick(v + 1)}
                    className={currentPage === v + 1 ? 'active' : ''}
                >
                    {v + 1}
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
    totalPages: PropTypes.number,
    onPageSelected: PropTypes.func.isRequired,
};

export default GalleryPagination;