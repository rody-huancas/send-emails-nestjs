import * as sanitizeHtml from 'sanitize-html';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { SendEmailDto } from '@common/dtos';
import { createTransporter } from '@config/nodemailer';

@Processor('email-queue')
export class EmailProcessor {
  @Process('send-email')
  async handleSendEmail(job: Job<SendEmailDto>) {
    const { smtpConfig, emailOptions } = job.data;

    // Sanitizar el contenido HTML del correo electrónico
    let sanitizedHtml: string = sanitizeHtml(emailOptions.html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "table", "thead", "tbody", "tfoot", "tr", "td", "th", "header", "footer", "section", "article",
        "div", "span", "img", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "em", "u", "a", "p", "br", "ul", "ol", "li",
        "blockquote", "pre", "code", "hr", "iframe", "video", "audio", "source", "figure", "figcaption", "nav", "main", "aside",
        "address", "details", "summary", "mark", "small", "sub", "sup", "time", "var", "wbr", "b", "i", "q", "s", "del", "ins",
        "caption", "col", "colgroup", "map", "area", "svg", "path", "circle", "rect", "line", "polyline", "polygon", "text"
      ]),
      allowedAttributes: {
        "*"     : ["style", "class", "id", "align"],
        "a"     : ["href", "name", "target", "rel"],
        "img"   : ["src", "alt", "title", "width", "height"],
        "iframe": ["src", "width", "height", "frameborder", "allow", "allowfullscreen"],
        "video" : ["src", "width", "height", "controls", "autoplay", "loop", "muted"],
        "audio" : ["src", "controls", "autoplay", "loop", "muted"],
        "td"    : ["colspan", "rowspan", "width", "height"],
        "th"    : ["colspan", "rowspan", "width", "height"],
        "table" : ["border", "cellpadding", "cellspacing", "width", "height"],
      },
      allowedStyles: {
        "*": {
          // Ser más permisivo con los estilos
          "background"       : [/.*/],  // Permitir cualquier valor de color
          "background-color" : [/.*/],  // Permitir cualquier valor de color
          "color"            : [/.*/],  // Permitir cualquier valor de color
          "font"             : [/.*/],  // Permitir cualquier valor de fuente
          "font-family"      : [/.*/],  // Permitir cualquier valor de familia de fuente
          "font-size"        : [/.*/],  // Permitir cualquier valor de tamaño
          "font-weight"      : [/.*/],  // Permitir cualquier valor de peso
          "padding"          : [/.*/],  // Permitir cualquier valor de padding
          "margin"           : [/.*/],  // Permitir cualquier valor de margin
          "text-align"       : [/.*/],  // Permitir cualquier valor de alineación
          "text-decoration"  : [/.*/],  // Permitir cualquier valor de decoración
          "display"          : [/.*/],  // Permitir cualquier valor de display
          "width"            : [/.*/],  // Permitir cualquier valor de width
          "height"           : [/.*/],  // Permitir cualquier valor de height
          "max-width"        : [/.*/],  // Permitir cualquier valor de max-width
          "max-height"       : [/.*/],  // Permitir cualquier valor de max-height
          "border"           : [/.*/],  // Permitir cualquier valor de border
          "border-radius"    : [/.*/],  // Permitir cualquier valor de border-radius
          "box-shadow"       : [/.*/],  // Permitir cualquier valor de box-shadow
          "line-height"      : [/.*/],  // Permitir cualquier valor de line-height
          "letter-spacing"   : [/.*/],  // Permitir cualquier valor de letter-spacing
          "vertical-align"   : [/.*/],  // Permitir cualquier valor de vertical-align
          "opacity"          : [/.*/],  // Permitir cualquier valor de opacity
          "z-index"          : [/.*/],  // Permitir cualquier valor de z-index
          "float"            : [/.*/],  // Permitir cualquier valor de float
          "clear"            : [/.*/],  // Permitir cualquier valor de clear
          "position"         : [/.*/],  // Permitir cualquier valor de position
          "top"              : [/.*/],  // Permitir cualquier valor de top
          "bottom"           : [/.*/],  // Permitir cualquier valor de bottom
          "left"             : [/.*/],  // Permitir cualquier valor de left
          "right"            : [/.*/],  // Permitir cualquier valor de right
          "overflow"         : [/.*/],  // Permitir cualquier valor de overflow
          "text-overflow"    : [/.*/],  // Permitir cualquier valor de text-overflow
          "white-space"      : [/.*/]  // Permitir cualquier valor de white-space
        }
      },
      allowedClasses: {
        "*": [/.*/]  // Permitir cualquier clase CSS
      },
      allowedIframeHostnames: [],        // No permitir iframes de ningún hostname
      disallowedTagsMode    : "discard"  // Eliminar etiquetas no permitidas
    });

    const transporter = createTransporter(smtpConfig);

    try {
      await transporter.sendMail({ ...emailOptions, html: sanitizedHtml });
    } catch (error) {
      throw new Error(`Error al enviar el correo desde el procesador de email: ${error.message}`);
    }
  }
}
