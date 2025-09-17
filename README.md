# VueJS

## IDE
- VSCODE
- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)
- [vue](https://marketplace.visualstudio.com/items?itemName=jcbuisson.vue)
- [vue-beautify](https://marketplace.visualstudio.com/items?itemName=peakchen90.vue-beautify)

En `settings.json` añadir (o ampliar existentes):

``` json
  "files.associations": {
    "*.vue": "html"
  },
  "[vue]": {
    "editor.defaultFormatter": "octref.vetur"
  },
```

## Instalar dependencias de NPM
```
npm install
```

### Arrancar el proyecto en modo desarrollo con watchers y actualizaciones en caliente
```
npm run serve
```

### Compilar el proyecto para producción
```
npm run build
```