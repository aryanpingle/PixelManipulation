const print = console.log
const lerp = (value, lb, ub, lv, uv) => lv + (value-lb)*(uv-lv)/(ub-lb)
const sum = (iterable, key = e=>e) => iterable.reduce((acc, val) => acc + key(val), 0)
const sort = (iterable, key = e=>e) => iterable.sort((a, b) => key(a) - key(b))
const max = (iterable, key = e=>e) => iterable.reduce((acc, val) => key(val) >= key(acc) ? val : acc, iterable[0])
const min = (iterable, key = e=>e) => iterable.reduce((acc, val) => key(val) <= key(acc) ? val : acc, iterable[0])
const create_html = (html_string) => new DOMParser().parseFromString(html_string, "text/html").body.firstElementChild

let textarea = null
let editor = null

let canvas = new Canvas(document.querySelector("canvas"))
let image = document.querySelector("img#uploaded-image")
let image_name = ""

const HIDDEN_DOWNLOAD_LINK_ELEMENT = document.createElement("A")

const placeholder = `
// arguments is a reserved word, and will always be of the type [color, x, y]
let color = arguments[0] // Array of 4 values - [r, g, b, a]
let r = color[0]
let g = color[1]
let b = color[2]
let a = color[3]
let x = arguments[1] // Goes from left (0) to right (1)
let y = arguments[2] // Goes from top (0) to bottom (1)

const gs = (r+g+b) / 3 // Greyscale value that goes from 0 to 255

// Always return an array of 4 values: [red, green, blue, alpha]
return color
`.trim()

function setup() {
    // Setup the upload button
    let upload_element = document.querySelector(".section-upload .image-container")
    upload_element.onclick = event => {
        document.querySelector("#input-upload-image").click()
    }

    setup_editor()

    document.querySelectorAll(".collapse-box").forEach(ele => {
        ele.onclick = event => {
            if(event.target.matches("header")) {
                ele.classList.toggle("collapsed")
            }
        }
    })

    image.onload = setup_canvas
}

setup()

function setup_editor() {
    textarea = document.querySelector("textarea")
    textarea.value = placeholder
    editor = CodeMirror.fromTextArea(textarea, {
        mode: "javascript",
        theme: "midnight",
        lineNumbers: true,
        lineWrapping: true
    })
}

function setup_canvas() {
    canvas.setSize(image.naturalWidth, image.naturalHeight)
    canvas.CTX.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight)
    canvas.load_pixels()
}

function upload_image(input_element) {
    image_name = input_element.files[0].name.replace(/\..*?$/, "")
    // Generate a url from the image
    let url = URL.createObjectURL(input_element.files[0])
    // Set the img#uploaded-image src to that url
    image.src = url
    // Tell the parent that an image has been uploaded
    input_element.parentElement.classList.add("image-uploaded")
}

function run() {
    setup_canvas()
    let stime = new Date()
    canvas.pixels_map_worker(editor.getValue())
}

function save_image() {
    HIDDEN_DOWNLOAD_LINK_ELEMENT.setAttribute('download', `${image_name} - processed.png`);
    HIDDEN_DOWNLOAD_LINK_ELEMENT.setAttribute('href', canvas.CANVAS.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    HIDDEN_DOWNLOAD_LINK_ELEMENT.click();
}