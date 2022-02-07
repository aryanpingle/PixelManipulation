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
let placeholder = `
// arguments is a reserved word, and will always be of the type [color, x, y]
// rgba is an array of 4 values - red, green, blue and alpha
// (x, y) goes from top-left (0, 0) to bottom right (1, 1)
let color = arguments[0]
let x = arguments[1]
let y = arguments[2]

// Always return an array of 4 values: [red, green, blue, alpha]
return [255, 255*x, 255*y, 255]
`.trim()

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
    let f = new Function(editor.getValue())
    canvas.pixels_map((color, x, y) => f.call(null, color, x, y))
    canvas.paint()
    print(`Time taken: ${new Date() - stime}ms`)
}

setup()