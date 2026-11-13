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

## Entrada #5
- Fecha: 2026-11-03
- Integrante: Sebastian Galeano
- Herramienta: Claude
- Objetivo: Crear SessionContext y TripContext con useContext (commit 9) y usar la sesión para decidir si se muestra el registro (Tabs) o el Drawer
- Prompt: "vamos con el commit 9"
- Resumen de la respuesta: Explicó las tres piezas de un contexto (crear, proveer, consumir) y guio el paso a paso para el desarrollo de los context y modificaciones para los screens (src/screens/PersonalDataScreen.js, src/screens/HomeScreen.js, src/screens/ProfileSettingsScreen.js)
- Qué se usó / modificó / descartó: Se uso codigo para el app.js
function AppContent() {
  const { approvalStatus } = useContext(SessionContext);

  return (
    <NavigationContainer>
      {approvalStatus === null ? <RegistrationTabs /> : <DrawerNavigator />}
    </NavigationContainer>
  );
}
- Archivos y commit: src/context/SessionContext.js, src/context/TripContext.js, App.js, src/screens/PersonalDataScreen.js, src/screens/HomeScreen.js, src/screens/ProfileSettingsScreen.js — feat: add session and trip context
- Verificación: En Home y en Perfil se ve el mismo estado de aprobación; al tocar "Aprobar" ambas pantallas muestran el cambio
- Aprendizaje: Un componente solo puede usar useContext si el Provider está por encima de él; por eso App.js no lee la sesión directamente. 

## Entrada #6
- Fecha: 2026-11-03
- Integrante: Sebastian Galeano
- Herramienta: Claude
- Objetivo: Crear el helper storage.js con AsyncStorage solo para idioma y último estado de disponibilidad (commit 10)
- Prompt: "guiame con el storage.js"
- Resumen de la respuesta: Guio paso a paso en el desarrollo del storage.js con cuatro funciones (guardar y leer idioma, guardar y leer disponibilidad), claves definidas en un solo lugar, valores por defecto cuando no hay nada guardado y try/catch para los errores. Incluyó una prueba temporal en HomeScreen para comprobar la persistencia.
- Qué se usó / modificó / descartó: Se usó la prueba otorgada para HomeScreen. Los valores por defecto ('es' y no disponible) los propuso Claude porque el documento no los define. El código de prueba de HomeScreen se borró después de verificar.
  const { approvalStatus, setApprovalStatus } = useContext(SessionContext);
  const [language, setLanguage] = useState('');

  useEffect(() => {
    getLanguage().then(setLanguage);
  }, []);

  const cambiarIdioma = async () => {
    const nuevo = language === 'es' ? 'en' : 'es';
    await saveLanguage(nuevo);
    setLanguage(nuevo);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home</Text>
      <Text>Estado: {approvalStatus}</Text>
      <Text>Idioma guardado: {language}</Text>
      <Button title="Cambiar idioma (prueba)" onPress={cambiarIdioma} />
      <Button title="Aprobar" onPress={() => setApprovalStatus('approved')} />
      <Button
        title="Ir a solicitud entrante"
        onPress={() => navigation.navigate('IncomingRequest')}
      />
    </View>
  );
- Archivos y commit: src/services/storage.js,  — "feat: add AsyncStorage helper"
- Verificación: Se cambió el idioma desde el botón de prueba, se cerró Expo Go por completo y al abrirla de nuevo el idioma guardado seguía igual
- Aprendizaje: AsyncStorage es asíncrono y solo guarda texto, por eso se usa async/await y JSON.stringify/JSON.parse para el booleano. 

## Entrada #7
- Fecha: 2026-11-03
- Integrante: Sebastian Galeano
- Herramienta: Claude
- Objetivo: Crear es.js y en.js, agregar el idioma activo a SessionContext y traducir los textos de navegadores y pantallas (commit 11)
- Prompt: "sigamos con el paso a paso del los archivos dentro de la carpeta Locales"
- Resumen de la respuesta: Entregó la guia de desarrollo para es.js y en.js, y amplió SessionContext con language, changeLanguage (actualiza el estado y guarda en AsyncStorage) y t (objeto del idioma activo), cargando el idioma guardado al arrancar con useEffect.
- Qué se usó / modificó / descartó: Se usó para complementar y dar uso de los nuevos archivos
import React, { useContext } from 'react';
import { SessionContext } from '../context/SessionContext';

const { t } = useContext(SessionContext);

options={{ title: t.tabs.personalData }}
options={{ title: t.tabs.vehicle }}
options={{ title: t.tabs.documents }}

- Archivos y commit: src/locales/es.js, src/locales/en.js, src/context/SessionContext.js, src/navigation/RegistrationTabs.js, src/navigation/DrawerNavigator.js, src/screens/HomeScreen.js, src/screens/PersonalDataScreen.js, src/screens/ProfileSettingsScreen.js, src/screens/IncomingRequestScreen.js, src/screens/TripInProgressScreen.js, src/screens/PaymentSummaryScreen.js — feat: add es/en translations
- Verificación: Al tocar English/Español cambian los títulos de las pestañas, las opciones del Drawer y los textos de las pantallas; al cerrar y abrir la app arranca con el último idioma elegido
- Aprendizaje: Los textos se centralizan en un objeto por idioma con las mismas claves, y las pantallas piden la clave en lugar de escribir el texto.

## Entrada #8
Fecha: 2026-11-03
Integrante: Sebastian Galeano
Herramienta: Claude
Objetivo: Crear los componentes reutilizables FormField, DropdownField, DatePickerField e ImagePickerField, con el error debajo del campo y sin Alert (commit 12)
Prompt:"empecemos fase 3, en los componentes reutilizables"
"ayudame a desarrollar los componentes"
Resumen de la respuesta: Claude planteó preguntas de diseño (qué props recibe cada componente, quién guarda el valor, cuándo se muestra el error) y, al pedir ayuda, entregó la guia para hacer los cuatro componentes con el error recibido por props y las librerías a instalar (@react-native-picker/picker, @react-native-community/datetimepicker, expo-image-picker). Indicó montar un FormField temporal en PersonalDataScreen para verificar.
Qué se usó / modificó / descartó: Se usaron los 4 componentes reutilizables entregados por claude.
Archivos y commit: src/components/FormField.js, src/components/DropdownField.js, src/components/DatePickerField.js, src/components/ImagePickerField.js — feat: add reusable form components
Verificación: Se montó un FormField con un error fijo en PersonalDataScreen: el texto rojo apareció bajo el campo y no salió ningún Alert. 
Aprendizaje: Los componentes no validan nada; reciben el valor y el error por props y la pantalla decide cuándo mostrarlo, lo que permite reutilizarlos en las tres pestañas.
## Entrada #9
Fecha: 2026-11-03
Integrante: Sebastian Galeano
Herramienta: Claude
Objetivo: Crear las funciones de validación de cada campo del registro y los mensajes de error en español e inglés (commit 13)
Prompt:"pasemos al commit 13", "ayudame con el codigo", se pega borrador de validators.js
Resumen de la respuesta: Claude explicó las reglas del documento y entregó los complementos para validators.js, junto con el bloque errors para es.js y en.js. 
Qué se usó / modificó / descartó: Se usó complemtentos para validators.js. y los erros de en.js y es.js

if (!/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ ]+$/.test(value)) return 'nameInvalid';
if (!/^\d{6,10}$/.test(value)) return 'idInvalid';
if (!/^\d{10}$/.test(value)) return 'phoneInvalid';
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'emailInvalid';
if (!/^[A-Z]{3}\d{3}$/.test(plate)) return 'plateInvalid';
if (!/^\d{4}$/.test(value)) return 'yearInvalid';
if (!/^\d+$/.test(value)) return 'capacityInvalid';

Archivos y commit: src/utils/validators.js, src/locales/es.js, src/locales/en.js — feat: add validators
Verificación: Pruebas temporales con console.log: placa abc123 válida y 12ABC3 inválida, celular de 10 y de 6 dígitos, fecha de nacimiento de menor de edad. Se comprobó que el mensaje cambia con el idioma.
Aprendizaje: Un validador devuelve una clave y no un texto, así el mismo código sirve en dos idiomas.
## Entrada #10
Fecha: 2026-11-03
Integrante: Sebastian Galeano
Herramienta: Claude
Objetivo: Construir la pestaña 1 (Datos personales) con sus 8 campos validados (commit 14)
Prompt: "Ayudame a desarrollar la pestaña 1 paso a paso, si te pido ayuda en algo me das codigo"
Resumen de la respuesta: Claude presentó los 8 campos con su componente y validador y entregó el paso a paso para desarrollar  PersonalDataScreen con un objeto form, un estado touched para mostrar errores solo en campos tocados y el selector de idioma conectado a SessionContext.
Qué se usó / modificó / descartó: Se utilizo las formas de utilizar los componentes reutilizables

      <FormField
        label={t.personalData.phone}
        value={form.phone}
        onChangeText={(text) => setField('phone', text)}
        onBlur={() => touch('phone')}
        keyboardType="phone-pad"
        maxLength={10}
        error={errorText('phone')}
      />

      <DatePickerField
        label={t.personalData.birthDate}
        value={form.birthDate}
        onChange={(date) => setAndTouch('birthDate', date)}
        placeholder={t.personalData.selectDate}
        error={errorText('birthDate')}
      />

      <DropdownField
        label={t.personalData.gender}
        value={form.gender}
        onValueChange={(value) => setAndTouch('gender', value)}
        options={genderOptions}
        placeholder={t.personalData.select}
        error={errorText('gender')}
      />

      <ImagePickerField
        label={t.personalData.photo}
        value={form.photo}
        onChange={(uri) => setAndTouch('photo', uri)}
        cameraText={t.personalData.camera}
        galleryText={t.personalData.gallery}
        permissionText={t.personalData.permission}
        error={errorText('photo')}
      />

Archivos y commit: src/screens/PersonalDataScreen.js, src/locales/es.js, src/locales/en.js — feat(screen): implement registration form with multilingual support. The screen structure was updated to include the form fields and the corresponding translation keys were added in the language files.
Verificación: Campos vacíos muestran "Este campo es obligatorio" bajo el campo; documento, celular y correo inválidos muestran su error; una fecha de menos de 18 años se rechaza; el cambio de idioma traduce etiquetas y errores; nunca aparece un Alert.
Aprendizaje: Mostrar el error solo cuando el campo fue tocado evita llenar la pantalla de mensajes desde el inicio.
## Entrada #11
Fecha: 2026-11-05
Integrante: Sebastian Galeano
Herramienta: Claude
Objetivo: Construir la pestaña 2 (Vehículo): placa en mayúsculas y XL con mínimo 6 pasajeros (commit 15)
Prompt: "procedamos con el commit 15"
Resumen de la respuesta: Claude explicó las preguntas de diseño (valores de categoría, placa en mayúsculas, dependencia entre categoría y capacidad) y entregó la guia para desarrollar VehicleScreen. Los validadores reciben el formulario completo para que la capacidad lea la categoría y el error se actualice al cambiarla. Agregó el bloque vehicle de textos.
Archivos y commit: src/screens/VehicleScreen.js, src/locales/es.js, src/locales/en.js — feat: vehicle tab and languages for it
Verificación: La placa abc123 se muestra y valida como ABC123; 12ABC3 muestra error; con XL y capacidad 4 aparece el error y desaparece al cambiar a Económico; un año mayor al actual se rechaza. 
Aprendizaje: Un campo puede depender de otro, y por eso el validador necesita todo el formulario y no solo su valor.
## Entrada #12
Fecha: 2026-11-05
Integrante: Sebastian Galeano
Herramienta: Claude
Objetivo: Conectar Firebase y guardar al conductor con estado pendiente de aprobación, con un contexto de registro compartido (commit 18)
Prompt:"podemos añadir un archivo de registration context para que valide los datos de resgistro de las 3 pestañas, en pricipio que solo valide las de vehiculo y datos personales para que no haya problemas a la hora de hacer el registro, esas claves deberian ir en .env para que no queden publicas, la aprovacion se debe hacer manual desde la bd en firestore, el identificador va a ser automatico y el correo sera unique en firestore ara que no se ingrese uno igual, el tipo de dato seria datetime te dare firestore.js y dame una mejor direccion para yo crear el driverservise"[seguido del codigo de firebase.js ya desarrollado]
"ayudame con este error" [seguido del aviso de Metro: el paquete @firebase/firestore tiene un package.json inválido y "Unable to resolve "@firebase/firestore"" desde firebase/firestore/dist/esm/index.esm.js; la ruta con el nombre de usuario se omite]
"con el primer comando aparecen varios archivos entre ellos este que es el que se supone esta buscando: -a---- 5/11/2026 7:56 p. m. 98647 index.rn.js"
"ahora este error: Android Bundling failed 3304ms index.js (1596 modules) Unable to resolve "react-native/asset-registry" from "node_modules@expo\vector-icons\build\vendor\react-native-vector-icons\Fonts\AntDesign.ttf"" 
Resumen de la respuesta: Claude aclaró que Firestore no tiene restricción unique (se comprueba con una consulta antes de guardar), que las fechas se guardan como Timestamp y entregó firebase.js complementado con variables de .env, RegistrationContext, registerDriver (correo normalizado, consulta de duplicados, addDoc, approvalStatus pending) y las pantallas conectadas al contexto. Para los errores de Metro propuso configuraciones de metro.config.js.
Qué se usó / modificó / descartó: Se usó el código de contexto, servicio y pantallas, y la segunda versión de metro.config.js (desactiva la lectura de "exports" solo para los paquetes de Firebase). Se descartó la primera versión de metro.config.js, que desactivaba "exports" para todos los paquetes y rompió react-native/asset-registry, y se descartó la sugerencia inicial de reinstalar node_modules, porque index.rn.js sí existía.
Archivos y commit: src/config/firebase.js, src/context/RegistrationContext.js, src/services/driverService.js, src/screens/PersonalDataScreen.js, src/screens/VehicleScreen.js, App.js, metro.config.js, .env.example, src/locales/es.js, src/locales/en.js — [COMPLETAR hash]
Verificación: El registro aparece en la colección drivers de Firestore con approvalStatus pending. [COMPLETAR si probaste el correo repetido, que debe rechazarse con el error bajo el campo, y los campos vacíos, que no deben crear documento]
Aprendizaje: [REDACTAR con tus palabras] Borrador: un error de empaquetado puede venir de la configuración y no del código; hay que probar la causa antes de aplicar una solución amplia. Además, en este prompt pegué la configuración de Firebase, y la regla del proyecto prohíbe pegar claves; [COMPLETAR qué hiciste después, por ejemplo restringir la clave y no volver a pegarlas].
## Entrada #13
Fecha: 2026-11-05
Integrante: Sebastian Galeano
Herramienta: Claude
Objetivo: Subir las fotos de perfil y de vehículo a Cloudinary, en carpetas separadas por tipo, y guardar sus URL (commit 19)
Prompt:
"ya hice la cuneta de cloudinary y este el el clud name: vew3ubds, me gustaria hacer una division de carpetas para cada tipo de foto, ayudame con un paso a paso"
Resumen de la respuesta: Claude indicó crear un preset sin firma, guardar el nombre en .env y entregó imageService.uploadImage con carpetas uberclone/profile, uberclone/vehicle y uberclone/documents. Después ayudó a resolver tres fallos: el fetch de Expo no aceptaba el archivo en FormData (se cambió a XMLHttpRequest), el preset estaba en modo Signed (se cambió a Unsigned) y las dos fotos se llamaban upload.jpg y Cloudinary devolvía la primera (nombre único por foto y ajuste del preset).
Qué se usó / modificó / descartó: Se usó imageService con XMLHttpRequest, el nombre de archivo único y las variables de .env. Se descartó la primera versión con fetch y FormData, que fallaba en esta versión de Expo.
Archivos y commit: src/services/imageService.js, src/services/driverService.js, .env.example
Verificación: Tras corregir, las URL de perfil y vehículo quedaron distintas en Firestore y cada una muestra su foto. 
Aprendizaje: los mensajes de error reales se ven con un console.log temporal; una subida sin firma nunca sobrescribe, así que los nombres de archivo deben ser únicos.
## Entrada #14
Fecha: 2026-11-06
Integrante: Sebastian Galeano
Herramienta: Claude
Objetivo: Construir la pestaña 3 (Documentos y pagos) con licencia, SOAT, revisión técnico-mecánica condicional, correo de Mercado Pago y términos con la comisión leída de pricing.js (commit 16)
Prompt:
"sobre la revision tecnico mecanica en colombia son 5 años si el vehiculo es nuevo, a partir de la primera renovacion a los 5 años se debe hacer anual, entonces la logica seria que apartir de la fecha del modelo del vehiculo se cuentan 5 años, si esos 5 años dan despues de la fecha actual no es obligatorio la revision, pero si apartir del año del vehiculo hay mas de 5 años hasta la fecha actual si aplica, ademas la fecha de vencimiento no puede ser el mismo dia del registro, y esto aplica para el soat tambien, si la fecha de vencimiento es el dia del registro no se piede registrar. el checkbox se debe instalar e importar y se debe mostrar al momento en que se da en resgitrar y me muestre ese checbox para acptar los terminos y condiciones, y el porcentaje se debe importar de pricing ya que ese valor puede cambiar, dame el paso a paso para desarrollar"
Resumen de la respuesta: Claude buscó la norma colombiana y confirmó los 5 años, aclaró que la norma cuenta desde la matrícula y no desde el año del modelo, y señaló que el documento ubica el checkbox dentro de la pestaña 3. Tras mis decisiones entregó isRtmRequired, la sección documents del contexto, DocumentsScreen con expo-checkbox, los botones "Continuar registro" y la subida de las fotos de documentos en driverService.
Qué se usó / modificó / descartó:  Se modificó imageService para dar un nombre único a cada foto.
Archivos y commit: src/utils/validators.js, src/context/RegistrationContext.js, src/screens/DocumentsScreen.js, src/screens/PersonalDataScreen.js, src/screens/VehicleScreen.js, src/services/driverService.js, src/services/imageService.js, src/locales/es.js, src/locales/en.js 
Verificación: fechas de ayer y de hoy rechazadas en licencia, SOAT y revisión; con año de vehículo 2021 o anterior aparece la revisión y con 2022 o posterior se oculta; al cambiar COMMISSION_RATE cambia el texto de los términos; en Firestore el documento trae la sección documents con las URL.
Aprendizaje:  una regla legal real se simplifica al modelar datos (matrícula frente a año del modelo) y hay que decidir y documentar esa aproximación; el valor de la comisión se lee de un solo archivo para no repetirlo.
## Entrada #15
Fecha: 2026-11-06
Integrante: Sebastian Galeano
Herramienta: Claude
Objetivo: Habilitar el botón de registro solo cuando las tres pestañas estén completas y válidas (commit 17)
Prompt:
"dame el paso a paso para desarrollar el boton de simular registro debe habilitarse solo cuando todo este diligenciado, no es necesario niingun texto que indique cual pestaña falta, y la navegacion debe ser libre, no se necesita terminar una pestaña para habilitar la siguiente" 
Resumen de la respuesta: Claude dio las instrucciones para que el botón de DocumentsScreen se deshabilite según isRegistrationValid(), que revisa las tres secciones del contexto, y dejó la navegación libre entre pestañas sin texto de pendientes.
Qué se usó / modificó / descartó: Se descartó mostrar un texto con la pestaña que falta, por decisión mía.
Archivos y commit: src/screens/DocumentsScreen.js, src/context/RegistrationContext.js
Verificación: El botón permanece deshabilitado mientras falte cualquier campo de las tres pestañas, incluido el checkbox de términos, y se habilita al completar todo.
Aprendizaje: el estado del registro vive en un contexto compartido, así el botón puede revisar las tres pestañas aunque el usuario las visite en cualquier orden.

## Entrada #16

Commit: 22 · feat: add useDriverLocation hook
Fecha: 10 de noviembre de 2026
Herramienta: Claude
Archivo: src/hooks/useDriverLocation.js

Qué le pedí a la IA:
Avanzar con el commit 22 de la guía: un hook personalizado que siga la ubicación del conductor mientras esté activo y que detenga el seguimiento al salir de la pantalla, usando @react-native-community/geolocation.
Qué generó la IA:
Una guia para el desarrollo del hook useDriverLocation(enabled) que:
Pide el permiso ACCESS_FINE_LOCATION en Android.
Escucha la posición con Geolocation.watchPosition (cada 5 s o 10 m, con alta precisión).
Guarda location y error en estados con useState.
Cancela el seguimiento con Geolocation.clearWatch en la función de limpieza del useEffect.
Usa una bandera cancelled para no arrancar el GPS si el usuario sale mientras responde al cuadro de permiso.
Cambios posteriores:
En el commit 23 el hook se ajustó para tomar una posición inicial con getCurrentPosition y activar watchPosition solo si enabled es true, de modo que el mapa se dibuje aunque el conductor esté No disponible.
Cómo lo validé:
La pantalla Inicio pasó del indicador de carga al mapa, lo que confirma que el hook devolvió la ubicación del celular.
## Entrada #17
Commit: 23 · feat: availability switch
Fecha: 10 de noviembre de 2026
Herramienta: Claude (Anthropic)
Archivos: src/screens/HomeScreen.js, src/services/driverService.js, src/hooks/useDriverLocation.js
Qué le pedí a la IA:
Avanzar con el commit 23 de la guía: un interruptor Disponible / No disponible en la pantalla Inicio, bloqueado mientras el conductor no esté Aprobado, que guarde la ubicación en la base de datos mientras esté Disponible.
Qué generó la IA:
En driverService.js: las funciones updateDriverAvailability y updateDriverLocation, que actualizan el documento del conductor en Firestore (available, location y marcas de tiempo).
En HomeScreen.js:
Un Switch deshabilitado mientras approvalStatus no sea 'approved', con el aviso “Pendiente de aprobación”.
Un onSnapshot sobre el documento del conductor, para que el interruptor se habilite en tiempo real cuando se aprueba desde Firestore.
Un useEffect que guarda la ubicación solo mientras el conductor está Disponible.
En useDriverLocation.js: ajuste para que el hook tome una posición inicial con getCurrentPosition y active watchPosition solo si enabled es true.
Cómo lo validé:
Con el conductor en Pendiente de aprobación, el interruptor aparece deshabilitado.
Al cambiar approvalStatus a approved en Firestore, el interruptor se habilitó.

#### Entrada #18
Fecha: 2026-11-11
Integrante: Sebastian Galeano
Herramienta: Claude
Objetivo: Escuchar solicitudes de viaje en tiempo real con onSnapshot, mostrar la tarjeta con temporizador de 15 s y manejar aceptación/rechazo con useCallback (Fase 5 — commits #24 al #26)
Prompt: "vamos con la fase 5 ... como se prueba este commit ... en algun momento las solicitudes son automaticas, o siempre voy a tener que hacerlas manual desde el firestore ... si agregala ... el boton de solicitud de prueba tambien tiene un temporizador?, me refiero a que yo rechazo o acpto pero si ahi mismo le doy en solicitud de prueba, no me deja hasta un momneto despues"
Resumen de la respuesta: Explicó la suscripción en tiempo real a trips con status 'requested' mediante onSnapshot y limpieza en useEffect, la pantalla IncomingRequestScreen con temporizador de 15 s y botones con useCallback, agregó la función temporal createTestTrip para agilizar las pruebas y corrigió el historial de solicitudes vistas para evitar bloqueos al crear pruebas seguidas.
Qué se usó / modificó / descartó: Se usó useTripRequests.js, RequestCard.js, IncomingRequestScreen.js, acceptTrip/rejectTrip y createTestTrip en tripService.js. Se modificó HomeScreen.js para registrar los IDs de solicitudes mostradas y evitar esperar a que Firestore actualice el orden de requests[0]. Se descartó depender únicamente de la creación manual de documentos en consola durante las pruebas.
Archivos y commit: src/hooks/useTripRequests.js, src/components/RequestCard.js, src/screens/IncomingRequestScreen.js, src/services/tripService.js, src/screens/HomeScreen.js — "feat: add useTripRequests hook" / "feat: incoming request screen" / "feat: accept and reject handlers"
Verificación: Al pulsar + Solicitud de prueba con el interruptor en Disponible se abrió la tarjeta con tarifa $19.200 y ganancia $15.360; al dejar vencer los 15 s o pulsar Rechazar cambió a rejected, y al pulsar Aceptar cambió a accepted con driverId.
Aprendizaje: En consultas onSnapshot sin ordenamiento explícito, llevar un registro de los IDs ya mostrados en useRef evita bloqueos visuales mientras Firestore propaga el cambio de estado de un documento.

#### Entrada #19
Fecha: 2026-11-11
Integrante: Sebastian Galeano
Herramienta: Claude
 Objetivo: Implementar la pantalla de viaje en curso con cálculo de rutas hacia recogida y destino, transición de estados y cálculo final de tarifa y comisión (Fase 5 — commits #27 al #29)
Prompt: "sigamos con el 29"
Resumen de la respuesta: Guió el flujo de estados driver_arriving -> in_progress -> completed en TripInProgressScreen.js, migró la obtención de rutas a Google Routes API (computeRoutes con X-Goog-FieldMask y decodificación de polilínea) en mapsService.js y conectó completeTrip junto con calculateFare para guardar fare, commission y driverEarnings en Firestore.
Qué se usó / modificó / descartó: Se usó TripInProgressScreen.js, updateTripStatus/completeTrip en tripService.js y getRoute con Routes API en mapsService.js. Se descartó la API clásica Directions en favor de Routes API v2.
Archivos y commit: src/screens/TripInProgressScreen.js, src/services/mapsService.js, src/services/tripService.js — "feat: route to pickup" / "feat: passenger on board" / "feat: finish trip and calculate fare"
Verificación: Al aceptar un viaje pasó a driver_arriving, al pulsar Pasajero a bordo cambió a in_progress y al pulsar Finalizar viaje guardó status: completed, fare: 19200, commission: 3840 y driverEarnings: 15360 en Firestore.
Aprendizaje: Google Routes API requiere especificar los campos exactos en el encabezado X-Goog-FieldMask y devuelve la polilínea codificada que debe decodificarse a coordenadas para Polyline.

#### Entrada #20
Fecha: 2026-11-12
Integrante: Sebastian Galeano
Herramienta: Claude
Objetivo: Construir el backend en Express con Mercado Pago Checkout Pro en modo prueba, actualizar el estado del pago en tiempo real, gestionar cobros en efectivo y permitir volver al inicio tras cobrar (Fase 6 — commits #30 al #35)
Prompt: ayudame a desarroyar el backend de mercado pago, si necesito codigo te lo pido
Resumen de la respuesta: Implementó el servidor Express con el endpoint de preferencias de Mercado Pago y webhook en backend/routes/payments.js, la pantalla PaymentSummaryScreen con escucha en tiempo real del estado paid, el descuento del 20 % de comisión sobre el saldo en pagos en efectivo y el botón para limpiar activeTrip y volver al inicio.
Qué se usó / modificó / descartó: Se usó backend/server.js, backend/routes/payments.js, backend/.env.example, paymentService.js y PaymentSummaryScreen.js. Se agregó el botón de regreso al inicio tras finalizar el cobro.
Archivos y commit: backend/server.js, backend/routes/payments.js, backend/.env.example, src/services/paymentService.js, src/screens/PaymentSummaryScreen.js — "feat: cash payment and balance" / "feat: return home after payment"
Verificación: Se verificó con git status que backend/.env y backend/serviceAccountKey.json no se subieran al repositorio; se probó el flujo de pago digital y en efectivo actualizando el saldo y regresando a HomeScreen.
Aprendizaje: Las credenciales privadas de pasarelas de pago deben aislarse en el servidor backend, mientras la app escucha los cambios de estado en Firestore mediante onSnapshot.

#### Entrada #21
Fecha: 2026-11-12
Integrante: Sebastian Galeano
Herramienta: Claude
Objetivo: Implementar la pantalla de Ganancias con useMemo, el Historial paginado con filtros, el Detalle del viaje con Polyline y la pantalla de Perfil y Configuración (Fase 7 — commits #36 al #40)
Prompt: "sigamos con la fase 7"
Resumen de la respuesta: Guió el cálculo memoizado de ganancias diarias, semanales y mensuales en useEarnings.js, la consulta paginada de 20 viajes con filtros de fecha y pago en TripHistoryScreen.js, la visualización de la ruta guardada en TripDetailScreen.js y la edición de perfil, cambio de idioma y cierre de sesión en ProfileSettingsScreen.js.
Qué se usó / modificó / descartó: Se usó useEarnings.js, dateFilters.js, TripListItem.js, EmptyState.js, EarningsScreen.js, TripHistoryScreen.js, TripDetailScreen.js y ProfileSettingsScreen.js. Se reutilizó la polilínea almacenada en Firestore para evitar nuevas consultas a Google Routes API en el historial.
Archivos y commit: src/hooks/useEarnings.js, src/utils/dateFilters.js, src/components/TripListItem.js, src/components/EmptyState.js, src/screens/EarningsScreen.js, src/screens/TripHistoryScreen.js, src/screens/TripDetailScreen.js, src/screens/ProfileSettingsScreen.js — "feat: trip detail with route" / "feat: profile and settings screen"
Verificación: Los totales de hoy, semana y mes coincidieron con los viajes completados; los filtros vacíos mostraron EmptyState; cerrar sesión limpió SessionContext y redirigió al inicio.
Aprendizaje: Usar useMemo para agrupar métricas financieras de los viajes evita recalcular sumatorias en cada renderizado de la pantalla.

#### Entrada #22
Fecha: 2026-11-13
Integrante: Sebastian Galeano
Herramienta: Gemini
Objetivo: Implementar notificaciones push en segundo plano con Firebase Cloud Messaging (@react-native-firebase/messaging) y resolver la configuración de paquete en EAS Build (Fase 8 — commit #41)
Prompt: "necesito terminar la fase 8 del documento"
Resumen de la respuesta: Indicó instalar @react-native-firebase/app y @react-native-firebase/messaging, crear src/services/notificationService.js para solicitar permisos POST_NOTIFICATIONS y guardar el fcmToken en Firestore, registrar setBackgroundMessageHandler en index.js y conectar los listeners en SessionContext.js. Además diagnosticó que Gradle falló porque google-services.json pertenecía al paquete com.company.UberClone y el plugin de messaging no debía ir en app.json.
Qué se usó / modificó / descartó: Se usó notificationService.js, el handler de segundo plano en index.js y los useEffect de suscripción en SessionContext.js. Se modificó app.json para igualar package a com.company.UberClone, enlazar googleServicesFile y dejar solo @react-native-firebase/app en plugins.
Archivos y commit: src/services/notificationService.js, index.js, src/context/SessionContext.js, app.json — "feat: push notifications with FCM"
Verificación: El build de desarrollo con EAS compiló correctamente tras alinear el package name; al iniciar sesión se registró fcmToken en Firestore y la notificación de prueba desde Firebase Console llegó con la app en segundo plano.
Aprendizaje: En Expo con React Native Firebase, el package de app.json debe coincidir exactamente con el package_name de google-services.json y setBackgroundMessageHandler debe registrarse en index.js antes de montar la aplicación.

