# Refoxo Xestión — plantilla de demostración

> **Sitio de demostración.** Refoxo Xestión es un negocio ficticio; los
> datos, fotografías y opiniones de este repositorio son de muestra y no
> corresponden a ninguna asesoría real. Forma parte de la biblioteca de
> plantillas **WEBS NEGOCIOS**, pensada para reskinearse a clientes reales
> de un sector parecido (asesoría fiscal, laboral, contable o de gestión).

## El concepto: «Cinta sumadora»

La imagen de partida es la calculadora mecánica de despacho: el rollo de
papel que va sumando línea a línea hasta cuadrar la cuenta. De ahí sale todo
el lenguaje visual de la web:

- Un **rollo de papel fijo** en el margen izquierdo hace de barra de
  progreso: se rellena a medida que avanzas y va «imprimiendo» el nombre
  de la sección en la que estás.
- Cada cifra importante (la valoración, los días hasta el próximo trámite,
  el recuento de servicios) se **imprime cifra a cifra**, como el golpe de
  una sumadora, en vez de aparecer de golpe.
- El equipo, las reseñas y los motivos para elegir el despacho se presentan
  como **tickets impresos**, con el borde dentado típico de un recibo y un
  total subrayado con doble raya.
- La cortina de entrada simula la propia sumadora tecleando cifras al azar
  antes de «imprimir» el nombre del despacho y retirarse de un tirón hacia
  arriba, como si arrancaran el recibo.

Es un registro cálido y de despacho de toda la vida, deliberadamente alejado
de lo corporativo: nada de gráficos financieros ni de iconografía bancaria.

## Mapa de secciones

La estructura (8 secciones, distinta en orden y forma de las otras
plantillas de asesoría de la misma tanda) es:

1. **Portada** — el rollo de papel + wordmark, con un ticket resumen del hero.
2. **Marquee de áreas de servicio** (franja continua).
3. **Servicios** — seis líneas de cinta que se van sumando, con contador
   lateral («03 de 06») que se imprime al entrar en pantalla.
4. **Confianza / por qué elegirnos** — ticket con un total simbólico
   («CONFIANZA», no una cifra de facturación) y la propuesta de valor.
5. **Equipo** — dos fichas impresas como tickets, con nombre, cargo y bio
   completos.
6. **Calendario fiscal** — líneas de cinta con el calendario general de
   modelos (IVA, retenciones, Sociedades, Renta…), calculado con la fecha
   real del sistema: la fila del próximo trámite queda resaltada y los días
   restantes se imprimen dígito a dígito.
7. **Reseñas** — tres testimonios con nombre de pila (nunca atribuidos a
   Google ni a ninguna plataforma) y una valoración media subrayada con
   doble raya, como un total.
8. **Contacto + pie** — ficha del despacho, formulario de muestra, mapa
   bajo clic, WhatsApp flotante y el sello de demostración.

## Movimiento

- **Lenis** como único motor de scroll.
- **Char-reveal** de titulares con un rebote «back.out», el golpe
  tipográfico del concepto.
- **Marquee** de la franja de áreas, con la velocidad ligada a la del scroll.
- **Botones magnéticos** en el CTA principal y en el WhatsApp flotante.
- **Contadores que se imprimen cifra a cifra** (valoración de reseñas, días
  hasta el próximo trámite fiscal), con `ease: steps(n)` para que se note
  el golpe, no un conteo suave.
- Además, como recurso propio del concepto (no cuenta para el mínimo, pero
  suma): el **rollo-barra de progreso** fijo, que también es contenido (el
  nombre de sección) y por eso se monta con `IntersectionObserver` fuera de
  la rama de movimiento — funciona igual con `prefers-reduced-motion`.
- **Cortina de entrada** obligatoria: la sumadora teclea cifras al azar,
  imprime «1.247,50» a modo de flourish y se retira de un tirón
  (`yPercent:-100`, `expo.inOut`) como si arrancaran el recibo. Retirada
  garantizada: bajo `prefers-reduced-motion` o sin GSAP, `display:none` por
  CSS (`html:not(.has-motion) .cortina`); además hay un `setTimeout` de
  seguridad de 4,5 s por si un tween se queda colgado.

## Qué es contenido (no se apaga con reduced-motion)

- El **calendario fiscal** calcula el trámite «próximo» y los días
  restantes con la fecha real del sistema (`new Date()`), en una función
  que corre siempre, tenga o no movimiento la página.
- Sin GSAP ni con movimiento reducido, la **valoración de reseñas** y el
  contador de servicios se fijan directamente en su valor final —no se
  quedan en 0 ni a medio imprimir—.

## Accesibilidad y contraste

Ningún texto secundario se apaga con `opacity`. Los tokens de texto se
calcularon con un script de contraste WCAG (`node` + fórmula de luminancia
relativa) antes de escribir el CSS, no después de auditar:

| Token | Uso | Contraste |
|---|---|---|
| `--prusia` sobre `--crema` | texto principal | 9.67:1 |
| `--apagado` (#485E67) sobre `--crema` / `--crema-panel` | texto secundario | 5.52:1 / 4.99:1 |
| `--apagado-claro` (#989D97) sobre `--prusia-hondo` | texto secundario en fondo oscuro | 4.99:1 |
| `--bronce-texto` (#795A1A) sobre `--crema` / `--crema-panel` | cifras «bronce» como texto | 5.15:1 / 4.66:1 |
| texto `--prusia` sobre `--bronce-boton` (#CC9C39) | botones CTA | 4.78:1 |
| `--crema` sobre `--prusia-hondo` | texto sobre fondo oscuro (franja, pie) | 11.12:1 |

El **bronce de marca puro** (`#C9962C`, 2.15:1 sobre crema) se quedó
exactamente donde manda el pliego: rellenos, bordes, subrayados dobles e
iconos — nunca como color de texto. Cuando hacía falta una cifra o etiqueta
«bronce» legible, se usó `--bronce-texto`, una versión oscurecida (mezclada
con negro, no con el prusia de fondo, para no virar a un verde oliva sucio).

Además: foco visible en todos los interactivos, landmarks (`header`,
`main`, `footer`, `nav`), `alt` vacío en las imágenes decorativas (el
logotipo se repite como texto al lado), navegación completa por teclado y
menú móvil con `aria-expanded`.

## Qué tocar para reskinear a un cliente real

1. **`index.html`** — cambiar el nombre, dirección, teléfonos, horario,
   CIF y el bloque `schema.org` del `<head>` (y quitar el
   `<meta name="robots" content="noindex, nofollow">` cuando el sitio deje
   de ser una demo).
2. **`assets/logo.svg` y `assets/favicon.svg`** — el logotipo actual es una
   cola de raposo que se riza como un rollo de papel, un juego de palabras
   con «Refoxo». Para otro cliente hay que rehacer la marca desde cero.
3. **`css/estilo.css`, bloque `:root`** — los cinco colores de la paleta más
   los tokens de texto ya calculados; si cambia la paleta, **hay que
   recalcular el contraste de los tokens de texto**, no solo cambiar los
   valores de marca.
4. **Las seis líneas de `#cintaLista`** (sección Servicios) — sustituir por
   los servicios reales del despacho, manteniendo la numeración 01-06 o
   ajustando el contador del panel lateral si cambia el número de líneas.
5. **`#calendarioTabla`** — el calendario fiscal es genérico (AEAT, no de
   una empresa concreta): revisar que los modelos y fechas sigan vigentes
   antes de reutilizarlo, y añadir/quitar filas según el régimen fiscal del
   cliente (trimestral, mensual grandes empresas, etc.).
6. **Equipo, reseñas y `og-fuente.html`** — sustituir por personas, citas e
   imagen social reales; regenerar `assets/og.png` haciendo una captura de
   `og-fuente.html` a 1200×630.
7. **`js/main.js`** — los selectores están en castellano y agrupados por
   función (menú, cookies, mapa, calendario, cortina, rollo, contadores);
   no hace falta tocar nada si solo cambia el contenido.

## Sin generador de imágenes

Toda la obra gráfica es SVG dibujado a mano en el propio repositorio: el
logotipo, el favicon, el rollo de papel del hero y de la cabecera fija, los
iconos de los seis servicios y la imagen social (`og-fuente.html`,
capturada a `assets/og.png`). No se ha usado ninguna fotografía: el sector
—una asesoría de despacho, sin producto físico que enseñar— se resuelve
bien solo con ilustración, y además evita cualquier problema de personas de
archivo. Por eso no hay `CREDITOS.md`: no hay ninguna foto que acreditar.

## Verificación (pliego §7)

Ver el informe de verificación entregado junto con esta plantilla y las
capturas en `screenshots/`: página abierta con Playwright a 1440×900 y
390×844, recorrido con `mouse.wheel` (no `scrollTo`, por Lenis), pasada con
el CDN de GSAP bloqueado, pasada con `prefers-reduced-motion: reduce`,
consola sin errores ni 404, y comprobación manual de los botones de
cookies, menú móvil y mapa.

## Estado de publicación

Repositorio local únicamente. **No se ha creado repositorio remoto ni se ha
publicado en GitHub Pages** — queda pendiente de aprobación explícita del
usuario, conforme al encargo.
