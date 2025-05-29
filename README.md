# Quantii POS System

A modern Point of Sale (POS) system built with Next.js and Firebase Firestore. Features inventory management, transaction processing, and real-time data synchronization.

## Features

🏪 **Complete POS System**
- Dashboard with business metrics
- Real-time inventory management
- Point of sale with cart functionality
- Transaction history and reporting

🔍 **Smart Search**
- Global search across items and features
- Quick navigation to any section
- Instant item lookup

☁️ **Cloud-Powered**
- Firebase Firestore integration
- Real-time data synchronization
- Persistent data storage
- Offline fallback support

🎨 **Modern UI**
- Clean, responsive design
- Tailwind CSS styling
- Intuitive user interface
- Loading states and error handling

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pos-js-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase (Required for data persistence)**
   - Follow the detailed guide in `FIREBASE_SETUP.md`
   - Copy `.env.example` to `.env.local` and update with your Firebase config

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open http://localhost:3000
   - Login with demo key: `admin123`

## Deployment

### GitHub Pages

- See `DEPLOYMENT.md` for complete setup instructions
- Configure GitHub secrets with your Firebase config
- Push to `main` branch for automatic deployment

### Other Platforms

- **Vercel**: Connect repo, add environment variables, deploy
- **Netlify**: Connect repo, configure build settings, deploy
- **Self-hosted**: Build locally and upload `out/` folder

## Demo Key

```
admin123
```

## Project Structure

```
src/
├── app/
│   ├── page.js          # Main POS application
│   ├── layout.js        # App layout and metadata
│   └── globals.css      # Global styles
└── lib/
    ├── firebase.js      # Firebase configuration
    └── firestore.js     # Firestore service layer
```

## Technology Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Database**: Firebase Firestore
- **Icons**: Lucide React
- **Hosting**: Vercel (recommended)

## Firebase Integration

The application uses Firebase Firestore for:
- **Inventory Management**: Persistent storage of products, prices, and stock levels
- **Transaction History**: Complete record of all sales transactions
- **Real-time Updates**: Live synchronization across multiple devices
- **Offline Support**: Graceful fallback when connection is unavailable

## Usage

### Authentication
- Simple key-based authentication (`admin123`)
- Can be extended with Firebase Auth for production use

### Inventory Management
- Add, edit, and delete inventory items
- Track stock levels with low-stock indicators
- Organize by categories and SKUs
- Real-time updates across all devices

### Point of Sale
- Add items to cart with quantity controls
- Process transactions with automatic inventory updates
- Visual feedback for successful transactions
- Cart persistence during session

### Transaction History
- Complete record of all sales
- Detailed item breakdown for each transaction
- Total revenue tracking
- Timestamp for each transaction

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project (see FIREBASE_SETUP.md)

### Environment Setup
The application requires Firebase configuration. See `FIREBASE_SETUP.md` for detailed setup instructions.

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set up your Firebase configuration as environment variables
3. Deploy automatically on git push

### Other Platforms
The app can be deployed to any platform that supports Next.js applications.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For setup help or questions:
1. Check the `FIREBASE_SETUP.md` guide
2. Review the console for error messages
3. Ensure Firebase configuration is correct
4. Verify Firestore security rules allow read/write access
