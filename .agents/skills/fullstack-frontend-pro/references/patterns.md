# High-Quality Frontend Patterns

## 1. Cinematic Scrolling
Transform static grids into narrative journeys.
- **Technique**: Use `framer-motion` to trigger entrance animations based on viewport scroll progress.
- **Rule**: Content should "glide" into place with high-mass, low-stiffness springs.

## 2. Liquid Glass Implementation
Apply the materials defined in `apple-design-patterns`.
- **CSS Tip**: Use `backdrop-filter` extensively but optimize for mobile by disabling it on low-power devices.
- **Interaction**: Add `transition: backdrop-filter 0.3s ease, transform 0.3s cubic-bezier(0.2, 0, 0, 1)`.

## 3. Spatial Readiness (Vision Pro)
Prepare web apps for spatial computing.
- **Hit Targets**: Increase interactive area to minimum 44x44 points.
- **Hover States**: Implement `hover:scale(1.05)` and `box-shadow` glows to simulate eye-gaze focus.

## 4. Agentic Feedback
- **Sparkle Backgrounds**: Apply to components containing AI-generated data.
- **Confidence Bars**: Use thin, refractive progress lines for long-running AI tasks.