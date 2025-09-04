'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Eye, ArrowLeft, Edit } from 'lucide-react';
import { orderAPI, categoryAPI } from '@/lib/api';
import { Order, Category } from '@/types';
import { AuthGuard } from '@/components/AuthGuard';
import AdminLayout from '@/components/Layout/AdminLayout';
import toast from 'react-hot-toast';

export default function OrderViewPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder();
      fetchCategories();
    }
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await orderAPI.getById(id);
      setOrder(data);
    } catch (error) {
      toast.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getCategoryName = (category: Category | string | null | undefined) => {
    if (category && typeof category === 'object') {
      return category.name ?? 'Unknown Category';
    }
    if (typeof category === 'string') {
      const found = categories.find(cat => cat._id === category);
      return found?.name ?? 'Unknown Category';
    }
    return 'Unknown Category';
  };

  if (loading) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-5 bg-gray-200 rounded"></div>
              ))}
            </div>
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
            <Eye className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Order not found</h3>
            <p className="mt-1 text-sm text-gray-500">It might have been deleted.</p>
            <div className="mt-6">
              <Link
                href="/orders"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.orderId}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View details for this order
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/orders"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
              <Link
                href={`/orders/${order._id}/edit`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Customer Info</h3>
              <p className="mt-1 text-gray-700">
                <span className="font-semibold">Customer:</span> {order.customer}
              </p>
              <p className="mt-1 text-gray-700">
                <span className="font-semibold">Source:</span> {order.source}
              </p>
              <p className="mt-1 text-gray-700">
                <span className="font-semibold">Geo:</span> {order.geo || 'N/A'}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
              <p className="mt-1 text-gray-700">
                <span className="font-semibold">Category:</span> {getCategoryName(order.category)}
              </p>
              <p className="mt-1 text-gray-700">
                <span className="font-semibold">Date:</span>{' '}
                {format(new Date(order.date), 'PPP')}
              </p>
              <p className="mt-1 text-gray-700">
                <span className="font-semibold">Amount:</span> Rs {order.amount}
              </p>
              
            
            </div>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}
