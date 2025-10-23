# Generador de Relatos Infantiles

Nuestro planteamiento inicial fue crear un **frontend sencillo**, con una caja de texto y un botón que permitiera generar relatos a partir de un *prompt* introducido por el usuario.

La idea consiste en **enviar el prompt a la API de Gemini**, para que esta genere un relato infantil.  
Una vez obtenido el relato, lo **enviamos nuevamente a la API** junto con un *pre-prompt* diseñado específicamente para **validar que el texto sea apto para niños**.

Cuando el relato haya sido validado, el siguiente paso será **enviarlo a una API de generación de imágenes**, con el fin de **crear la portada del cuento**.


Jesús Andrade Pérez
Carlos García Martín
Pablo González González
Juan Antonio García Narváez
Salvador Chamizo Viruelt