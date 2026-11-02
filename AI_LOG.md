## Entrada #1 
- Fecha: 2026-10-22
- Integrante: Sebastian Galeano 
- Herramienta: Claude 
- Objetivo: Crear una guia para el desarrollo del proyecto
- Prompt: dame una guia definitiva para desarrollar este proyecto dividida minimo en 32 commits, ademas de esto dame una estructura de carpetas con sus archivos js correspondientes, y me vas a decir la carpeta que tipo de archivos van a tener y los archivos que funcion van a tener, todo muy resumido, dame un documento en pdf con todo esto, y solo para el documento los archivos y carpetas van a ser nombrados en ingles/español para yo aprender el ingles tambien, antes del pdf dime que es lo que vas a incluir para ver si podemos hacer algun cambio y luego de darte el visto bueno de la guia lo pasamos a pdf
- Resumen de la respuesta: Contenido propuesto: 
    -Preparacion de entorno
    -Flujo de git (comandos basicos)
    -Estructura de carpetas
    -Guia de 32+ commits agrupados por fases
        Fases
        -Fase 1, base: proyecto Expo, emulador, carpetas, .gitignore, .env.example, README.
        -Fase 2, navegación y sesión: Stack, Tabs, Drawer, contexto de sesión.
        -Fase 3, registro: las 3 pestañas con validaciones, fotos y estado “Pendiente de aprobación”.
        -Fase 4, inicio y ubicación: mapa, interruptor Disponible/No disponible, useDriverLocation.
        -Fase 5, solicitudes y viaje: useTripRequests, temporizador de 15 s, estados del viaje, rutas con Directions.
        -Fase 6, tarifa y pagos: calculateFare, pricing.js, backend, Mercado Pago o Stripe en modo de prueba, efectivo.
        -Fase 7, ganancias e historial: useEarnings, useMemo, FlatList, filtros, detalle con Polyline.
        -Fase 8, extras obligatorios y cierre: notificaciones (FCM), Cloudinary, bitácora de IA, README y video.

## Entrada #2
- Fecha 2026-10-30
- Integrante: Sebastian Galeano
- Herramienta: Claude
- Objetivo: Desarrollar la primera fase del proyecto
- Promt: empecemos con la fase uno desde el cuarto commit
- Resumen de la respuesta: 
  -Commit 4: feat: add pricing config
    Objetivo: que todos los valores de tarifa y comisión vivan en un solo archivo: src/config/pricing.js.
    Antes de escribir nada, piensa en esto
    El documento dice que todos los valores son configurables desde un único archivo y que se manejan en pesos colombianos enteros. Eso significa que ese archivo no tiene lógica: solo guarda datos.
    Mira la tabla de la sección 5 del PDF del proyecto. Tienes que representar estos parámetros:
    Tarifa base
    Valor por km
    Valor por minuto
    Tarifa mínima
    Multiplicador por categoría (Económico, XL, Premium)
    Comisión de la plataforma
  -Commit 5: feat: add calculateFare pure function
    Archivo: src/utils/calculateFare.js
    Objetivo: una sola función pura calculateFare({ distanceKm, durationMin, category, tip }) que devuelve { fare, commission, driverEarnings }.
    Concepto clave: función pura
    Una función pura solo depende de lo que recibe y no cambia nada afuera: no llama a APIs, no usa useState, no lee la base de datos. Con las mismas entradas siempre devuelve lo mismo. Por eso el PDF dice que se usa tanto en la estimación del pasajero como en el cierre del viaje del conductor.
- Se tuvo en cuenta la explicación para el desarrollo de los archivos correspondientes a cada commit, no se solicito codigo
Verificacion: en App.js con un console.log se verifica que calculateFare pida los datos correspondientes y responda con valores con el formate acorde al documento, se intenta sin llamar para verificar que no queda undefined y responda con un Nan afectando la respuesta

## Entrada #3
- Fecha 2026-10-30
- Integrante: Sebastian Galeano
- Herramienta: Claude
- Objetivo: Desarrollar la segunda fase del proyecto
- Promt: vamos con la segunda fase
- Resumen de la respuesta:
    Fase 2: Navegación, sesión e idioma (Expo Go)
    Esta fase cubre los commits 6 al 11. Seguimos trabajando en Expo Go, así que verás los cambios en vivo en tu celular y los errores en la pantalla roja y en la terminal.
    Qué vamos a construir
    #	Commit	Qué lograrás	                Cómo lo verificas
    6	feat:   add Stack navigator	            Stack con pantallas vacías	Navegas entre pantallas
    7	feat:   add Drawer navigator	        Drawer con perfil, historial, ganancias y configuración	Se abre el menú lateral
    8	feat:   add registration Tabs	        Tabs: Datos personales, Vehículo, Documentos	Cambias de pestaña
    9	feat:   add session and trip contexts	SessionContext y TripContext con useContext	Un valor del contexto se ve en dos                                         pantallas
    10	feat: add AsyncStorage helper	        storage.js solo para idioma y último estado	Cierras y abres la app y el idioma persiste
    11	feat: add es/en translations	        es.js, en.js y selector de idioma	Cambian los textos

    Empecemos por el commit 6
    Mira primero la estructura de carpetas del documento. Los archivos que vas a tocar viven en src/navigation/ y src/screens/, y App.js es quien envuelve todo.
    Busca la documentación oficial de React Navigation (sección Getting started y Native Stack Navigator), instala lo necesario e intenta armar el Stack. Cuéntame qué comando usaste, cómo estructuraste RootNavigator.js y qué ves en el celular. Si te atascas o te sale un error rojo, pégamelo y lo analizamos juntos.
    Commit 7: Drawer navigator
    Objetivo del documento: Drawer con perfil, historial, ganancias y configuración. Se verifica cuando se abre el menú lateral.
    Conceptos nuevos
    El Drawer es el menú lateral que se desliza desde el borde izquierdo. Cada opción lleva a una pantalla.
    Es otro paquete de React Navigation: @react-navigation/drawer. Además necesita react-native-gesture-handler y react-native-reanimated. Mira en la documentación oficial (Drawer Navigator) qué más pide para Expo, porque a veces requiere un paso extra de configuración. Instálalo con npx expo install, como hiciste antes.
    Se crea con createDrawerNavigator(), y se usa igual que el Stack: un Drawer.Navigator con varios Drawer.Screen.
-Se tuvo en cuenta la explicacion y se busco en la documentacion oficial la estructura del drawer para implementarlo en el proyecto y se tuvo en cuenta la implementacion de una linea de codigo para evitar doble encabezado
# (<Stack.Navigator screenOptions={{ headerShown: false }}>)}
Verficacion: el emulador navega entre pantallas con stack (HomeScreen, IncomingRequestScreen, TripInProgressScreen, PaymentSummaryScreen) y drawer(RootNavigator, ProfileSettingsScreen, TripHistoryScreen, EarningsScreen) que por el momento estan vacias, solo tienen un titulo que me indica en que pantalla estoy.
-Aprendizaje: estructura de navegacion drawer

## Entrada #4
- Fecha 2026-10-30
- Integrante: Sebastian Galeano
- Herramienta: Claude
- Objetivo: Desarrollar la segunda fase del proyecto
- Promt: vamos con la segunda fase
- Resumen de la respuesta:
  Commit 8: Registration Tabs

Objetivo del documento: Tabs con Datos personales, Vehículo y Documentos. Se verifica cuando cambias de pestaña.

Conceptos nuevos
Las Tabs muestran pestañas que se cambian con un toque. Existen en dos versiones: bottom tabs (abajo) y material top tabs (arriba, deslizables). El documento solo dice “navegación Tab”, sin especificar posición. Revisa la documentación de React Navigation, sección Tab navigation, y elige la que te parezca más adecuada para un formulario de tres pasos. Cada una es un paquete distinto, así que instalas solo el que uses con npx expo install.
El archivo que le corresponde está en src/navigation/, y las tres pantallas ya existen en src/screens/.
Preguntas para que lo armes
¿Cuáles son las tres pantallas y qué nombres de archivo les da el documento? Recuerda que las pestañas del registro son pantallas de src/screens/, no del Stack ni del Drawer.
Ahora tienes tres navegadores: Drawer, Stack y Tabs. ¿Dónde vive el registro dentro de esa jerarquía? Piensa cuándo se usa: antes de que el conductor tenga cuenta aprobada. ¿Pertenece al Drawer, que es el menú de un conductor ya registrado, o es un flujo aparte?
Esa decisión cambia qué se muestra primero al abrir la app. Por ahora no hay sesión (llega en el commit 9), así que ¿cómo podrías acceder temporalmente a las pestañas para verificarlas? Hay más de una forma válida, y te pido que propongas una y me expliques por qué.

La pregunta 2 es la clave: el documento dice que el Drawer es “para perfil, historial, ganancias y configuración”, y las Tabs “para el registro”. Dime cómo lo ubicarías y lo revisamos antes de escribir código.

-se uso para complementar la pantalla el siguinete codigo otorgado por claude:      
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const [activo, inactivo] = ICONOS[route.name];
          return (
            <Ionicons
              name={focused ? activo : inactivo}
              size={size}
              color={color}
            />
          );
        },
      })}

se aprendio como darle dinamismo a los botones tab cuando estan activos e inactivos, se verifica que al estar en la pantalla el icono del tab este oscuro y al salir quede solo la silueta.

