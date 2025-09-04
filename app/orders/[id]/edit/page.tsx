'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { orderAPI, categoryAPI } from '@/lib/api';
import { Order, Category } from '@/types';
import { AuthGuard } from '@/components/AuthGuard';
import AdminLayout from '@/components/Layout/AdminLayout';
import { ArrowLeft } from 'lucide-react';

interface OrderForm {
  customer: string;
  category: string;
  date: string;
  source: string;
  geo?: string;
  amount: number;
}

export default function EditOrderPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderForm>({
    defaultValues: {
      customer: '',
      category: '',
      date: '',
      source: '',
      geo: '',
      amount: 0,
    },
  });

  // Fetch categories + order
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderData, categoriesData] = await Promise.all([
          orderAPI.getById(orderId),
          categoryAPI.getAll(),
        ]);
        setOrder(orderData);
        setCategories(categoriesData);
        reset({
          customer: orderData.customer,
          category:
            typeof orderData.category === 'string'
              ? orderData.category
              : orderData.category?._id || '',
          date: orderData.date ? format(new Date(orderData.date), 'yyyy-MM-dd') : '',
          source: orderData.source,
          geo: orderData.geo || '',
          amount: orderData.amount,
        });
      } catch (error) {
        toast.error('Failed to load order');
        router.push('/orders');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchData();
  }, [orderId, reset, router]);

  const onSubmit = async (data: OrderForm) => {
    setIsSubmitting(true);
    try {
      await orderAPI.update(orderId, data);
      toast.success('Order updated successfully');
      router.push('/orders');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </AdminLayout>
      </AuthGuard>
    );
  }

  if (!order) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Order not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The order you’re looking for doesn’t exist.
            </p>
            <Link
              href="/orders"
              className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md shadow hover:bg-primary-700"
            >
              Back to Orders
            </Link>
          </div>
        </AdminLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Order</h1>
              <p className="mt-1 text-sm text-gray-500">Update order details</p>
            </div>
            <Link
              href="/orders"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 shadow rounded-lg">
            {/* Customer */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <input
                type="text"
                {...register('customer', { required: 'Customer is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              {errors.customer && <p className="text-red-500 text-sm mt-1">{errors.customer.message}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                {...register('date', { required: 'Date is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Source</label>
              <input
                type="text"
                {...register('source', { required: 'Source is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              {errors.source && <p className="text-red-500 text-sm mt-1">{errors.source.message}</p>}
            </div>

            {/* Geo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Geo</label>
              <input
                type="text"
                {...register('geo')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                step="0.01"
                {...register('amount', { required: 'Amount is required', valueAsNumber: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/orders"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}
