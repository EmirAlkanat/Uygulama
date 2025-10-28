# Modern React Native App

A beautiful React Native application featuring a dark purple theme with pink and lavender accent colors. This app showcases modern UI design principles with rounded buttons, elegant typography, and a sophisticated color palette.

## Features

- 🎨 **Dark Purple Theme**: Elegant dark purple background (#1A0B2E)
- 🌸 **Pink Accents**: Vibrant pink (#FF69B4) for primary actions
- 💜 **Lavender Accents**: Soft lavender (#E6E6FA) for secondary elements
- 📱 **Modern UI**: Rounded buttons, cards, and smooth shadows
- ⚡ **Interactive Elements**: Touchable buttons with feedback
- 📝 **Input Field**: Styled text input with placeholder
- 🎯 **Responsive Design**: Adapts to different screen sizes

## Color Palette

- **Background**: Dark Purple (#1A0B2E)
- **Primary**: Pink (#FF69B4)
- **Secondary**: Lavender (#E6E6FA)
- **Text**: White (#FFFFFF) and Light Purple (#E6E6FA)
- **Cards**: Slightly lighter purple (#2D1B4E)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd modern-react-native-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Project Structure

```
modern-react-native-app/
├── App.js                 # Main app entry point
├── package.json           # Dependencies and scripts
├── app.json              # Expo configuration
├── src/
│   └── screens/
│       └── ModernScreen.js # Main screen component
└── README.md             # This file
```

## Components

### ModernScreen
The main screen component featuring:
- Header with title and subtitle
- Text input field
- Three styled buttons (Primary, Secondary, Accent)
- Feature cards with descriptions
- Footer

### Styling
All styles are defined using React Native's StyleSheet API with:
- Consistent spacing and typography
- Shadow effects for depth
- Rounded corners for modern look
- Proper color contrast for accessibility

## Customization

You can easily customize the app by modifying the color values in the `styles` object within `ModernScreen.js`. The color palette is designed to be cohesive and can be adjusted to match your brand or preferences.

## Technologies Used

- React Native
- Expo
- React Native Safe Area Context
- React Native Screens

## License

This project is open source and available under the MIT License. 