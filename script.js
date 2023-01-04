new FontFace("BodyFont", "url(Fonts/Font_soulsV2_Body-Regular.ttf)").load()
new FontFace("TitleFont", "url(Fonts/Font_soulsV2_Title-Regular.ttf)").load()
new FontFace("EndFont", "url(Fonts/TheEnd_v2.ttf)").load()

const paths = {
    characters: "1. Character/",
    items: "2. Starting Items/",
    treasure: "3. Treasure/",
    loot: "4. Loot-Trinket-Soul-Other/",
    monster: "5. Monster/",
    assets: "11. Presized Assets/",
}

const backgrounds = {
    "character": paths.characters + "Blank_Character.png",
    "eternal-active": paths.items + "Border_Eternal_Active.png",
    "eternal-passive": paths.items + "Border_Eternal_Passive.png",
    "item-active": paths.treasure + "Border_Treasure_Active.png",
    "item-passive": paths.treasure + "Border_Treasure_Passive.png",
    "loot": paths.loot + "Blank_Loot.png",
    "loot-trinket": paths.loot + "Blank_Loot.png",
    "monster": paths.monster + "Blank_Monster.png",
}

const assets = {
    "[tap]": "Assets/Tag_Tap.png",
    "[stap]": "Assets/Tag_StevenTap.png",
    "[paid]": "Assets/Tag_Paid.png",
    "[lvl]": "Assets/Tag_Level.png"
}

const floors = {
    basement: "Req_Monster_Basement.png",
    cathedral: "Req_Monster_Cathedral.png",
    caves: "Req_Monster_Caves.png",
    home: "Req_Monster_Charmed.png",
    corpse: "Req_Monster_Corpse.png",
    cursed: "Req_Monster_Cursed.png",
    depths: "Req_Monster_Depths.png",
    downpour: "Req_Monster_Downpour.png",
    dross: "Req_Monster_Dross.png",
    hell: "Req_Monster_Hell.png",
    holy: "Req_Monster_Holy.png",
    mausoleum: "Req_Monster_Mausoleum.png",
    mines: "Req_Monster_Mines.png",
    womb: "Req_Monster_Womb.png",
}

const body = document.body
const card = document.querySelector(".card")
const fCtx = card.getContext("2d")

function pathToImage(path = "") {
    const img = new Image()
    img.src = path
    img.style.display = "none"
    body.append(img)
    return new Promise((resolve) => {
        img.onload = () => {
            resolve(img)
            setTimeout(() => {
                img.remove()
            }, 0)
        }
    })
}

function promptUpload(accept = "*") {
    const input = document.createElement('input')
    input.style.display = 'none'
	input.type = "file"
    input.accept = accept
	document.body.append(input)
	input.click()
    setTimeout(() => {
        input.parentNode.removeChild(input)
    }, 0)
	return new Promise((resolve, reject) => {
		if (!FileReader) {
			reject("Your browser doesn't have File Reader support!")
		}
		input.onchange = () => {
			const files = input.files
			if (files && files.length) {
				resolve(files[0])
			} else {
				reject("No file!")
			}
		}
	})
}

function wrapText(str = "", max = 10) { // This function was hell to get working (and it still doesn't lol)
    let ret = ""
    for (let line of str.split("\n")) {
        let cur = ""
        const list = line.split(" ")
        for (let i = 0; i < list.length; i++) {
            const word = list[i]
            if (word.length >= max) {
                for (let j = 0; j < word.length; j++) {
                    if ((j + 1) % max == 0) {
                        ret += cur + "\n"
                        cur = ""
                    }
                    cur += word[j]
                }
                cur += " "
                continue
            }
            if (Math.floor((cur.length + word.length) / max) > 0) {
                let toAdd = ""
                for (let j = i; j < list.length; j++) {
                    toAdd += list[j] + " "
                }
                cur += "\n" + wrapText(toAdd, max)
                break
            }
            cur += word + " "
        }
        ret += cur + "\n"
    }
    while (ret[ret.length - 1] == "\n" || ret[ret.length - 1] == " ") {
        ret = ret.slice(0, -1)
    }
    return ret
}

let imageUrl

async function updateCard() {
    fCtx.fillStyle = "white"
    fCtx.fillRect(0, 0, 2000, 2000)
    fCtx.fillStyle = "black"
    const selected = $("#type").find(":selected").val()
    const image = backgrounds[selected] || backgrounds["character"]
    if (selected === "eternal-active" || selected === "eternal-passive" || selected === "item-active" || selected === "item-passive") {
        if ($("#requiem").prop("checked")) {
            const img = await pathToImage(image.replace("Border_", "Req_"))
            fCtx.drawImage(img, 0, 0, 439, 614)
        }
    } else if (selected === "loot" || selected === "loot-trinket") {
        const i = selected === "loot" ? paths.loot + "Req_Loot_Tarot_Card.png" : paths.loot + "Req_Trinket_Loot_Card.png"
        const img = await pathToImage(i)
        fCtx.drawImage(img, 0, 0, 439, 614)
    } else if (selected === "monster") {
        const floor = $("#floor").find(":selected").val()
        if (floor != "blank") {
            const img = await pathToImage(paths.monster + floors[floor])
            fCtx.drawImage(img, 0, 0, 439, 614)
        }
    }
    if (imageUrl) {
        const background = await pathToImage(imageUrl)
        const scaled = $("#scaled").prop("checked")
        switch (selected) {
            case "character":
            case "monster":
                scaled ? fCtx.drawImage(background, 0, 0, 439, 614) : fCtx.drawImage(background, 0, 0)
                break
            case "eternal-active":
            case "eternal-passive":
            case "item-active":
            case "item-passive":
            case "loot-trinket":
                scaled ? fCtx.drawImage(background, 35, 65, 370, 325) : fCtx.drawImage(background, 35, 65)
                break
            case "loot":
                scaled ? fCtx.drawImage(background, 0, 0, 439, 614) : fCtx.drawImage(background, 0, 0)
                break
        }
    }
    let startingHeight = 416
    if (selected === "character" || selected === "monster") {startingHeight = 440}
    const img = await pathToImage(image)
    fCtx.drawImage(img, 0, 0, 439, 614)
    fCtx.font = "32px TitleFont"
    const title = $("#title").val()
    fCtx.textAlign = "center"
    fCtx.fillText(title, 220, 55)
    fCtx.textAlign = "left"
    fCtx.font = "58px EndFont"
    const health = $("#health").val()
    fCtx.fillText(health, 176, 406)
    const damage = $("#damage").val()
    fCtx.fillText(damage, 282, 406)
    fCtx.textAlign = "center"
    const mhealth = $("#m-health").val()
    fCtx.fillText(mhealth, 142, 406)
    const mdice = $("#m-dice").val()
    fCtx.fillText(mdice, 236, 406)
    const mdamage = $("#m-damage").val()
    fCtx.fillText(mdamage, 338, 406)
    fCtx.font = "34px BodyFont"
    let reward = $("#reward").val()
    reward = reward.replaceAll("[c]", "¢")
    if (reward.startsWith("[s]")) {
        reward = reward.slice(3)
        const img = await pathToImage(paths.assets + "1Soul.png")
        fCtx.drawImage(img, 0, 0, 439, 614)
    } else if (reward.startsWith("[s2]")) {
        reward = reward.slice(4)
        const img = await pathToImage(paths.assets + "2Soul.png")
        fCtx.drawImage(img, 0, 0, 439, 614)
    }
    fCtx.fillText(reward, 220, 578)
    if (selected === "monster") {
        fCtx.font = "34px BodyFont"
        fCtx.fillText("+", 256, 408)
    }
    const text = $("#body").val()
    const lines = text.split("\n")
    let hasIcon = false
    let height = 0
    let first = true
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        line = wrapText(line, 27)
        let size = 30
        if ((line == "[line]" || line == "[bline]") && i > 0) {
            fCtx.strokeStyle = "rgba(1, 1, 1, 0.25)"
            if (line == "[bline]") {fCtx.strokeStyle = "rgb(0, 0, 0)"}
            height += 10
            fCtx.lineWidth = 3
            fCtx.lineCap = "round"
            fCtx.beginPath()
            fCtx.moveTo(90, startingHeight + height)
            fCtx.lineTo(360, startingHeight + height)
            fCtx.stroke()
            continue
        }
        for (let icon in assets) {
            if (line.startsWith(icon)) {
                const tag = await pathToImage(assets[icon])
                fCtx.drawImage(tag, 20, 414 + i * 26, 60, 60)
                line = line.slice(icon.length)
                hasIcon = true
                break
            }
        }
        if (line.startsWith("g+")) {
            fCtx.fillStyle = "rgb(150, 150, 150)"
            line = line.slice(2)
        } else {
            fCtx.fillStyle = "black"
        }
        if (line.startsWith("f") && line.search(/\d+/) == 1) {
            size = line.match(/\d+/)[0]
            line = line.slice(size.length + 1)
        }
        size = +size
        fCtx.textAlign = "center"
        fCtx.font = `${size}px BodyFont`
        for (let l of line.split("\n")) {
            l = l.replaceAll("[c]", "¢")
            const toAdd = Math.floor(size / 1.2) // It's very simple, but have no idea how long it took to find a working formula
            if (!first) {height += toAdd} else {first = false}
            fCtx.fillText(l, 220 + (10 * +hasIcon), startingHeight + height)
        }
    }
    if ($("#credits").prop("checked")) {
        fCtx.fillStyle = "black"
        fCtx.font = "10px Arial"
        fCtx.fillText("Made with 4-Souls Card Creator", 364, 612)
    }
}

// Based on: https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
function getMouseClickPos(canvas, evt) {
    const rect = canvas.getBoundingClientRect()
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    }
}

function testUpdate(e) {
    const data = e.prop("dataset")
    if (typeof data.oldValue === "undefined") {data.oldValue = ""}
    if (data.oldValue != e.val()) {
        data.oldValue = e.val()
        return true
    }
    return false
}

function updateType() {
    const selected = $("#type").find(":selected").val()
    $("#settings > div").each((i, v) => {
        if (v.classList.contains("all") || v.classList.contains(selected)) {
            v.style.display = "block"
        } else {
            v.style.display = "none"
            const children = v.children
            for (let i = 0; i < children.length; i++) {
                const child = children[i]
                const name = child.nodeName.toLowerCase()
                if (name === "textarea") {
                    child.value = ""
                } else if (name === "input") {
                    child.checked = false
                }
            }
        }
    })
}

$(() => {
    updateCard()
    updateType()
})

$(".card").on("mousedown", (e) => {
    const pos = getMouseClickPos(card, e)
    fCtx.font = "8px Arial"
    fCtx.fillText("(" + pos.x + ", " + pos.y + ")", pos.x, pos.y)
    console.log(pos.x, pos.y)
})

$("#type").change((e) => {
    updateType()
    updateCard()
})

$("#title").on("input", () => {
    if (testUpdate($("#title"))) {
        updateCard()
    }
})

$("#scaled").change(() => {
    updateCard()
})

$("#requiem").change(() => {
    updateCard()
})

$("#floor").change(() => {
    updateCard()
})

$("#credits").change(() => {
    updateCard()
})

$("#health").on("input", () => {
    if (testUpdate($("#health"))) {
        updateCard()
    }
})

$("#damage").on("input", () => {
    if (testUpdate($("#damage"))) {
        updateCard()
    }
})

$("#body").on("input", () => {
    if (testUpdate($("#body"))) {
        updateCard()
    }
})

$("#m-health").on("input", () => {
    if (testUpdate($("#m-health"))) {
        updateCard()
    }
})

$("#m-damage").on("input", () => {
    if (testUpdate($("#m-damage"))) {
        updateCard()
    }
})

$("#m-dice").on("input", () => {
    if (testUpdate($("#m-dice"))) {
        updateCard()
    }
})

$("#reward").on("input", () => {
    if (testUpdate($("#reward"))) {
        updateCard()
    }
})

$("#file").click(async () => {
    if (imageUrl) {URL.revokeObjectURL(imageUrl); imageUrl = null} // To prevent memory leaks
    const file = await promptUpload("image/*")
    if (file) {imageUrl = URL.createObjectURL(file)}
    updateCard()
})
