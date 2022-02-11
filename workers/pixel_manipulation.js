addEventListener("message", message => {
    const [image_data, callback_text, type] = message.data
    const W = image_data.width
    const H = image_data.height
    const F = new Function(callback_text)
    let index = 0

    console.log(`Worker >> 'function over image_data: ${type}'`)
    if(type == "map") {
        for(let y = 0; y < H; ++y) {
            for(let x = 0; x < W; ++x) {
                index = x + W * y
                let converted = F(get_pixel(image_data, index), x / W, y / H)
                for(let i = 0; i < 4; ++i) {
                    image_data.data[index*4 + i] = converted[i]
                }
            }
        }
    }
    else if(type == "foreach") {
        for(let y = 0; y < H; ++y) {
            for(let x = 0; x < W; ++x) {
                index = x + W * y
                let converted = F(get_pixel(image_data, index), x / W, y / H)
                for(let i = 0; i < 4; ++i) {
                    image_data.data[index*4 + i] = converted[i]
                }
            }
        }
    }

    postMessage(image_data)
})

function get_pixel(image_data, index) {
    return [image_data.data[index*4], image_data.data[index*4+1], image_data.data[index*4+2], image_data.data[index*4+3]]
}