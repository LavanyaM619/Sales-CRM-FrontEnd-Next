'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Category } from '@/types';
import { orderAPI, categoryAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Header from '@/components/Layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import {
  ShoppingCart,
  User,
  Package,
  Calendar,
  MapPin,
  LogOut,
} from 'lucide-react';
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
  const { logout } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderForm>();

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

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const onSubmit = async (data: OrderForm) => {
    setIsSubmitting(true);
    try {
      await orderAPI.create({
        ...data,
        amount: parseFloat(data.amount.toString()),
      });

      toast.success('Order created successfully!');
      reset(); 

      setTimeout(() => {
        router.push('/user/dashboard');
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse w-full max-w-md space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <Header />
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
          <p className="mt-1 text-sm text-gray-500">
            Fill out the form to add a new order
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white shadow rounded-lg p-6"
        >
          {/* Customer */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer Name *
            </label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                {...register('customer', {
                  required: 'Customer name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                type="text"
                className="pl-10 w-full rounded-md border border-gray-300 py-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter customer name"
              />
            </div>
            {errors.customer && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customer.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <div className="mt-1 relative">
              <Package className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <select
                {...register('category', { required: 'Category is required' })}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 focus:ring-primary-500 focus:border-primary-500"
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
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Date & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Order Date *
              </label>
              <div className="mt-1 relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  {...register('date', { required: 'Order date is required' })}
                  type="date"
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount *
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('amount', {
                    required: 'Amount is required',
                    validate: (value) => {
                      const num = parseFloat(value.toString());
                      if (isNaN(num)) return 'Amount must be a number';
                      if (num < 1) return 'Amount must be more than 1';
                      return true;
                    },
                  })}
                  type="number"
                  step="0.01"
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.amount.message}
                </p>
              )}
            </div>
          </div>

          {/* Source & Geo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Source *
              </label>
              <div className="mt-1 relative">
                <ShoppingCart className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  {...register('source', {
                    required: 'Source is required',
                    minLength: {
                      value: 2,
                      message: 'Source must be at least 2 characters',
                    },
                  })}
                  type="text"
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Website, Mobile App"
                />
              </div>
              {errors.source && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.source.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Geographic Location *
              </label>
              <div className="mt-1 relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  {...register('geo', {
                    required: 'Geographic location is required',
                    minLength: {
                      value: 2,
                      message: 'Location must be at least 2 characters',
                    },
                  })}
                  type="text"
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., New York, US"
                />
              </div>
              {errors.geo && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.geo.message}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/login"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
