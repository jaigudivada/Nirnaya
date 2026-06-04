# Nirnaya - Decision Wheel

A beautiful, interactive decision wheel application with multiple geometric designs and smooth animations. Make decisions in style with customizable wheel designs including flower petals, fan blades, neon effects, and even a solar system galaxy!

## Features

### Wheel Designs
- **Classic** - Traditional circular wheel with pie segments
- **Neon** - Glowing neon effects with cyan/magenta colors
- **Cyber** - Cyberpunk aesthetic with digital grid lines
- **Flower** - Realistic flower with organic petal shapes
- **Fan** - Ceiling fan/pinwheel with curved blades
- **Star** - Elegant star-shaped segments with sharp points
- **Rainbow** - Vibrant rainbow gradient overlay
- **Galaxy** - Solar system with orbiting planets and rings

### Core Functionality
- Add/remove decision options
- Smooth spinning animation with realistic physics
- Visual winner announcement with modal
- Persistent storage for options and preferences
- Dark/Light theme toggle
- Responsive design for all devices
- Material Design ripple effects on buttons
- Tick animations when wheel crosses segments
- Enhanced keyboard shortcuts (ESC to close modal)

### Technical Highlights
- Canvas-based rendering for precise geometric shapes
- Instant design switching without page reload
- Custom animations and visual effects
- Local storage for user preferences
- Component-based architecture

### Advanced Features
- Physics-based spinning with realistic deceleration
- Segment crossing detection with tick animations
- Dynamic center effects (pulsing, glowing, rotating)
- Responsive canvas sizing for all screen sizes
- Smooth 60fps animations with requestAnimationFrame

## Installation

Simply open `index.html` in your web browser - no installation required!

```bash
# Clone or download the project
git clone <repository-url>
cd decision-maker

# Open in browser
open index.html
# or double-click the file
```

## Usage

1. **Add Options**: Type your decision options and click "Add"
2. **Choose Design**: Select from 8 unique wheel designs
3. **Spin**: Click "Spin the Wheel" to make your decision
4. **View Result**: See the winning option in the modal

## Controls

- **Add Button**: Add new decision options
- **Spin Button**: Start the wheel spinning
- **Clear All**: Remove all options
- **Design Buttons**: Switch between wheel designs
- **Theme Toggle**: Switch between dark and light themes
- **Spin Again**: Spin again after seeing result
- **Edit Options**: Close result modal and modify options

## Wheel Designs Details

### Classic
- Perfect circular shape
- Traditional pie segments
- Clean, professional appearance

### Neon
- Strong glowing effects
- Cyan and magenta color scheme
- Multiple blur layers for realistic neon

### Cyber
- Dark background with grid lines
- Electric blue and magenta accents
- Futuristic cyberpunk styling

### Flower
- 8-12 organic petal shapes
- Soft gradients and natural curves
- Golden center circle

### Fan
- Curved fan blade shapes
- Industrial metallic styling
- Center hub with bolt detail

### Star
- Elegant star-shaped segments
- Sharp geometric points
- Subtle pulsing center effect

### Rainbow
- Vibrant color gradients
- Joyful, playful appearance
- Continuous color transitions

### Galaxy
- Orbiting planets around central sun
- Some planets with rings
- Cosmic color palette

## Technical Architecture

### Frontend Technologies
- **HTML5** - Semantic structure
- **CSS3** - Animations, gradients, transitions
- **JavaScript (ES6+)** - Core functionality
- **Canvas API** - Precise geometric rendering

### Key Components
- **State Management** - Centralized app state
- **Rendering Engine** - Canvas-based wheel generation
- **Animation System** - Smooth spinning and transitions
- **Storage Layer** - LocalStorage persistence
- **Event System** - User interaction handling

### Design Patterns
- **Module Pattern** - Encapsulated functionality
- **Observer Pattern** - UI updates
- **Strategy Pattern** - Different rendering strategies per design

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## File Structure

```
decision-maker/
|
|-- index.html          # Main application file
|-- README.md           # This documentation
```

## Customization

### Adding New Wheel Designs

1. Add design button to HTML:
```html
<button class="design-btn" data-design="newdesign">New Design</button>
```

2. Add color palette to `getWheelColors()`:
```javascript
case 'newdesign':
    return ['#color1', '#color2', '#color3'];
```

3. Add segment style to `getSegmentStyle()`:
```javascript
case 'newdesign':
    return { stroke: '#border', strokeWidth: 2, textFill: '#text' };
```

4. Create rendering function:
```javascript
function renderNewDesignWheel(segments, colors, segmentStyle) {
    // Custom SVG rendering logic
}
```

5. Add to main switch statement in `renderWheel()`:
```javascript
case 'newdesign':
    renderNewDesignWheel(segments, colors, segmentStyle);
    break;
```

Note: The application uses Canvas API for rendering, not SVG. Refer to the existing rendering functions for proper Canvas implementation patterns.

### Modifying Colors and Styles

Edit the CSS variables in the `:root` selector:
```css
:root {
    --primary: #2563EB;
    --secondary: #4ECDC4;
    --accent: #FF6B6B;
    /* Add more variables */
}
```

## Performance

- Optimized SVG rendering
- Efficient state management
- Smooth 60fps animations
- Minimal memory footprint

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- High contrast color schemes
- Screen reader compatible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with modern web technologies
- Inspired by classic decision-making wheels
- Enhanced with creative geometric designs
- Optimized for user experience

## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Nirnaya** - Making decisions beautiful since 2025! 

*"The wheel has spoken - let the decision guide your path!"*
