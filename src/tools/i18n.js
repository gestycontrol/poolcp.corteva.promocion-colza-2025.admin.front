import strings from "@/data/strings.js";
import { getCookie, setCookie } from "@/tools/cookie.js";

const defaultStrings = {
  'es': {
    ' and $1': ' y $1',
    '%s item(s) per page': '%s elemento(s) por página',
    'Accept': 'Aceptar',
    'Add New': 'Añadir',
    'Add {name}': 'Añadir {name}',
    'Add': 'Añadir',
    'All': 'Todo',
    'An err has occurred': 'Se ha producido un error',
    'Are you sure?': '¿Estás seguro?',
    'At what position do you want to place it?': '¿En qué posición quieres situarlo?',
    'Back to homepage': 'Volver al inicio',
    'Block': 'Bloque',
    'Camera': 'Cámara',
    'Cancel': 'Cancelar',
    'Cleanup': 'Limpiar',
    'Clear Signature': 'Limpiar firma',
    'Clear all filters': 'Limpiar filtros',
    'Click on an image to import it.': 'Haga click en una imagen para importarla.',
    'Close': 'Cerrar',
    'Code': 'Código',
    'Collapse All Tabs': 'Plegar todos',
    'Collapse Tab': 'Plegar pestaña',
    'Collapse': 'Contraer',
    'Completed successfully.': 'Completado con éxito.',
    'Completed': 'Completado',
    'Confirm': 'Confirmar',
    'Could not save. Remember that there cannot be two documents with the same name nor can they be exactly the same in the same container %container%': 'No se pudo guardar. Recuerda que no puede haber dos documentos con el mismo nombre ni que sean exactamente iguales en el mismo contenedor %container%',
    'Could not save.': 'No se pudo guardar.',
    'Country': 'País',
    'Created': 'Creado',
    'Delete %documentName%?': '¿Eliminar %documentName%?',
    'Delete': 'Eliminar',
    'Delete? This action cannot be undone.': '¿Eliminar? Esta acción no se puede deshacer.',
    'Description': 'Descripción',
    'Detail': 'Detalle',
    'Displaying %items% items, %hiddenItems% items hidden': 'Mostrando %items% elementos, %hiddenItems% elementos ocultos',
    'Do Sign': 'Firmar',
    'Document Type': 'Tipo de documento',
    'Documents': 'Documentos',
    'Door': 'Puerta',
    'Download': 'Descargar',
    'Drop Your Files Here': 'Suelta aquí los archivos',
    'Edit {name}': 'Editar {name}',
    'Edit': 'Editar',
    'Enter code manually': 'Introducir código manualmente',
    'Error': 'Error',
    'Error.': 'Error.',
    'Expand': 'Expandir',
    'Export': 'Exportar',
    'Fields marked with (*) are required.': 'Los campos marcados con (*) son obligatorios.',
    'File': 'Archivo',
    'Files': 'Archivos',
    'Floor': 'Planta',
    'Hide filters': 'Ocultar filtros',
    'ID': 'ID',
    'IMPORT_HELPER_HTML': 'Selecciona o arrastra un archivo CSV (separado por &quot;<b>;</b>&quot;) o XSLX que contenga las siguientes columnas: %s',
    'IMPORT_LIVE_HELP_HTML': 'Importar de forma síncrona (puede bloquear la web temporalmente). En caso contrario, la tarea de importación podrá tardar hasta %s minuto(s) en comenzar.',
    'Import %s': 'Importar %s',
    'Import Document': 'Importar Documento',
    'Import document %documentName%?': '¿Importar documento %documentName%?',
    'Import started at %s - ': 'Importación iniciada a las %s - ',
    'Import': 'Importar',
    'Indicate the address with street and number': 'Indica la dirección con calle y número',
    'Invalid credentials.': 'Usuario o contraseña incorrectos.',
    'Last import ended successfully at %s.': 'La última importación finalizó con éxito a las %s.',
    'Last import ended with errors at %s.': 'La última importación finalizó con errores a las %s.',
    'Latitude': 'Latitud',
    'Load more...': 'Cargar más...',
    'Loading...': 'Cargando...',
    'Logout': 'Cerrar sesión',
    'Longitude': 'Longitud',
    'Main Information': 'Información general',
    'Mark As Completed': 'Marcar como completado',
    'Move': 'Mover',
    'Municipality': 'Municipio',
    'NOTIFICATION_CONFIGURATION_INTRO': 'Configura las notificaciones que quieres recibir.',
    'Name': 'Nombre',
    'New Document': 'Nuevo documento',
    'Next': 'Siguiente',
    'No items.': 'No hay elementos.',
    'No results.': 'No hay resultados',
    'No': 'No',
    'Notification': 'Notificación',
    'Notifications': 'Notificaciones',
    'Number': 'Número',
    'OK': 'Aceptar',
    'Open All Tabs': 'Desplegar todos',
    'Pending': 'Pendiente',
    'Photos': 'Fotos',
    'Postal Code': 'Código postal',
    'Previous': 'Anterior',
    'Province': 'Provincia',
    'Registration Date': 'Fecha alta',
    'Remarks': 'Observaciones',
    'Remove': 'Quitar',
    'Save': 'Guardar',
    'Saved': 'Guardado',
    'Saving...': 'Guardando...',
    'Scan the QR code with your mobile phone to sign.': 'Escanea el código QR con tu móvil para firmar.',
    'Scan': 'Escanear',
    'Search': 'Buscar',
    'Select a file to continue.': 'Seleccione un archivo para continuar.',
    'Select...': 'Seleccione...',
    'Show filters': 'Mostrar filtros',
    'Sign Inside (HTML)': 'Firma <small class="text-muted"><em>dentro del área marcada</em></small><sup>*</sup>',
    'Sign on mobile': 'Firmar con el móvil',
    'Staircase': 'Escalera',
    'State': 'C. Autónoma',
    'Street And Number': 'Calle y número',
    'Street': 'Calle',
    'Success': 'Éxito',
    'The file is not an image': 'El archivo no es una imagen',
    'The page you are looking for does not exist.': 'Parece que lo que buscas no existe.',
    'There was an error.': 'Se produjo un error.',
    'Type': 'Tipo',
    'Unmark': 'Desmarcar',
    'Upss!': '¡Upss!',
    'User': 'Usuario',
    'Value': 'Valor',
    'Videos': 'Vídeos',
    'Yes': 'Sí',
    'files': 'archivos',
    'photos': 'fotos',
    'videos': 'vídeos',
    '{name} Detail': 'Detalle de {name}',
  },
};

Object.keys(defaultStrings).forEach((lang) => {
  if (undefined === strings[lang]) {
    strings[lang] = defaultStrings[lang];
  } else {
    Object.keys(defaultStrings[lang]).forEach((key) => {
      if (undefined === strings[lang][key]) {
        strings[lang][key] = defaultStrings[lang][key];
      }
    });
  }
});

export const langs = () => {
  return Object.keys(strings).filter(lang => lang !== '**');
};

const defaultLang = langs()[0];

const session = {
  currentLang: defaultLang,
};

const pickBestLang = (available) => {
  const cookie = getCookie('currentLang');
  if (cookie && available.includes(cookie)) return cookie;

  if (typeof navigator !== 'undefined') {
    const navLangs = Array.isArray(navigator.languages) ? navigator.languages : [navigator.language];
    const candidates = [
      ...navLangs,
      defaultLang,
    ]
      .filter(Boolean)
      .flatMap(l => [l, String(l).split('-')[0]])
      .map(l => String(l).toLowerCase());

    const found = candidates.find(l => available.includes(l));
    if (found) return found;
  }

  return defaultLang;
};

export const initializeCurrentLang = () => {
  const available = langs();
  session.currentLang = pickBestLang(available);
  document.documentElement.lang = session.currentLang;
};

export const setStrings = (newStrings) => {
  for (const lang in newStrings) {
    strings[lang] = newStrings[lang];
  }
};

export const replaceParams = (string, replaces) => {
  if (!replaces) {
    return string;
  }

  if (typeof replaces === 'string') {
    replaces = [replaces];
  }

  if (typeof replaces === 'object' && !Array.isArray(replaces)) {
    Object.keys(replaces).forEach(key => {
      string = string.replace('{{' + key + '}}', replaces[key]);
    });
  } else if (Array.isArray(replaces)) {
    if (string.includes('%s')) {
      let splitString = string.split('%s');
      let newString = "";

      splitString.forEach((split, index) => {
        newString += split;

        if (index < splitString.length - 1) {
          newString += (replaces[index % replaces.length] || '');
        }
      });

      string = newString;
    } else {
      replaces.forEach((replace, index) => {
        string = string.replace('$' + (index + 1), replace);
      });
    }
  }

  return string;
};

export const i18n = (string, replaces) => {
  return replaceParams(localedString(string), replaces);
};

export const localedString = (string) => {
  const resultStringWithError = (str) => {
    if (!strings[session.currentLang]?.['**']) {
      console.error(`Missing translation for "${str}" in ${session.currentLang}`);
    }

    return str;
  };

  if (!string) return string;
  if (undefined === strings[session.currentLang]) return resultStringWithError(string);
  if (undefined === strings[session.currentLang][string]) return resultStringWithError(string);

  return strings[session.currentLang][string];
};

export const getCurrentLang = () => {
  return session.currentLang;
};

export const switchLang = (lang, reload = true) => {
  if (langs().indexOf(lang) !== -1) {
    session.currentLang = lang;
    setCookie('currentLang', lang);
    document.documentElement.lang = lang;

    if (reload) {
      window.location.reload();
    }
  }
};

initializeCurrentLang();
