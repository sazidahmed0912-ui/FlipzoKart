const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
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
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0
  },
  path: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String]
  },
  productCount: {
    type: Number,
    default: 0
  },
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

// Virtual for full path
categorySchema.virtual('fullPath').get(function() {
  return this.path || this.name;
});

// Pre-save middleware to generate slug and path
categorySchema.pre('save', async function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  // Set level and path if parent is specified
  if (this.isModified('parent') && this.parent) {
    try {
      const parentCategory = await this.constructor.findById(this.parent);
      if (parentCategory) {
        this.level = parentCategory.level + 1;
        this.path = parentCategory.path ? `${parentCategory.path} > ${this.name}` : this.name;
      }
    } catch (error) {
      next(error);
    }
  } else if (!this.parent) {
    this.level = 0;
    this.path = this.name;
  }
  
  next();
});

// Static method to get category tree
categorySchema.statics.getCategoryTree = function() {
  return this.find({ isActive: true })
    .sort({ level: 1, sortOrder: 1, name: 1 })
    .populate('parent', 'name slug');
};

// Static method to get root categories
categorySchema.statics.getRootCategories = function() {
  return this.find({ parent: null, isActive: true })
    .sort({ sortOrder: 1, name: 1 });
};

// Static method to get subcategories
categorySchema.statics.getSubcategories = function(parentId) {
  return this.find({ parent: parentId, isActive: true })
    .sort({ sortOrder: 1, name: 1 });
};

// Method to get all descendants
categorySchema.methods.getDescendants = function() {
  return this.constructor.find({ 
    path: { $regex: '^' + this.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' >' },
    isActive: true 
  }).sort({ level: 1, sortOrder: 1, name: 1 });
};

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });
categorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', categorySchema);
