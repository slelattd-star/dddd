# VH30 · Presentación interactiva

Modelo 3D navegable de la cápsula modular VH30 (8.500 × 3.400 × 2.866 mm), con ficha técnica y fotos.

- `index.html`: página autocontenida, se abre directo en el navegador (necesita internet para cargar Three.js y las fuentes).
- `src/template.html`: fuente de la página. Las fotos se referencian como `{{IMG:nombre}}`.
- `assets/`: fotos recortadas del catálogo.
- `build.py`: incrusta las fotos y genera `index.html` → `python3 build.py`.

Las medidas exteriores salen del plano; la distribución interior y el mobiliario son aproximados.
