import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('cat') || 'All');
  const [priceMax, setPriceMax] = useState(1000);
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const allCats = ['All', ...categories.map(c => c.name)];

  const filtered = useMemo(() => {
    let res = [...products];
    if (search) res = res.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
    if (selectedCat !== 'All') res = res.filter(p => p.category === selectedCat);
    res = res.filter(p => p.price <= priceMax);
    if (sortBy === 'price-asc') res.sort((a,b) => a.price - b.price);
    if (sortBy === 'price-desc') res.sort((a,b) => b.price - a.price);
    if (sortBy === 'discount') res.sort((a,b) => (b.bulkDiscount||0) - (a.bulkDiscount||0));
    if (sortBy === 'name') res.sort((a,b) => a.name.localeCompare(b.name));
    return res;
  }, [search, selectedCat, priceMax, sortBy]);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search products, categories..."
                className="input-field pl-11 w-full"
              />
              {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><FiX /></button>}
            </div>
            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="input-field w-auto min-w-[160px] cursor-pointer">
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Best Discount</option>
              <option value="name">Name A-Z</option>
            </select>
            {/* Filter toggle mobile */}
            <button onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden btn-outline flex items-center gap-2">
              <FiFilter />Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-col gap-6 w-56 flex-shrink-0`}>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-36">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FiFilter />Filters</h3>

            {/* Category */}
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Category</p>
              <div className="space-y-1.5">
                {allCats.map(c => (
                  <button key={c} onClick={() => setSelectedCat(c)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCat===c ? 'bg-blue-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Max Price</p>
              <p className="text-lg font-bold text-green-700 mb-2">₹{priceMax}</p>
              <input type="range" min="10" max="1000" step="10" value={priceMax} onChange={e => setPriceMax(+e.target.value)}
                className="w-full accent-green-700" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹10</span><span>₹1000</span></div>
            </div>

            <button onClick={() => { setSelectedCat('All'); setPriceMax(1000); setSearch(''); setSortBy('default'); }}
              className="w-full mt-5 btn-outline text-sm py-2">Reset Filters</button>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold text-gray-900">{filtered.length}</span> products
              {selectedCat !== 'All' && <> in <span className="text-green-700 font-bold">{selectedCat}</span></>}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-700 font-bold text-lg">No products found</p>
              <p className="text-gray-500 text-sm mt-2">Try different search terms or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
