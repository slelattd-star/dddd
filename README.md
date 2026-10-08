# Global Building · Modelos 3D

Presentación interactiva con los 5 sistemas del catálogo: VH30, E20, K5, estructura de acero y hotel de acero liviano.
Cada modelo tiene vistas exterior, interior, planta y recorrido, cotas, persona de referencia, ficha, plano y fotos.

- `index.html`: página autocontenida (necesita internet para cargar Three.js y las fuentes). `index.html#e20` abre directo un modelo (`vh30`, `e20`, `k5`, `acero`, `hotel`).
- `src/head.html`: estilos. `src/app.html`: estructura de la página y kit de construcción 3D.
- `src/models.js`: geometría y contenido de cada modelo. `src/engine.js`: cámara, recorrido, panel y carga de modelos.
- `assets/`: fotos y planos extraídos del catálogo.
- `build.py`: incrusta las imágenes y genera `index.html` → `python3 build.py`.

Las medidas exteriores salen de los planos; las distribuciones interiores son aproximadas.
