# CustomButton Component

A reusable React Native button component built with Expo, featuring multiple variants, sizes, and customization options.

## Features

- 🎨 **Multiple Variants**: Primary (pink), Secondary (purple), and Outline styles
- 📏 **Size Options**: Small, Medium, and Large sizes
- 🎯 **Icon Support**: Add icons to buttons
- ♿ **Accessibility**: Proper disabled states and touch feedback
- 🎨 **Customizable**: Override styles and text styles
- 🌙 **Dark Mode Ready**: Designed for dark themes

## Installation

The component is already included in your project. Simply import it:

```javascript
import CustomButton from '../components/CustomButton';
```

## Basic Usage

```javascript
import CustomButton from '../components/CustomButton';

// Basic button
<CustomButton
  title="Click Me"
  onPress={() => console.log('Button pressed!')}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **Required** | Button text |
| `onPress` | `function` | **Required** | Press handler function |
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Button style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `disabled` | `boolean` | `false` | Disable the button |
| `icon` | `ReactNode` | `undefined` | Icon component to display |
| `style` | `StyleProp<ViewStyle>` | `undefined` | Additional button styles |
| `textStyle` | `StyleProp<TextStyle>` | `undefined` | Additional text styles |

## Variants

### Primary (Default)
Pink background with white text.

```javascript
<CustomButton
  title="Primary Button"
  onPress={handlePress}
  variant="primary"
/>
```

### Secondary
Purple background with white text.

```javascript
<CustomButton
  title="Secondary Button"
  onPress={handlePress}
  variant="secondary"
/>
```

### Outline
Transparent background with pink border and pink text.

```javascript
<CustomButton
  title="Outline Button"
  onPress={handlePress}
  variant="outline"
/>
```

## Sizes

### Small
```javascript
<CustomButton
  title="Small Button"
  size="small"
  onPress={handlePress}
/>
```

### Medium (Default)
```javascript
<CustomButton
  title="Medium Button"
  size="medium"
  onPress={handlePress}
/>
```

### Large
```javascript
<CustomButton
  title="Large Button"
  size="large"
  onPress={handlePress}
/>
```

## With Icons

Add icons to your buttons:

```javascript
<CustomButton
  title="Save"
  icon={<Text>💾</Text>}
  onPress={handleSave}
/>
```

## Disabled State

```javascript
<CustomButton
  title="Disabled Button"
  onPress={handlePress}
  disabled={true}
/>
```

## Custom Styling

Override default styles:

```javascript
<CustomButton
  title="Custom Style"
  onPress={handlePress}
  style={{ backgroundColor: '#FF6B35' }}
  textStyle={{ fontStyle: 'italic' }}
/>
```

## Examples

### Form Submit Button
```javascript
<CustomButton
  title="Submit"
  onPress={handleSubmit}
  variant="primary"
  size="large"
  disabled={!isFormValid}
/>
```

### Action Button with Icon
```javascript
<CustomButton
  title="Add Item"
  icon={<Text>➕</Text>}
  onPress={handleAdd}
  variant="secondary"
/>
```

### Cancel Button
```javascript
<CustomButton
  title="Cancel"
  onPress={handleCancel}
  variant="outline"
  size="small"
/>
```

## Styling

The component uses the following color scheme:

- **Primary**: `#FF69B4` (Pink)
- **Secondary**: `#8A2BE2` (Purple)
- **Background**: `#1A0B2E` (Dark Purple)
- **Text**: `#FFFFFF` (White)
- **Outline Text**: `#FF69B4` (Pink)

## Demo

To see the component in action, navigate to the ComponentDemoScreen:

```javascript
import ComponentDemoScreen from '../screens/ComponentDemoScreen';
```

The demo screen showcases all variants, sizes, and features of the CustomButton component.

## Accessibility

- Proper touch targets (minimum 44px height)
- Visual feedback with `activeOpacity`
- Disabled state handling
- Semantic button behavior

## Performance

- Optimized re-renders with proper prop handling
- Efficient style calculations
- Minimal memory footprint 