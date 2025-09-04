'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AuthGuard } from '@/components/AuthGuard';
import AdminLayout from '@/components/Layout/AdminLayout';
import { Category } from '@/types';
import { categoryAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';

interface CategoryForm {
  name: string;
  description: string;
}

export default function EditCategoryPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  
  const { register, handleSubmit, formState: { errors } } = useForm<CategoryForm>();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await categoryAPI.getById(categoryId);
        setCategory(data);
      } catch (error) {
        toast.error('Failed to fetch category');
        router.push('/categories');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, router]);

  const onSubmit = async (data: CategoryForm) => {
    setIsSubmitting(true);
    try {
      await categoryAPI.update(categoryId, data);
      toast.success('Category updated successfully');
      router.push('/categories');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update category');
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
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    );
  }

  if (!category) {
    return (
      <AuthGuard>
        <AdminLayout>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Category not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The category you're looking for doesn't exist.
            </p>
            <div className="mt-6">
              <Link
                href="/categories"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
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
        <div>
          <div className="mb-6">
            <Link
              href="/categories"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Categories
            </Link>
          </div>

          <div className="max-w-2xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
              <p className="mt-1 text-sm text-gray-500">
                Update category information
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Category Name *
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          {...register('name', {
                            required: 'Category name is required',
                            minLength: {
                              value: 2,
                              message: 'Name must be at least 2 characters'
                            },
                            value: category.name
                          })}
                          type="text"
                          className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="Enter category name"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          {...register('description', {
                            value: category.description || ''
                          })}
                          rows={4}
                          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="Enter category description (optional)"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Category Information</h4>
                      <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm text-gray-500">Category ID</dt>
                          <dd className="text-sm text-gray-900">{category.categoryId}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Slug</dt>
                          <dd className="text-sm text-gray-900">{category.slug}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Created</dt>
                          <dd className="text-sm text-gray-900">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Last Updated</dt>
                          <dd className="text-sm text-gray-900">
                            {new Date(category.updatedAt).toLocaleDateString()}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Link
                  href="/categories"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Updating...' : 'Update Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}
