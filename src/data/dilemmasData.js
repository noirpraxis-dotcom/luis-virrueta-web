// Dilemas éticos para el Laboratorio Ético
// Cada dilema tiene un ID único, categoría, texto, opciones y análisis profundo

export const DILEMAS = [
  {
    id: '001',
    numero: 7,
    categoria: 'Culpa vs. Lealtad',
    titulo: 'El secreto que protege',
    dilema: 'Descubres que tu pareja cometió una infidelidad hace años, pero afirma que fue un error aislado, que desde entonces cambió, y que contártelo solo destruiría algo que hoy sí cuida.\n\nUn terapeuta te asegura que jamás te enterarás si no investigas.\n\n¿Qué haces?',
    opciones: [
      {
        id: 'A',
        texto: 'Prefiero no saber y conservar la relación tal como está',
        descripcion: 'Privilegias la conservación del lazo sobre la "verdad completa"'
      },
      {
        id: 'B',
        texto: 'Necesito saber, aunque eso destruya todo lo que tenemos',
        descripcion: 'La verdad es condición necesaria del vínculo'
      },
      {
        id: 'C',
        texto: 'No quiero saber ahora, pero dejo la puerta abierta a descubrirlo algún día',
        descripcion: 'Postergas la decisión pero mantienes el derecho a saber'
      }
    ],
    perfilPsicologico: {
      A: {
        titulo: 'Protector del vínculo',
        descripcion: 'Tu respuesta se parece a quienes privilegian la conservación del lazo sobre la "verdad completa"; aceptan cierta dosis de ilusión como condición del amor; toleran mejor la ambigüedad que la ruptura violenta.',
        reflexion: 'Esto no es bueno ni malo: es una forma de proteger algo que sientes valioso. La pregunta es: ¿cuánto de ti estás dejando fuera para que el vínculo siga respirando?'
      },
      B: {
        titulo: 'Guardián de la verdad',
        descripcion: 'Tu respuesta se alinea con quienes no pueden sostener un vínculo sin transparencia radical; priorizan la autenticidad sobre la estabilidad; prefieren el dolor claro al malestar difuso.',
        reflexion: 'Esto no es bueno ni malo: es una forma de proteger tu integridad. La pregunta es: ¿estás dispuesto a perder lo que tienes por una verdad que ya no cambiará el pasado?'
      },
      C: {
        titulo: 'Navegante de la ambigüedad',
        descripcion: 'Tu respuesta sugiere que puedes habitar la incertidumbre sin resolverla de inmediato; mantienes opciones abiertas; toleras la tensión sin forzar un cierre prematuro.',
        reflexion: 'Esto no es bueno ni malo: es una forma de darte tiempo. La pregunta es: ¿esta suspensión te da paz o solo posterga un conflicto inevitable?'
      }
    },
    analisisProfundo: {
      loQueSeJuega: `**Lo que se juega en realidad**

Este dilema no trata sobre infidelidad. Trata sobre **qué lugar le das a la verdad en el amor**.

Desde el psicoanálisis, el amor nunca es simétrico ni transparente. Siempre hay opacidad, zonas grises, cosas que no se dicen. La fantasía de "conocer todo del otro" es imposible: el otro es siempre un enigma, incluso para sí mismo.

Pero la pregunta real es: **¿puedes amar a alguien sabiendo que hay algo que no sabes?**

Si eliges no saber (opción A), estás aceptando que el amor puede sostenerse sobre cierta dosis de ilusión necesaria. No es autoengaño consciente: es renuncia voluntaria a una verdad que ya no cambia el pasado pero sí puede destruir el presente.

Si eliges saber (opción B), estás diciendo que la transparencia es condición sine qua non del amor. Pero cuidado: también estás asumiendo que tu necesidad de certeza vale más que la relación misma. ¿Es eso amor o es necesidad de control disfrazada de principio ético?

Si eliges postergar (opción C), estás en un limbo: ni asumes la ignorancia ni exiges la verdad. Habitas la tensión. Eso puede ser sabiduría o cobardía, dependiendo de si esa suspensión te da paz o solo posterga un estallido inevitable.`,

      porQueNingunaRespuesta: `**Por qué ninguna respuesta te deja "limpio"**

Todas las opciones tienen un costo psíquico y ético:

**Opción A (no saber)**: Te salvas del dolor inmediato, pero sacrificas autenticidad. ¿Puedes vivir tranquilo sabiendo que hay algo que no sabes? ¿O esa sospecha se convertirá en malestar difuso, desconfianza sutil, síntoma?

**Opción B (saber)**: Obtienes la verdad, pero destruyes lo que hoy funciona. Además, ¿realmente querías saber o querías castigar? ¿La verdad te libera o solo te da munición para el resentimiento eterno?

**Opción C (postergar)**: Evitas el conflicto ahora, pero vives en incertidumbre. ¿Eso es paciencia o es evasión? ¿Estás dándote tiempo para procesar o simplemente pateas el problema para después?

El dilema es estructural: **no hay posición que no renuncie a algo.**

Si priorizas el vínculo, renuncias a la verdad.
Si priorizas la verdad, renuncias al vínculo (al menos tal como es ahora).
Si suspendes la decisión, renuncias a la paz de tener una posición clara.

Esto no es un problema: es la condición del amor adulto. Amar es elegir qué tipo de renuncia estás dispuesto a sostener.`,

      preguntasParaSeguirPensando: [
        '¿Qué parte de tu deseo sacrificarías por conservar tu imagen de "buen amante"?',
        '¿Prefieres la paz o la verdad? ¿Por qué no puedes tener ambas?',
        '¿Qué tipo de ignorancia estás dispuesto a sostener en nombre del amor?',
        '¿Tu necesidad de saber es genuina o es forma disfrazada de control?',
        '¿Puedes perdonar algo que aún no sabes si ocurrió?'
      ]
    }
  },
  {
    id: '002',
    numero: 8,
    categoria: 'Libertad vs. Responsabilidad',
    titulo: 'El hijo que no elegiste',
    dilema: 'Tienes un hijo de 15 años. Cuando nació, no estabas seguro de querer ser padre, pero asumiste la responsabilidad. Hoy, tu hijo te dice que siente que nunca lo quisiste realmente, que solo cumpliste un rol.\n\n¿Le dices la verdad —que al principio no lo deseabas pero aprendiste a amarlo— o proteges su imagen de ti como padre que siempre lo quiso?',
    opciones: [
      {
        id: 'A',
        texto: 'Le digo la verdad: al principio no estaba seguro, pero hoy lo amo profundamente',
        descripcion: 'Priorizas la honestidad radical sobre la ilusión protectora'
      },
      {
        id: 'B',
        texto: 'Le miento: le digo que siempre lo quise desde el primer momento',
        descripcion: 'Proteges su imagen de origen y evitas un dolor innecesario'
      },
      {
        id: 'C',
        texto: 'Le digo que el amor no siempre es instantáneo, sin entrar en detalles',
        descripcion: 'Ofreces una verdad parcial que lo prepara sin herirlo directamente'
      }
    ],
    perfilPsicologico: {
      A: {
        titulo: 'El honesto radical',
        descripcion: 'Crees que la verdad es siempre liberadora, incluso cuando duele. Prefieres autenticidad a protección.',
        reflexion: '¿Estás seguro de que tu hijo necesita cargar con tu ambivalencia inicial, o solo tú necesitas confesar para sentirte mejor?'
      },
      B: {
        titulo: 'El protector',
        descripcion: 'Priorizas el bienestar emocional del otro sobre tu necesidad de autenticidad. Asumes el peso de la mentira piadosa.',
        reflexion: '¿Estás protegiéndolo a él o protegiéndote a ti de enfrentar su decepción?'
      },
      C: {
        titulo: 'El diplomático',
        descripcion: 'Buscas un punto medio: verdad sin crueldad. Ofreces contexto sin detalles hirientes.',
        reflexion: '¿Es sabiduría o es evasión disfrazada de prudencia?'
      }
    },
    analisisProfundo: {
      loQueSeJuega: `**Lo que se juega en realidad**

Este dilema no es sobre mentir o no. Es sobre **quién tiene derecho al malestar del otro**.

El hijo ya siente que no fue deseado plenamente. Esa intuición está ahí, operando. La pregunta es: ¿confirmas esa intuición con palabras o la niegas para proteger una fantasía?

Desde el psicoanálisis, ningún hijo es "completamente deseado". Siempre hay ambivalencia. Los padres también son sujetos con deseos contradictorios. Nacer es, en parte, interrumpir el deseo de los padres tal como era antes.

Pero socialmente, se espera que los padres digan "te quise desde siempre". Esa narrativa tranquiliza, borra la ambivalencia estructural, sostiene la ilusión de origen perfecto.

El problema es que el hijo ya sabe que eso no es del todo cierto. Entonces, ¿qué haces?

Si le dices la verdad (opción A), le das autenticidad. Pero también le das una carga: ahora sabe que su existencia fue, en algún momento, una obligación antes de ser deseo. ¿Necesitaba saber eso? ¿O solo tú necesitabas confesarlo para sentirte auténtico?

Si le mientes (opción B), proteges su imagen de origen. Pero también lo infantilizas: decides que no puede manejar la verdad. ¿Es amor o es control disfrazado de protección?

Si le das una verdad parcial (opción C), intentas navegar el medio. Pero el riesgo es que quede en un limbo: sabe que algo no cuadra, pero no tiene claridad. Eso puede ser peor que saber o no saber.`,

      porQueNingunaRespuesta: `**Por qué ninguna opción te deja limpio**

**Opción A (verdad radical)**: Obtienes autenticidad, pero cargas al hijo con tu ambivalencia inicial. ¿Es eso justo? ¿Tu necesidad de honestidad vale más que su paz?

**Opción B (mentira piadosa)**: Proteges al hijo, pero vives con la mentira. Además, si algún día lo descubre (y siempre hay riesgo), la traición será doble: no solo no lo quisiste al principio, sino que le mentiste sobre ello.

**Opción C (verdad diplomática)**: Intentas el balance, pero el riesgo es la ambigüedad perpetua. Puede que él intuya que hay más, y eso lo deje en incertidumbre crónica.

El dilema es estructural: **no puedes protegerlo y ser completamente honesto al mismo tiempo.**

Amar es elegir qué tipo de renuncia estás dispuesto a sostener: renuncias a la autenticidad total o renuncias a la protección total. No hay tercera vía sin costos.`,

      preguntasParaSeguirPensando: [
        '¿Tu necesidad de confesar es por su bien o por el tuyo?',
        '¿Puede existir amor genuino que no haya sido inmediato?',
        '¿Qué derecho tienes a decidir qué verdades puede manejar el otro?',
        '¿Cómo procesarías tú saber que tus padres dudaron de ti al principio?',
        '¿La honestidad radical es siempre ética o a veces es crueldad disfrazada?'
      ]
    }
  },
  {
    id: '003',
    numero: 9,
    categoria: 'Justicia vs. Compasión',
    titulo: 'El criminal redimido',
    dilema: 'Un amigo cercano te confiesa que hace 20 años cometió un crimen grave (no asesinato, pero sí daño serio a otra persona). Nunca lo atraparon. Desde entonces, cambió radicalmente: es voluntario, ayuda a su comunidad, vive en paz.\n\nTe pide que guardes el secreto. Si lo denuncias, irá a prisión y su vida actual (y la de su familia) se destruirá.\n\n¿Qué haces?',
    opciones: [
      {
        id: 'A',
        texto: 'Guardo el secreto: el tiempo y su cambio son suficiente castigo',
        descripcion: 'Priorizas la redención personal sobre la justicia institucional'
      },
      {
        id: 'B',
        texto: 'Lo denuncio: la justicia debe aplicarse sin importar el tiempo transcurrido',
        descripcion: 'La ley está por encima de la circunstancia personal'
      },
      {
        id: 'C',
        texto: 'Le sugiero que se entregue voluntariamente, pero no lo denuncio yo',
        descripcion: 'Respetas su autonomía pero no asumes la carga de decidir'
      }
    ],
    perfilPsicologico: {
      A: {
        titulo: 'Creyente en la redención',
        descripcion: 'Crees que las personas pueden cambiar genuinamente y que el castigo no siempre es necesario si hay transformación real.',
        reflexion: '¿Y si la víctima nunca tuvo paz? ¿Tu compasión hacia él es injusticia hacia quien sufrió?'
      },
      B: {
        titulo: 'Guardián de la justicia',
        descripcion: 'La ley existe para todos por igual. El cambio personal no borra la deuda con la sociedad.',
        reflexion: '¿Estás seguro de que la prisión hará justicia o solo destruirás dos vidas más (la suya y la de su familia)?'
      },
      C: {
        titulo: 'Facilitador neutral',
        descripcion: 'No quieres ser juez. Devuelves la responsabilidad a quien la tiene: el que cometió el acto.',
        reflexion: '¿Es neutralidad o es cobardía? ¿Evitas decidir para no cargar con la culpa?'
      }
    },
    analisisProfundo: {
      loQueSeJuega: `**Lo que se juega en realidad**

Este dilema enfrenta dos concepciones de justicia:

**Justicia retributiva**: El que hizo daño debe pagar, sin importar el tiempo o el cambio. La deuda con la sociedad no prescribe moralmente.

**Justicia restaurativa**: El objetivo es reparar, no castigar. Si alguien cambió genuinamente y ya no es peligroso, ¿qué sentido tiene destruir su vida presente?

Kant diría: el deber moral es universal. Si la ley existe, debe aplicarse. Tu compasión personal no puede estar por encima del imperativo categórico.

El utilitarismo diría: ¿qué genera más bienestar? Si denunciarlo destruye varias vidas sin beneficio real, quizá guardarlo es la opción más ética.

La ética del cuidado diría: la relación importa. No eres un agente impersonal de la justicia; eres un amigo con responsabilidad hacia una persona concreta.

¿Cuál de estas éticas adoptas? Ninguna es "correcta": son marcos distintos, todos defendibles, todos con costos.`,

      porQueNingunaRespuesta: `**Por qué ninguna opción te deja limpio**

**Opción A (guardar el secreto)**: Proteges a tu amigo, pero traicionas a la víctima que nunca tuvo justicia. Además, cargas con el secreto: eres ahora cómplice moral.

**Opción B (denunciar)**: Cumples con la ley, pero destruyes a alguien que cambió. Además, ¿quién eres tú para decidir que 20 años de redención no valen nada?

**Opción C (sugerir entrega voluntaria)**: Parece sensato, pero evades decidir. Le devuelves la carga a él, pero no asumes tu propia responsabilidad moral. ¿Es eso ético o es solo proteger tu conciencia?

No hay salida limpia. **Cada opción tiene una traición implícita**:

- Traicionas a la víctima, o
- Traicionas a tu amigo, o
- Te traicionas a ti mismo evitando decidir.

El dilema es elegir qué traición estás dispuesto a cargar.`,

      preguntasParaSeguirPensando: [
        '¿La justicia es absoluta o debe considerar el contexto y el cambio personal?',
        '¿Quién tiene más derecho a paz: la víctima del pasado o el redimido del presente?',
        '¿Tu lealtad a un amigo puede estar por encima de un principio ético universal?',
        '¿Qué pasaría si tú fueras la víctima? ¿Querrías que alguien guardara ese secreto?',
        '¿Guardar el secreto te convierte en cómplice o en testigo compasivo de una redención genuina?'
      ]
    }
  }
]

// Función helper para obtener el dilema actual basado en la fecha
export const getDilemaActual = () => {
  // Por ahora, retornamos el primer dilema
  // Puedes implementar lógica de rotación semanal aquí
  const weekNumber = Math.floor((Date.now() / 1000 / 60 / 60 / 24 / 7)) % DILEMAS.length
  return DILEMAS[weekNumber]
}

// Función para obtener todos los dilemas
export const getAllDilemas = () => DILEMAS
