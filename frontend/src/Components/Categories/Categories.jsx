import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { API_URL } from '../../config'

export default function Categories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    axios.get(`${API_URL}/api/v1/categories`).then(({ data }) => setCategories(data.data))
  }, [])

  return <>
    <h2 className="h4 my-4">Categories</h2>
    <div className="row g-4">
      {categories.map((category) => (
        <div key={category._id} className="col-6 col-md-3">
          <Link to={`/products?category=${category._id}&name=${encodeURIComponent(category.name)}`}
            className="product d-block text-center p-3 h-100">
            <img src={category.image} alt={category.name} height={200} className="w-100" style={{ objectFit: "contain" }} />
            <h3 className="h5 mt-3 text-main">{category.name}</h3>
          </Link>
        </div>
      ))}
    </div>
  </>
}
