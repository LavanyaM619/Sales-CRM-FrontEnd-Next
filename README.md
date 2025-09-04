# Admin Dashboard - Next.js Frontend

A responsive admin dashboard built with Next.js 14, TypeScript, and Tailwind CSS that connects to your Node.js Express backend.

## Features

- 🔐 **Authentication** - Login/Register with JWT tokens
- 📊 **Dashboard** - Overview with stats and recent orders
- 📦 **Category Management** - CRUD operations for product categories
- 🛒 **Order Management** - Advanced filtering, pagination, and CSV export
- 👥 **User Management** - Admin user management
- 📱 **Responsive Design** - Mobile-first responsive layout
- 🎨 **Modern UI** - Clean, professional interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- Your Express backend running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── dashboard/         # Dashboard page
│   ├── categories/        # Category management
│   ├── orders/           # Order management
│   ├── login/            # Authentication pages
│   └── register/
├── components/           # Reusable components
│   ├── Layout/          # Layout components
│   └── Dashboard/       # Dashboard components
├── contexts/            # React contexts
├── lib/                 # API utilities
├── types/               # TypeScript interfaces
└── styles/              # Global styles
```

## API Integration

The frontend connects to your Express backend with the following endpoints:

- **Auth**: `/api/v1/auth/*`
- **Categories**: `/api/v1/categories/*`
- **Orders**: `/api/v1/orders/*`

## Features Overview

### Dashboard
- Statistics cards showing totals
- Recent orders list
- Quick action buttons
- Revenue overview (chart placeholder)

### Category Management
- List all categories with search
- Create new categories
- Edit existing categories
- Delete categories
- Auto-generated slugs and IDs

### Order Management
- Advanced filtering (date range, category, search)
- Pagination
- CSV export functionality
- Order details view
- Bulk operations

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Responsive tables and cards
- Touch-friendly interface

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- React Hook Form for form handling
- Consistent component structure
- Proper error handling

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

Or deploy to platforms like Vercel, Netlify, or your preferred hosting service.

## Backend Integration

Make sure your Express backend is running and accessible at the URL specified in `NEXT_PUBLIC_API_URL`. The frontend expects the following API structure:

- Authentication endpoints for login/register
- CRUD endpoints for categories and orders
- Proper CORS configuration
- JWT token authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own admin dashboards!
