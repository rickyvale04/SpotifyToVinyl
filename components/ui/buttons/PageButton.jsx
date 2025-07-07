import React from 'react'

const PageButton = ({ currentPage, totalPages, setCurrentPage }) => {

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
  
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="flex items-center justify-center space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm border transition-colors duration-200 ${
                currentPage === 1 
                  ? 'border-gray-700 text-gray-600 cursor-not-allowed' 
                  : 'border-gray-600 text-gray-400 hover:text-white hover:border-gray-400'
              }`}
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-400">
              {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm border transition-colors duration-200 ${
                currentPage === totalPages 
                  ? 'border-gray-700 text-gray-600 cursor-not-allowed' 
                  : 'border-gray-600 text-gray-400 hover:text-white hover:border-gray-400'
              }`}
            >
              Next
            </button>
        </div>
    )
}

export default PageButton;