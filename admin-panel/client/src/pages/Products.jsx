import React from 'react';

const Products = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Products</h1>
        <button className="btn-primary">
          Add Product
        </button>
      </div>
      <div className="card">
        <div className="card-body">
          <p className="text-gray-600 dark:text-gray-400">Products management page - Coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default Products;
