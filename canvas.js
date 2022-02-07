class Canvas {
    constructor(canvas_element) {
        this.CANVAS = canvas_element
        this.CTX = this.CANVAS.getContext('2d')

        this.CANVAS.width = this.CANVAS.clientWidth
        this.CANVAS.height = this.CANVAS.clientHeight

        // new ResizeObserver(entries => {
        //     entries.forEach(entry => {
        //         let target = entry.target
        //         target.width = target.clientWidth
        //         target.height = target.clientHeight
        //     })
        // }).observe(this.CANVAS)
        
        this.image_data = null
        this.util_x = 0
        this.util_y = 0
        this.util_i = 0

        this.color = [0, 0, 0, 255]
    }

    setSize(width, height) {
        this.CANVAS.width = width
        this.CANVAS.height = height

        this.indices = Array(this.CANVAS.height).fill(0).map((val, row_index) => {
            return Array(this.CANVAS.width).fill(0).map((val, column_index) => column_index + row_index * this.CANVAS.width)
        })
    }

    /**
     * Initializes image_data
     */
    load_pixels() {
        this.image_data = this.CTX.getImageData(0, 0, this.CANVAS.width, this.CANVAS.height)
    }

    get_index(x, y) {
        return this.indices[y][x]
    }

    get_pixel(x, y) {
        return this.image_data.data.slice(this.indices[y][x] * 4, this.indices[y][x] * 4 + 4)
    }

    set_pixel(x, y, rgba=[0, 0, 0, 0]) {
        if(rgba.length < 3) {
            return false
        }
        
        for(this.util_i = 0; this.util_i < 4; ++this.util_i) {
            this.image_data.data[this.indices[y][x] * 4 + this.util_i] = rgba[this.util_i]
        }
    
        return true
    }
    
    pixels_map(callback = (color, x, y) => color) {
        for(this.util_y = 0; this.util_y < this.CANVAS.height; ++this.util_y) {
            for(this.util_x = 0; this.util_x < this.CANVAS.width; ++this.util_x) {
                this.set_pixel(this.util_x, this.util_y, callback(this.get_pixel(this.util_x, this.util_y), this.util_x / this.CANVAS.width, this.util_y / this.CANVAS.height))
            }
        }
    }
    
    pixels_foreach(callback = (color, x, y) => color) {
        for(this.util_y = 0; this.util_y < this.CANVAS.height; ++this.util_y) {
            for(this.util_x = 0; this.util_x < this.CANVAS.width; ++this.util_x) {
                callback(this.get_pixel(this.util_x, this.util_y), this.util_x, this.util_y)
            }
        }
    }
    
    paint() {
        this.CTX.putImageData(this.image_data, 0, 0)
    }

    reset_pixels(rgba = [0, 0, 0, 0]) {
        this.pixels_map(color => rgba)
    }
}