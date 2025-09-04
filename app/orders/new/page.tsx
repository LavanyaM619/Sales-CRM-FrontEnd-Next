'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AuthGuard } from '@/components/AuthGuard';
import AdminLayout from '@/components/Layout/AdminLayout';
import { Category } from '@/types';
import { orderAPI, categoryAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, ShoppingCart, User, Package, Calendar, MapPin, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface OrderForm {
  customer: string;
  category: string;
  date: string;
  source: string;
  geo: string;
  amount: number;
}

export default function NewOrderPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<OrderForm>();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: OrderForm) => {
    setIsSubmitting(true);
    try {
      await orderAPI.create({
        ...data,
        amount: parseFloat(data.amount.toString())
      });
      toast.success('Order created successfully');
      router.push('/orders');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="animate-pulse">
            <div className="mb-6">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="max-w-2xl">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="bg-white shadow rounded-lg p-6">
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AdminLayout>
        <div>
          <div className="mb-6">
            <Link
              href="/orders"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Orders
            </Link>
          </div>

          <div className="max-w-2xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
              <p className="mt-1 text-sm text-gray-500">
                Add a new order to the system
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
                        Customer Name *
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          {...register('customer', {
                            required: 'Customer name is required',
                            minLength: {
                              value: 2,
                              message: 'Name must be at least 2 characters'
                            }
                          })}
                          type="text"
                          className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="Enter customer name"
                        />
                      </div>
                      {errors.customer && (
                        <p className="mt-1 text-sm text-red-600">{errors.customer.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category *
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          {...register('category', {
                            required: 'Category is required'
                          })}
                          className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                          Order Date *
                        </label>
                        <div className="mt-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            {...register('date', {
                              required: 'Order date is required'
                            })}
                            type="date"
                            className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        {errors.date && (
                          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                        )}
                      </div>
<div>
  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
    Amount *
  </label>
  <div className="mt-1 relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <DollarSign className="h-5 w-5 text-gray-400" />
    </div>
    <input
      {...register('amount', {
        required: 'Amount is required',
        validate: (value) => {
           const num = parseFloat(value.toString());
          if (isNaN(num)) return 'Amount must be a number';
          if (num <1) return 'Amount must be more than 1 ';
          return true;
        },
        setValueAs: (v) => parseFloat(v).toFixed(2),
      })}
      type="text"
      inputMode="decimal"
      className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      placeholder="0.00"
      onKeyDown={(e) => {
        // Allow only numbers, one dot, backspace, and arrow keys
        if (
          !/[0-9]/.test(e.key) &&
          e.key !== '.' &&
          e.key !== 'Backspace' &&
          e.key !== 'ArrowLeft' &&
          e.key !== 'ArrowRight' &&
          e.key !== 'Tab'
        ) {
          e.preventDefault();
        }
        // Prevent more than one decimal point
        if (e.key === '.' && e.currentTarget.value.includes('.')) {
          e.preventDefault();
        }
      }}
    />
  </div>
  {errors.amount && (
    <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
  )}
</div>



                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                          Source *
                        </label>
                        <div className="mt-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <ShoppingCart className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            {...register('source', {
                              required: 'Source is required',
                              minLength: {
                                value: 2,
                                message: 'Source must be at least 2 characters'
                              }
                            })}
                            type="text"
                            className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="e.g., Website, Mobile App"
                          />
                        </div>
                        {errors.source && (
                          <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="geo" className="block text-sm font-medium text-gray-700">
                          Geographic Location *
                        </label>
                        <div className="mt-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            {...register('geo', {
                              required: 'Geographic location is required',
                              minLength: {
                                value: 2,
                                message: 'Location must be at least 2 characters'
                              }
                            })}
                            type="text"
                            className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="e.g., New York, US"
                          />
                        </div>
                        {errors.geo && (
                          <p className="mt-1 text-sm text-red-600">{errors.geo.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Link
                  href="/orders"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}