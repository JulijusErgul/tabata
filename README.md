# ⏱️ Tabata Timer App

A modern, responsive Tabata timer built with **Angular 19** and **Material Design**. Perfect for high-intensity interval training (HIIT) workouts with customizable settings and a beautiful, intuitive interface.

![Tabata Timer](https://img.shields.io/badge/Angular-19.2.0-red?style=for-the-badge&logo=angular)
![Material Design](https://img.shields.io/badge/Material%20Design-19.2.1-blue?style=for-the-badge&logo=material-design)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=for-the-badge&logo=typescript)

## 🚀 Live Demo

**[Try the Tabata Timer Now](https://julijusergul.github.io/mitt-projekt/)**

## ✨ Features

### 🏋️ **Workout Customization**
- **Flexible Rounds**: Set 1-20 work intervals
- **Work Time**: 5-300 seconds per work period
- **Rest Time**: 5-120 seconds per rest interval
- **Rest Frequency**: Configure how often rest occurs (every N rounds)
- **Round Rest**: Longer rest periods between round sets (0-300 seconds)

### 🎯 **Timer Features**
- **Real-time Countdown**: Large, easy-to-read digital display
- **Phase Indicators**: Color-coded work/rest/round rest phases
- **Progress Tracking**: Visual progress bar showing workout completion
- **Round Counter**: Current round and total rounds display
- **Total Time Calculator**: Automatic calculation of workout duration

### 🎮 **Controls**
- **Start**: Begin the workout
- **Pause/Resume**: Pause and resume at any time
- **Stop**: Stop and reset the timer
- **Reset**: Reset to initial state

### 📱 **User Experience**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean Material Design with smooth animations
- **Visual Feedback**: Color-coded phases and pulsing timer
- **Accessibility**: Keyboard navigation and screen reader support

## 🎨 Screenshots

### Desktop View
- Clean, professional interface with settings panel and timer display
- Material Design cards with proper spacing and typography
- Color-coded phase indicators (Orange for Work, Blue for Rest, Red for Round Rest)

### Mobile View
- Responsive layout that adapts to smaller screens
- Touch-friendly buttons and controls
- Optimized for one-handed use during workouts

## 🛠️ Technology Stack

- **Frontend Framework**: Angular 19.2.0 (Latest)
- **UI Components**: Angular Material 19.2.1
- **Styling**: CSS Grid, Flexbox, Material Design
- **Language**: TypeScript 5.7.2
- **Build Tool**: Angular CLI
- **Deployment**: GitHub Pages with GitHub Actions

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Git**

### Quick Start

```bash
# Clone the repository
git clone https://github.com/julijusergul/mitt-projekt.git
cd mitt-projekt

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200`

### Build Commands

```bash
# Development build
npm run build

# Production build for GitHub Pages
npm run build:github-pages

# Run tests
npm test
```

## 🚀 Deployment

### Automatic Deployment (Recommended)
This project uses GitHub Actions for automatic deployment to GitHub Pages:

1. **Push to main branch** - Automatic deployment triggers
2. **GitHub Actions builds** the application
3. **Deploys to GitHub Pages** automatically
4. **Live at**: `https://julijusergul.github.io/mitt-projekt/`

### Manual Deployment
```bash
# Build and deploy manually
npm run deploy
```

## 📁 Project Structure

```
src/
├── app/
│   ├── tabata-timer/
│   │   ├── tabata-timer.component.ts    # Main timer logic & state management
│   │   ├── tabata-timer.component.html  # Timer UI template
│   │   └── tabata-timer.component.css   # Timer styles & animations
│   ├── app.component.ts                 # Root component
│   ├── app.component.html               # Root template
│   └── app.component.css                # Root styles
├── main.ts                              # Application bootstrap
├── index.html                           # Entry point with Material setup
└── styles.css                           # Global styles
```

## 🔧 Configuration

### Angular Configuration
- **Standalone Components**: Modern Angular architecture
- **Material Design**: Azure Blue theme
- **Production Optimizations**: Enabled for GitHub Pages
- **Base Href**: Configured for `/mitt-projekt/` path

### Build Configuration
- **Output Path**: `dist/mitt-projekt`
- **Asset Optimization**: Minified and compressed
- **Cache Busting**: File hashing for optimal caching
- **Source Maps**: Available in development

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow Angular style guide
- Write meaningful commit messages
- Add tests for new features
- Ensure responsive design
- Test on multiple devices

## 🐛 Bug Reports & Feature Requests

If you find a bug or have a feature request:

1. **Check existing issues** to avoid duplicates
2. **Create a new issue** with clear description
3. **Include steps to reproduce** for bugs
4. **Provide screenshots** if relevant

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Angular Team** for the amazing framework
- **Material Design** for the beautiful UI components
- **GitHub** for hosting and GitHub Pages
- **Open Source Community** for inspiration and tools

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/julijusergul/mitt-projekt/issues)
- **Documentation**: [Deployment Guide](DEPLOYMENT.md)
- **Live Demo**: [https://julijusergul.github.io/mitt-projekt/](https://julijusergul.github.io/mitt-projekt/)

---

**Made with ❤️ using Angular 19 and Material Design**

*Perfect for your next HIIT workout session!*
