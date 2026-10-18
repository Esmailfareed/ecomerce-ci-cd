import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import FeaturedProducts from '../FeaturedProducts/FeaturedProducts'

export default function Products() {
  // /products?category=<id> comes from the Categories page
  let [searchParams] = useSearchParams();
  let category = searchParams.get('category');

  return <>
    <div className="d-flex justify-content-between align-items-center my-4">
      <h2 className="h4 m-0">{searchParams.get('name') || 'All Products'}</h2>
      {category && <Link className="text-main" to="/products">Show all</Link>}
    </div>
    <FeaturedProducts category={category} />
  </>
}
