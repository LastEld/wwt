# 🎨 Frontend Implementation Guide

> Guidance for building the premium WinWin Travel UI using Next.js 14, Tailwind CSS, and Framer Motion.

---

## 1. Design System & Tokens

Our design is based on a "Premium Wellness" aesthetic: clean, spacious, with subtle gradients and high-quality typography.

### Tailwind Configuration (`tailwind.config.ts`)

```typescript
// Define custom colors and shadows for the premium look
const config = {
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#F8F9FA',
          DEFAULT: '#1A1A1A', // Deep Charcoal
          gold: '#D4AF37',   // Accents
          muted: '#6C757D',
        },
        surface: {
          glass: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(26, 26, 26, 0.95)',
        }
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      }
    }
  }
}
```

### Typography

Use **Inter** for UI and **Playfair Display** (or similar) for headings to create a luxury feel.

---

## 2. Premium Animations (Framer Motion)

Animations should be subtle and purposeful.

### Hero Section Entrance
```tsx
import { motion } from 'framer-motion';

export const Hero = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <h1>Find Your Perfect Stay</h1>
  </motion.div>
);
```

### Hotel Card Hover
```tsx
export const HotelCard = ({ hotel }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="bg-white rounded-2xl shadow-premium overflow-hidden"
  >
    {/* Card Content */}
  </motion.div>
);
```

---

## 3. State Management Best Practices

### Client State (Zustand)
Use Zustand for lightweight, global UI state (e.g., search modal openness, currency preference).

```typescript
// src/store/useSearchStore.ts
import { create } from 'zustand';

interface SearchState {
  isFiltersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  currency: string;
  setCurrency: (c: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isFiltersOpen: false,
  setFiltersOpen: (open) => set({ isFiltersOpen: open }),
  currency: 'EUR',
  setCurrency: (c) => set({ currency: c }),
}));
```

### Server State (TanStack Query)
Use for fetching and syncing hotel data.

```tsx
// src/hooks/useHotels.ts
import { useQuery } from '@tanstack/react-query';

export const useHotels = (searchParams: SearchParams) => {
  return useQuery({
    queryKey: ['hotels', searchParams],
    queryFn: () => fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify(searchParams)
    }).then(res => res.json()),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
```

---

## 4. Next.js 14 Architecture Patterns

### Server Components (RSC) vs. Client Components
To maximize performance, follow the "Client at the Leaves" pattern:

- **Server Components (Default)**: Use for static parts of the page (Layout, Footer, Hotel Description) to reduce the initial JavaScript bundle.
- **Client Components (`'use client'`)**: Use only for interactive elements (Search Input, Like Button, Map).

```tsx
// src/app/hotel/[id]/page.tsx
export default async function HotelPage({ params }) {
  const hotel = await getHotelFromDB(params.id); // RSC fetching
  
  return (
    <main>
      <HotelDetails hotel={hotel} /> {/* RSC */}
      <LikeButton hotelId={hotel.id} /> {/* Client Component */}
      <ReviewList hotelId={hotel.id} /> {/* Client Component for interactivity */}
    </main>
  );
}
```

---

## 5. Optimistic UI Updates

When Alex clicks "Like," don't wait for the server response. Update the UI immediately.

```tsx
// src/components/LikeButton.tsx
'use client';

export const LikeButton = ({ hotelId }) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (newType) => postReaction(hotelId, newType),
    // Optimistic Update
    onMutate: async (newType) => {
      await queryClient.cancelQueries({ queryKey: ['reactions', hotelId] });
      const previousReaction = queryClient.getQueryData(['reactions', hotelId]);
      
      queryClient.setQueryData(['reactions', hotelId], { type: newType });
      
      return { previousReaction };
    },
    onError: (err, newType, context) => {
      // Rollback on error
      queryClient.setQueryData(['reactions', hotelId], context.previousReaction);
    }
  });

  return (
    <button onClick={() => mutation.mutate('LIKE')}>
      {mutation.variables === 'LIKE' ? '❤️' : '🤍'}
    </button>
  );
};
```

---

## 6. Mobile Responsiveness

- **Bottom Sheets**: Use for filters on mobile instead of modals.
- **Sticky Actions**: Mobile booking button should be a sticky bar at the bottom.
- **Image Swiping**: Implement touch-friendly carousels for hotel images.
