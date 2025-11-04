# Quick Setup Guide

## Current Status

✅ Android project is ready to use
⚠️ iOS project needs to be generated

## Testing Android (Ready Now)

```bash
# From the example directory
cd /Users/robert.volmer/in_progress/moneykit-react-native/example

# Install dependencies
npm install

# Start Metro bundler in one terminal
npm start

# In another terminal, run Android
npm run android
```

## Setting Up iOS

The iOS project folder doesn't exist yet. Here are your options:

### Option 1: Use React Native CLI (Recommended)

```bash
cd /Users/robert.volmer/in_progress/moneykit-react-native/example

# This will create the ios/ folder with the proper structure
npx react-native init TempApp --skip-install
mv TempApp/ios ./ios
rm -rf TempApp

# Update the project name in ios/Podfile and other configs
# Then install pods
cd ios && pod install && cd ..
```

### Option 2: Copy from a Fresh Init

```bash
# Create a temporary React Native app
cd /tmp
npx react-native init MoneykitTemp

# Copy the iOS folder
cp -r MoneykitTemp/ios /Users/robert.volmer/in_progress/moneykit-react-native/example/

# Clean up
rm -rf MoneykitTemp

# Install pods
cd /Users/robert.volmer/in_progress/moneykit-react-native/example/ios
pod install
cd ..
```

### Option 3: Manual Setup (Advanced)

Create the iOS folder structure manually with proper Xcode project files. This requires understanding of Xcode project structure.

## After iOS Setup

```bash
npm run ios
```

## Troubleshooting

### "Module not found" errors

Clear Metro cache:
```bash
npm start -- --reset-cache
```

### Android build issues

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS build issues

```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

## Next Steps

1. Test the Android build
2. Generate iOS project
3. Update App.tsx with a real link session token
4. Test the full MoneyKit flow
