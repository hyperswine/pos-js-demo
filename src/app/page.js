'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Search, Plus, Edit, Trash2, ShoppingCart, Receipt, Package, Users, LogOut, Eye, EyeOff } from 'lucide-react'
import { inventoryService, transactionService } from '../lib/firestore'
import { getAccessKey } from '../lib/config'

const PosSystem = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginKey, setLoginKey] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Main app state
  const [currentView, setCurrentView] = useState('dashboard')
  const [globalSearch, setGlobalSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load data from Firestore when app starts
  useEffect(() => {
    if (isAuthenticated && isClient) {
      loadInitialData()
    }
  }, [isAuthenticated, isClient])

  // Set up real-time listeners
  useEffect(() => {
    if (!isAuthenticated || !isClient) return

    let unsubscribeInventory, unsubscribeTransactions

    const setupListeners = async () => {
      try {
        // Set up real-time listeners
        unsubscribeInventory = inventoryService.subscribe((updatedInventory) => {
          setInventory(updatedInventory)
        })

        unsubscribeTransactions = transactionService.subscribe((updatedTransactions) => {
          setTransactions(updatedTransactions)
        })
      } catch (err) {
        console.error('Error setting up real-time listeners:', err)
      }
    }

    setupListeners()

    // Cleanup function
    return () => {
      if (unsubscribeInventory) unsubscribeInventory()
      if (unsubscribeTransactions) unsubscribeTransactions()
    }
  }, [isAuthenticated, isClient])

  // Load initial data from Firestore
  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [inventoryData, transactionData] = await Promise.all([
        inventoryService.getAll(),
        transactionService.getAll()
      ])
      setInventory(inventoryData)
      setTransactions(transactionData)
      setError('')
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data. Using offline mode.')
      // Keep default data if Firestore fails
    } finally {
      setLoading(false)
    }
  }

  // Inventory state
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Coffee', price: 3.50, stock: 100, category: 'Beverages', sku: 'BEV001' },
    { id: 2, name: 'Sandwich', price: 8.99, stock: 50, category: 'Food', sku: 'FOOD001' },
    { id: 3, name: 'Muffin', price: 4.25, stock: 30, category: 'Food', sku: 'FOOD002' }
  ])

  // Transaction state
  const [cart, setCart] = useState([])
  const [transactions, setTransactions] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  // Form states
  const [itemForm, setItemForm] = useState({
    name: '', price: '', stock: '', category: '', sku: ''
  })

  // Authentication
  const handleLogin = (e) => {
    e.preventDefault()
    const validKey = getAccessKey()
    if (loginKey === validKey) {
      setIsAuthenticated(true)
      setLoginKey('')
    } else {
      alert('Invalid access key')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentView('dashboard')
    setGlobalSearch('')
    setCart([])
  }

  // Global search functionality
  const searchableItems = useMemo(() => {
    const items = []

    // Add navigation items
    items.push(
      { type: 'nav', id: 'dashboard', title: 'Dashboard', action: () => setCurrentView('dashboard') },
      { type: 'nav', id: 'inventory', title: 'Inventory Management', action: () => setCurrentView('inventory') },
      { type: 'nav', id: 'pos', title: 'Point of Sale', action: () => setCurrentView('pos') },
      { type: 'nav', id: 'transactions', title: 'Transaction History', action: () => setCurrentView('transactions') },
      { type: 'nav', id: 'add-item', title: 'Add New Item', action: () => { setCurrentView('inventory'); setEditingItem({}) } }
    )

    // Add inventory items
    inventory.forEach(item => {
      items.push({
        type: 'item',
        id: `item-${item.id}`,
        title: `${item.name} - $${item.price}`,
        subtitle: `Stock: ${item.stock} | ${item.category}`,
        action: () => {
          setCurrentView('inventory')
          setSelectedItem(item)
        }
      })
    })

    return items
  }, [inventory])

  const filteredSearchResults = useMemo(() => {
    if (!globalSearch.trim()) return []
    return searchableItems.filter(item =>
      item.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(globalSearch.toLowerCase()))
    ).slice(0, 8)
  }, [globalSearch, searchableItems])

  // Inventory management
  const handleAddItem = async () => {
    if (!itemForm.name || !itemForm.price) return

    const newItem = {
      name: itemForm.name,
      price: parseFloat(itemForm.price),
      stock: parseInt(itemForm.stock) || 0,
      category: itemForm.category || 'General',
      sku: itemForm.sku || `SKU${Date.now()}`
    }

    setLoading(true)
    try {
      const id = await inventoryService.add(newItem)
      setInventory([...inventory, { id, ...newItem }])
      setItemForm({ name: '', price: '', stock: '', category: '', sku: '' })
      setEditingItem(null)
      setError('')
    } catch (err) {
      console.error('Error adding item:', err)
      setError('Failed to add item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditItem = async () => {
    if (!itemForm.name || !itemForm.price) return

    const updates = {
      name: itemForm.name,
      price: parseFloat(itemForm.price),
      stock: parseInt(itemForm.stock) || 0,
      category: itemForm.category || 'General',
      sku: itemForm.sku || editingItem.sku
    }

    setLoading(true)
    try {
      await inventoryService.update(editingItem.id, updates)
      setInventory(inventory.map(item =>
        item.id === editingItem.id ? { ...item, ...updates } : item
      ))
      setItemForm({ name: '', price: '', stock: '', category: '', sku: '' })
      setEditingItem(null)
      setError('')
    } catch (err) {
      console.error('Error updating item:', err)
      setError('Failed to update item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    setLoading(true)
    try {
      await inventoryService.delete(id)
      setInventory(inventory.filter(item => item.id !== id))
      setError('')
    } catch (err) {
      console.error('Error deleting item:', err)
      setError('Failed to delete item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // POS functionality
  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ))
  }

  const processTransaction = async () => {
    if (cart.length === 0) return

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const transaction = {
      items: [...cart],
      total,
      timestamp: new Date().toISOString(),
      timestampFormatted: new Date().toLocaleString()
    }

    setLoading(true)
    try {
      // Save transaction to Firestore
      const transactionId = await transactionService.add(transaction)

      // Update inventory in Firestore and local state
      const inventoryUpdates = []
      for (const cartItem of cart) {
        const inventoryItem = inventory.find(item => item.id === cartItem.id)
        if (inventoryItem) {
          const newStock = Math.max(0, inventoryItem.stock - cartItem.quantity)
          await inventoryService.update(cartItem.id, { stock: newStock })
          inventoryUpdates.push({ ...inventoryItem, stock: newStock })
        }
      }

      // Update local inventory state
      setInventory(inventory.map(item => {
        const updated = inventoryUpdates.find(updated => updated.id === item.id)
        return updated || item
      }))

      // Update local transactions state
      setTransactions([{ id: transactionId, ...transaction }, ...transactions])
      setCart([])
      setError('')
      alert(`Transaction completed! Total: $${total.toFixed(2)}`)
    } catch (err) {
      console.error('Error processing transaction:', err)
      setError('Failed to process transaction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold text-center mb-6">Loading...</h1>
        </div>
      </div>
    )
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Quantii System Login</h1>
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Access Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginKey}
                  onChange={(e) => setLoginKey(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                  className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter access key"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Demo key: admin123</p>
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Quantii System</h1>
              {loading && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Syncing...</span>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-1 rounded text-sm">
                {error}
                <button
                  onClick={() => setError('')}
                  className="ml-2 text-red-900 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}

            {/* Global Search */}
            <div className="flex-1 max-w-lg mx-4 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search items, features..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-600"
                />
              </div>

              {/* Search Results */}
              {filteredSearchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-t-0 rounded-b-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {filteredSearchResults.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        result.action()
                        setGlobalSearch('')
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-sm text-gray-600">{result.subtitle}</div>
                      )}
                      <div className="text-xs text-blue-600 mt-1">
                        {result.type === 'nav' ? 'Feature' : 'Item'}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-800 hover:text-gray-900"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation */}
        <nav className="mb-6">
          <div className="flex space-x-4">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Users },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
              { id: 'transactions', label: 'Transactions', icon: Receipt }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${currentView === id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                  }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Dashboard */}
        {currentView === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Total Items</h3>
              <p className="text-3xl font-bold text-blue-600">{inventory.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Total Stock</h3>
              <p className="text-3xl font-bold text-green-600">
                {inventory.reduce((sum, item) => sum + item.stock, 0)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Transactions Today</h3>
              <p className="text-3xl font-bold text-purple-600">{transactions.length}</p>
            </div>
          </div>
        )}

        {/* Inventory Management */}
        {currentView === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
              <button
                onClick={() => setEditingItem({})}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Item</span>
              </button>
            </div>

            {/* Add/Edit Form */}
            {editingItem && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">
                  {editingItem.id ? 'Edit Item' : 'Add New Item'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Stock Quantity"
                    value={itemForm.stock}
                    onChange={(e) => setItemForm({ ...itemForm, stock: e.target.value })}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="SKU"
                    value={itemForm.sku}
                    onChange={(e) => setItemForm({ ...itemForm, sku: e.target.value })}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={editingItem.id ? handleEditItem : handleAddItem}
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : (editingItem.id ? 'Update' : 'Add')} Item
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(null)
                      setItemForm({ name: '', price: '', stock: '', category: '', sku: '' })
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Inventory List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">${item.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${item.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                            {item.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.sku}</td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => {
                              setEditingItem(item)
                              setItemForm({
                                name: item.name,
                                price: item.price.toString(),
                                stock: item.stock.toString(),
                                category: item.category,
                                sku: item.sku
                              })
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Point of Sale */}
        {currentView === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Selection */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {inventory.filter(item => item.stock > 0).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => addToCart(item)}
                  >
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-700">{item.category}</p>
                    <p className="text-lg font-bold text-green-600">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Stock: {item.stock}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Cart</h3>
              {cart.length === 0 ? (
                <p className="text-gray-500">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-700">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold">Total:</span>
                      <span className="text-xl font-bold">
                        ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={processTransaction}
                      disabled={loading}
                      className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : 'Complete Transaction'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Transactions */}
        {currentView === 'transactions' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Transaction History</h2>
            {transactions.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-500">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Transaction #{transaction.id}</h3>
                        <p className="text-gray-700">{transaction.timestampFormatted || transaction.timestamp}</p>
                      </div>
                      <p className="text-xl font-bold text-green-600">
                        ${transaction.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {transaction.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-800">{item.name} x{item.quantity}</span>
                          <span className="text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PosSystem