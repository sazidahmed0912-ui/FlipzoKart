const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [100, 'Brand name cannot exceed 100 characters']
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  specifications: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  trackInventory: {
    type: Boolean,
    default: true
  },
  allowBackorder: {
    type: Boolean,
    default: false
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      default: 'cm'
    }
  },
  shipping: {
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: [0, 'Shipping cost cannot be negative']
    },
    shippingWeight: Number
  },
  tax: {
    taxClass: {
      type: String,
      default: 'standard'
    },
    taxRate: {
      type: Number,
      default: 0,
      min: [0, 'Tax rate cannot be negative']
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be less than 0']
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    comment: String,
    verified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  discounts: [{
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: [0, 'Discount value cannot be negative']
    },
    startDate: Date,
    endDate: Date,
    minQuantity: {
      type: Number,
      default: 1
    },
    active: {
      type: Boolean,
      default: false
    }
  }],
  variants: [{
    name: {
      type: String,
      required: true
    },
    sku: {
      type: String,
      required: true,
      unique: true
    },
    price: Number,
    stock: Number,
    image: String,
    attributes: [{
      name: String,
      value: String
    }]
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for effective price (after discount)
productSchema.virtual('effectivePrice').get(function() {
  if (!this.originalPrice || this.originalPrice <= this.price) {
    return this.price;
  }
  
  // Check for active discounts
  const activeDiscount = this.discounts.find(discount => 
    discount.active &&
    (!discount.startDate || new Date(discount.startDate) <= new Date()) &&
    (!discount.endDate || new Date(discount.endDate) >= new Date())
  );
  
  if (activeDiscount) {
    if (activeDiscount.type === 'percentage') {
      return this.price * (1 - activeDiscount.value / 100);
    } else {
      return Math.max(0, this.price - activeDiscount.value);
    }
  }
  
  return this.price;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (!this.originalPrice || this.originalPrice <= this.price) {
    return 0;
  }
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (!this.trackInventory) return 'infinite';
  if (this.stock === 0 && !this.allowBackorder) return 'out_of_stock';
  if (this.stock <= this.lowStockThreshold) return 'low_stock';
  return 'in_stock';
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
