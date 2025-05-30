"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category?: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
}

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
  "#8B5CF6",
];

export default function AdminPanelPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: 0,
    image: "",
    stock: 0,
    category: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<string>("All Products");
  const [treeOpen, setTreeOpen] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  async function fetchProducts() {
    try {
      const resp = await axios.get("/api/product");
      let data = resp.data;
      if (!Array.isArray(data) && Array.isArray(data.products))
        data = data.products;
      if (!Array.isArray(data)) data = [];
      setProducts(data);
    } catch {
      setProducts([]);
    }
  }

  // Group by category
  const catMap: Record<string, Product[]> = {};
  products.forEach((p) => {
    const cat = p.category?.trim() || "Uncategorized";
    (catMap[cat] = catMap[cat] || []).push(p);
  });
  const categories = Object.keys(catMap);

  // Chart data
  const barData = categories.map((cat) => ({
    category: cat,
    count: catMap[cat].length,
  }));
  const pieData = categories.map((cat) => ({
    name: cat,
    value: catMap[cat].reduce((sum, p) => sum + p.stock, 0),
  }));

  // Filtered
  const displayed =
    filterCat === "All Products" ? products : catMap[filterCat] || [];

  // Summary stats
  const totalCount = displayed.length;
  const avgPrice = totalCount
    ? (displayed.reduce((s, p) => s + p.price, 0) / totalCount).toFixed(2)
    : "0.00";

  // Form handlers
  const handleChange = <K extends keyof ProductForm>(
    key: K,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const val =
      key === "price" || key === "stock"
        ? Number(e.target.value)
        : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };
  const openAdd = () => {
    setIsEdit(false);
    setSelectedId(null);
    setForm({
      name: "",
      description: "",
      price: 0,
      image: "",
      stock: 0,
      category: "",
    });
    setModalOpen(true);
  };
  const openEdit = (p: Product) => {
    setIsEdit(true);
    setSelectedId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      stock: p.stock,
      category: p.category || "",
    });
    setModalOpen(true);
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && selectedId)
        await axios.put("/api/product", { id: selectedId, ...form });
      else await axios.post("/api/product", form);
      setModalOpen(false);
      fetchProducts();
    } catch {}
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete("/api/product", { data: { id } });
      fetchProducts();
    } catch {}
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex-shrink-0">
        <div className="p-6 text-xl font-bold text-gray-800 dark:text-gray-100">
          MyStore Admin
        </div>
        <nav className="px-4">
          <button
            onClick={() => setTreeOpen((o) => !o)}
            className="flex items-center w-full text-left text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 py-2"
          >
            <span
              className={`transform transition ${treeOpen ? "rotate-90" : ""}`}
            >
              ▶
            </span>
            <span className="ml-2">Products</span>
          </button>
          {treeOpen && (
            <ul className="pl-6 mt-2 space-y-1">
              <li>
                <button
                  onClick={() => setFilterCat("All Products")}
                  className={`flex justify-between w-full text-left py-1 ${
                    filterCat === "All Products"
                      ? "font-semibold text-gray-900 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-300 hover:underline"
                  }`}
                >
                  📄 All Products ({products.length})
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setFilterCat(cat)}
                    className={`flex justify-between w-full text-left py-1 ${
                      filterCat === cat
                        ? "font-semibold text-gray-900 dark:text-gray-100"
                        : "text-gray-700 dark:text-gray-300 hover:underline"
                    }`}
                  >
                    📄 {cat} ({catMap[cat].length})
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={openAdd}
            className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            ＋ Add Product
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {filterCat}
          </h1>
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
          >
            {darkMode ? "☀️" : "🌑"}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 space-y-8">
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                Products by Category
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <XAxis dataKey="category" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                Stock Distribution
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    innerRadius={40}
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Items
              </h3>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalCount}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Average Price
              </h3>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                RS. {avgPrice}
              </p>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((p) => (
              <div
                key={p._id}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-40 w-full object-cover rounded"
                />
                <h3 className="mt-3 text-lg font-medium text-gray-800 dark:text-gray-200">
                  {p.name}
                </h3>
                <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                  {p.description}
                </p>
                <div className="mt-3 flex justify-between text-gray-800 dark:text-gray-100">
                  <span className="font-bold">${p.price.toFixed(2)}</span>
                  <span className="text-sm">Stock: {p.stock}</span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex-1 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="flex-1 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg p-6 rounded shadow-lg relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            >
              ✖️
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {isEdit ? "Edit Product" : "New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {(
                [
                  { key: "name", label: "Name", type: "text" },
                  { key: "description", label: "Description", type: "text" },
                  { key: "price", label: "Price", type: "number" },
                  { key: "image", label: "Image URL", type: "text" },
                  { key: "stock", label: "Stock", type: "number" },
                  { key: "category", label: "Category", type: "text" },
                ] as const
              ).map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={(e) =>
                      handleChange(key, e as ChangeEvent<HTMLInputElement>)
                    }
                    className="w-full p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                    {...(type === "number" ? { min: 0 } : {})}
                    required={key !== "category"}
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                {isEdit ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
