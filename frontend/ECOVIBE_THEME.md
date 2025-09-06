# 🌿 EcoVibe Theme Documentation

**EcoVibe** is a modern, sustainable-focused design system for second-hand marketplaces. This theme emphasizes eco-consciousness while maintaining clean, intuitive user interfaces.

## 🎨 Design Philosophy

**Name:** EcoVibe  
**Style:** Minimal • Modern • Clean • Eco-friendly  
**Feel:** Fresh, trust-building, and sustainability-focused  
**Target Audience:** People who want to buy & sell second-hand products responsibly

## 🌈 Color Palette

| Color | Hex Code | Usage | Example |
|-------|----------|-------|---------|
| 🌿 **Eco Green** | `#27AE60` | Primary buttons, highlights, and accents | ![#27AE60](https://via.placeholder.com/20x20/27AE60/000000?text=+) |
| 🌱 **Mint Green** | `#A8E6CF` | Secondary accents, hover states | ![#A8E6CF](https://via.placeholder.com/20x20/A8E6CF/000000?text=+) |
| ⚪ **Pure White** | `#FFFFFF` | Background for a clean look | ![#FFFFFF](https://via.placeholder.com/20x20/FFFFFF/000000?text=+) |
| ⚫ **Charcoal Black** | `#2C3E50` | Primary text color | ![#2C3E50](https://via.placeholder.com/20x20/2C3E50/000000?text=+) |
| 🌤️ **Soft Gray** | `#ECF0F1` | Card backgrounds, placeholders, dividers | ![#ECF0F1](https://via.placeholder.com/20x20/ECF0F1/000000?text=+) |

### Additional Colors
- **Light Gray**: `#7F8C8D` - Secondary text
- **Accent Gray**: `#95A5A6` - Placeholder text
- **Success**: `#27AE60` - Success states
- **Error**: `#E74C3C` - Error states
- **Warning**: `#F39C12` - Warning states

## ✍️ Typography

### Font Families
- **Headings**: `'Poppins'` - For clean and modern headings
- **Body Text**: `'Inter'` - For better readability

### Font Weights
- **Regular**: 400
- **Medium**: 500  
- **Semibold**: 600
- **Bold**: 700

### Text Styles
- **Headings (H1, H2)**: Bold, sometimes uppercase
- **Body Text**: Regular or medium weight, highly readable
- **Buttons**: Uppercase, semibold

## 🎯 Component Guidelines

### Buttons

#### Primary Button
```css
.eco-btn-primary {
  background: linear-gradient(135deg, #27AE60, #2ECC71);
  color: #FFFFFF;
  border-radius: 12px;
  padding: 16px 24px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

#### Secondary Button
```css
.eco-btn-secondary {
  background: transparent;
  color: #27AE60;
  border: 2px solid #27AE60;
  border-radius: 12px;
  padding: 16px 24px;
}
```

### Input Fields
```css
.eco-input {
  border: 2px solid #ECF0F1;
  border-radius: 12px;
  padding: 16px 20px;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
}

.eco-input:focus {
  border-color: #27AE60;
  box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.1);
}
```

### Cards
```css
.eco-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(39, 174, 96, 0.08);
  border: 1px solid rgba(168, 230, 207, 0.3);
}
```

## 📱 Responsive Design

The theme is fully responsive with breakpoints:
- **Mobile**: < 480px
- **Tablet**: 480px - 768px  
- **Desktop**: > 768px

## 🛠️ Implementation Files

### Core Files
- `src/styles/theme.js` - Theme configuration and utilities
- `src/styles/components.css` - Reusable component styles
- `src/index.css` - Global styles and CSS variables
- `src/pages/Login.css` - Login/Signup page specific styles

### Updated Components
- `src/pages/Login.jsx` - Login page with EcoVibe theme
- `src/pages/Signup.jsx` - Signup page with EcoVibe theme
- `index.html` - Updated with Google Fonts and meta tags

## 🌍 Eco-Friendly Features

1. **Green Color Scheme**: Symbolizes sustainability and nature
2. **Clean Design**: Reduces visual clutter, promoting mindful consumption
3. **Sustainable Messaging**: Copy emphasizes eco-consciousness
4. **Trust-Building Elements**: Professional design builds user confidence

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Import Theme Utilities** (optional):
   ```javascript
   import theme from './src/styles/theme.js';
   import './src/styles/components.css';
   ```

## 💡 Usage Examples

### Using Theme Variables in Components
```javascript
import theme from '../styles/theme.js';

const MyComponent = () => {
  return (
    <button 
      style={{
        background: theme.colors.gradients.primary,
        borderRadius: theme.borderRadius.md,
        padding: `${theme.spacing.lg} ${theme.spacing['2xl']}`
      }}
    >
      Eco Button
    </button>
  );
};
```

### Using CSS Classes
```jsx
<div className="eco-card">
  <h2 className="eco-heading eco-heading-2">Welcome to EcoVibe</h2>
  <p className="eco-text eco-text-secondary">Your sustainable marketplace</p>
  <button className="eco-btn eco-btn-primary">Get Started</button>
</div>
```

## 🎨 Design Tokens

All design tokens are centralized in `theme.js`:
- Colors and gradients
- Typography scales
- Spacing system
- Border radius values
- Shadow definitions
- Breakpoints

## 🔧 Customization

To customize the theme:

1. Edit values in `src/styles/theme.js`
2. Update CSS variables in `src/index.css`
3. Modify component styles in `src/styles/components.css`

## 📄 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- ES6+ JavaScript features used

---

**🌿 Built with sustainability in mind for the EcoVibe marketplace**
