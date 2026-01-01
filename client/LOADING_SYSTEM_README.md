# Premium Loading System Documentation

## Overview

A complete, production-grade loading and transition system for modern e-commerce applications. Provides centralized loading state management, smooth page transitions, and luxury-grade user experience.

## Features

- 🚀 **Centralized State Management** - Single source of truth for all loading states
- 🎬 **Smooth Page Transitions** - Fade/slide animations between routes
- 🛒 **Add to Cart Loading** - Button-level loading with prevention of double clicks
- 💳 **Payment Flow Loader** - Step-by-step payment processing with progress indicators
- 🛍️ **Checkout Overlay** - Full-screen loader for checkout preparation
- 📦 **Order Placement** - Progress tracking for order submission
- ♿ **Accessibility Compliant** - ARIA labels, focus management, screen reader support
- 🎨 **Premium Design** - Luxury UI with brand colors (#ff7a00)
- ⚡ **Performance Optimized** - GPU-accelerated animations, 120fps support

## Architecture

```
src/
├── context/
│   └── LoadingContext.js          # Centralized loading state
├── components/
│   ├── ui/
│   │   ├── Loader.jsx            # Main reusable loader component
│   │   ├── AddToCartButton.jsx   # Add to cart with loading
│   │   ├── PageTransition.jsx    # Route change transitions
│   │   ├── PaymentLoader.jsx     # Payment processing loader
│   │   ├── AppWithLoading.jsx    # App wrapper with loading
│   │   └── index.js              # Component exports
│   └── examples/
│       └── LoadingIntegrationExample.jsx
└── config/
    └── animations.js             # Animation configuration
```

## Quick Start

### 1. Wrap Your App

```jsx
import { LoadingProvider } from './context/LoadingContext';
import AppWithLoading from './components/ui/AppWithLoading';

function App() {
  return (
    <LoadingProvider>
      <AppWithLoading>
        <YourAppContent />
      </AppWithLoading>
    </LoadingProvider>
  );
}
```

### 2. Use Loading Hooks

```jsx
import { useLoading } from './context/LoadingContext';

function MyComponent() {
  const { 
    startAddToCart, 
    stopAddToCart, 
    startCheckout, 
    startPayment, 
    startOrder 
  } = useLoading();

  const handleAddToCart = async (product) => {
    startAddToCart();
    try {
      await api.addToCart(product);
    } finally {
      stopAddToCart();
    }
  };

  return (
    <AddToCartButton 
      product={product}
      onAddToCart={handleAddToCart}
    />
  );
}
```

## Components

### Loader Component

Main reusable loader with multiple modes:

```jsx
<Loader 
  mode="checkout"           // 'global' | 'pageTransition' | 'addToCart' | 'checkout' | 'payment' | 'order'
  message="Loading..."      // Custom message
  showOverlay={true}        // Show background overlay
  preventScroll={true}      // Prevent background scrolling
/>
```

### AddToCartButton

Button with integrated loading state:

```jsx
<AddToCartButton 
  product={product}
  onAddToCart={handleAddToCart}
  disabled={false}
  className="custom-class"
>
  Add to Cart
</AddToCartButton>
```

### PageTransition

Automatic page transition handling:

```jsx
<PageTransition location={location.pathname}>
  <PageContent />
</PageTransition>
```

### PaymentLoader

Step-by-step payment processing:

```jsx
// Automatically shows when payment loading is active
<PaymentLoader />
```

## Loading States

### Available States

- `global` - General loading state
- `pageTransition` - Route change loading
- `addToCart` - Add to cart button loading
- `checkout` - Checkout preparation loading
- `payment` - Payment processing with steps
- `order` - Order placement loading

### Payment Steps

1. "Initializing payment..."
2. "Redirecting to gateway..."
3. "Verifying payment..."
4. "Processing payment..."

## Styling

### Brand Colors

- Primary: `#ff7a00` (Orange)
- Background: `rgba(0, 0, 0, 0.5)` (Overlay)
- Text: `#ffffff` (White on overlay)

### Animation Timing

- Fast: `200ms` (Button interactions)
- Medium: `300ms` (Page transitions)
- Slow: `500ms` (Complex animations)

### Accessibility

- ARIA labels and roles
- Focus management
- Screen reader announcements
- Reduced motion support
- Keyboard navigation

## Vercel Deployment

### Required Configuration

```json
{
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "postinstall": "chmod +x vercel-build.sh"
  }
}
```

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "framework": "create-react-app"
}
```

### vercel-build.sh

```bash
#!/bin/sh
npm run build
```

## Performance

### Optimization Features

- GPU-accelerated animations
- Minimal re-renders
- Efficient state management
- Lazy loading support
- Bundle size optimization

### Metrics

- Animation FPS: 120fps target
- Bundle size: < 150KB gzipped
- Load time: < 2s first paint
- Interaction: < 100ms response

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

1. **Build Error 126**: Ensure Node.js 18.x in package.json
2. **Invalid vercel.json**: Check JSON syntax
3. **Loading not showing**: Verify LoadingProvider wrapper
4. **Animation stutter**: Check GPU acceleration

### Debug Mode

```jsx
// Enable debug logging
const { loadingState } = useLoading();
console.log('Loading state:', loadingState);
```

## Contributing

1. Follow existing code patterns
2. Test accessibility
3. Verify performance
4. Update documentation

## License

MIT License - see LICENSE file for details.
