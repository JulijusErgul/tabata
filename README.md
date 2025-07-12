# Tabata Timer App

A modern, responsive Tabata timer built with Angular 19 and Material Design. Perfect for high-intensity interval training workouts.

## Features

- ⏱️ **Customizable Timer**: Set work time, rest time, and number of rounds
- 🔄 **Flexible Rest Intervals**: Configure how often rest periods occur
- 🏋️ **Round Rest Periods**: Set longer rest periods between round sets
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Clean Material Design interface with smooth animations
- ⏯️ **Full Controls**: Start, pause, resume, stop, and reset functionality

## Settings

- **Rounds**: Number of work intervals (1-20)
- **Work Time**: Duration of work periods in seconds (5-300)
- **Rest Time**: Duration of short rest periods in seconds (5-120)
- **Rest Frequency**: How often rest occurs (every N rounds)
- **Rest Between Rounds**: Longer rest periods between round sets (0-300 seconds)

## Development

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mitt-projekt.git
cd mitt-projekt

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200`

### Build

```bash
# Build for production
npm run build

# Build for GitHub Pages
npm run build:github-pages
```

### Testing

```bash
# Run unit tests
npm test
```

## Deployment

### GitHub Pages (Automatic)

This project is configured for automatic deployment to GitHub Pages using GitHub Actions. Simply push to the main branch and the app will be automatically deployed.

### Manual Deployment

If you prefer manual deployment:

1. Build the project for GitHub Pages:
   ```bash
   npm run build:github-pages
   ```

2. Deploy using the angular-cli-ghpages tool:
   ```bash
   npm run deploy
   ```

### GitHub Pages Setup

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "GitHub Actions"
4. The workflow will automatically deploy your app

## Project Structure

```
src/
├── app/
│   ├── tabata-timer/
│   │   ├── tabata-timer.component.ts    # Main timer logic
│   │   ├── tabata-timer.component.html  # Timer template
│   │   └── tabata-timer.component.css   # Timer styles
│   ├── app.component.ts                 # Root component
│   ├── app.component.html               # Root template
│   └── app.component.css                # Root styles
├── main.ts                              # Application bootstrap
└── index.html                           # Entry point
```

## Technologies Used

- **Angular 19**: Latest version with standalone components
- **Angular Material**: UI components and theming
- **TypeScript**: Type-safe development
- **CSS Grid & Flexbox**: Modern layout techniques
- **GitHub Actions**: Automated deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Live Demo

Visit the live application: [https://yourusername.github.io/mitt-projekt/](https://yourusername.github.io/mitt-projekt/)
