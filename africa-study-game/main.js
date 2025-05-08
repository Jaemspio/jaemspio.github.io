let scene = "menu"
let section = "countries"
let time = 0
let correct = 0
let total = 0
let incorrect = 0
let answeredQuestion = false
let writing = false
let capitals = false
let landforms = false
let skipCountries = false
const answerSet = {
    "countries": {
        "Mauritania": "mauritania",
        "Senegal": "senegal",
        "Gambia": "gambia",
        "Mali": "mali",
        "Guinea": "guinea",
        "Burkina Faso": "burkina_faso",
        "Sierra Leone": "sierra_leone",
        "Liberia": "liberia",
        "Ivory Coast": "ivory_coast",
        "Ghana": "ghana",
        "Niger": "niger",
        "Togo": "togo",
        "Benin": "benin",
        "Nigeria": "nigeria",
        "Chad": "chad",
        "Cameroon": "cameroon",
        "Sudan": "sudan",
        "Central African Republic": "central_african_republic",
        "South Sudan": "south_sudan",
        "Eritrea": "eritrea",
        "Djibouti": "djibouti",
        "Ethiopia": "ethiopia",
        "Gabon": "gabon",
        "Republic of the Congo": "republic_congo",
        "Somalia": "somalia",
        "Democratic Republic of the Congo": "drc",
        "Uganda": "uganda",
        "Kenya": "kenya",
        "Rwanda": "rwanda",
        "Burundi": "burundi",
        "Tanzania": "tanzania",
        "Angola": "angola",
        "Zambia": "zambia",
        "Malawi": "malawi",
        "Namibia": "namibia",
        "Botswana": "botswana",
        "Zimbabwe": "zimbabwe",
        "Mozambique": "mozambique",
        "South Africa": "south_africa",
        "Madagascar": "madagascar",
    },
    "capitals": {
        "Nouakchott": "mauritania",
        "Dakar": "senegal",
        "Banjul": "gambia",
        "Bamako": "mali",
        "Conakry": "guinea",
        "Ouagadougou": "burkina_faso",
        "Freetown": "sierra_leone",
        "Monrovia": "liberia",
        "Yamoussoukro": "ivory_coast",
        "Accra": "ghana",
        "Niamey": "niger",
        "Lome": "togo",
        "Porto-Novo": "benin",
        "Abuja": "nigeria",
        "N'Djamena": "chad",
        "Yaounde": "cameroon",
        "Khartoum": "sudan",
        "Bangui": "central_african_republic",
        "Juba": "south_sudan",
        "Asmara": "eritrea",
        "Djibouti City": "djibouti",
        "Addis Ababa": "ethiopia",
        "Libreville": "gabon",
        "Brazzaville": "republic_congo",
        "Mogadishu": "somalia",
        "Kinshasa": "drc",
        "Kampala": "uganda",
        "Nairobi": "kenya",
        "Kigali": "rwanda",
        "Gitega": "burundi",
        "Dodoma": "tanzania",
        "Luanda": "angola",
        "Lusaka": "zambia",
        "Lilongwe": "malawi",
        "Windhoek": "namibia",
        "Gaborone": "botswana",
        "Harare": "zimbabwe",
        "Maputo": "mozambique",
        "Pretoria": "south_africa",
        "Antananarivo": "madagascar",
    },
    "landforms": {
        "Congo River": "congo_river",
        "Gulf of Aden": "gulf_of_aden",
        "Gulf of Guinea": "gulf_of_guinea",
        "Lake Tanganyika": "lake_tanganyika",
        "Lake Victoria": "lake_victoria",
        "Mozambique Channel": "mozambique_channel",
        "Niger River": "niger_river",
        "Nile River": "nile_river",
        "Red Sea": "red_sea",
        "Sahara Desert": "sahara_desert",
    }
}

// Test date: Feb. 27

let questions

// Functions
function shuffleArray(array) {
    for (var i = array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

function round(number) {
    return Math.floor(number + 0.5)
}

// Menu Code
$("#menu button").click(function(e) {
    if ($("#skip").prop("checked") && !($("#capitals").prop("checked") || $("#landforms").prop("checked"))) return
    scene = "game"
    $("#game").show()
    $("#menu").hide()
    initGame({
        writingMode: $("#writing").prop("checked"),
        capitals: $("#capitals").prop("checked"),
        landforms: $("#landforms").prop("checked"),
        skipCountries: $("#skip").prop("checked"),
    })
})

$("#skip").change(function(e) {
    if (this.checked && !$("#capitals").prop("checked") && !$("#landforms").prop("checked")) {
        $("#capitals").prop("checked", true)
    }
})

$("#capitals, #landforms").change(function(e) {
    if (!$("#capitals").prop("checked") && !$("#landforms").prop("checked")) {
        $("#skip").prop("checked", false)
    }
})

// Game Code
const countries = [...document.querySelectorAll(".country")]
const landformsList = [...document.querySelectorAll(".landform")]
const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d", {willReadFrequently: true})

let mx = 0, my = 0
function fixBoundingBoxes(x, y) {
    const countries = getAllCountriesFromPoint(x, y)
    for (let country of countries) {
        canvas.width = country.width
        canvas.height = country.height
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(country, 0, 0, country.width, country.height)
        const rect = country.getBoundingClientRect()
        const mx = x - rect.x
        const my = y - rect.y
        const pixel = ctx.getImageData(mx, my, 1, 1).data
        if (pixel[3] === 0) {
            country.style.pointerEvents = "none"
        } else {
            country.style.pointerEvents = "auto"
        }
    }
    if (section !== "landforms") {return}
    const landforms = getAllLandformsFromPoint(x, y)
    for (let landform of landforms) {
        if (writing) {
            landform.style.pointerEvents = "none"
            return
        }
        canvas.width = landform.width
        canvas.height = landform.height
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(landform, 0, 0, landform.width, landform.height)
        const rect = landform.getBoundingClientRect()
        const mx = x - rect.x
        const my = y - rect.y
        const pixel = ctx.getImageData(mx, my, 1, 1).data
        if (pixel[3] === 0) {
            landform.style.pointerEvents = "none"
        } else {
            landform.style.pointerEvents = "auto"
        }
    }
}

let timerId
function initGame(options) {
    section = "countries"
    time = 0
    correct = 0
    total = 0
    answeredQuestion = false
    questions = shuffleArray(Object.keys(answerSet.countries))
    for (let country of countries) {
        country.classList.remove("correct")
        country.classList.remove("incorrect")
        country.classList.remove("inactive")
    }
    for (let landform of landformsList) {
        landform.classList.remove("correct")
        landform.classList.remove("incorrect")
        landform.classList.add("inactive")
    }
    $("#objective").text(`Click on ${questions[0]}.`)
    $("#time").text("Time: 0:00")
    $("#percent").text("Correct: 0/0")
    $("#writing-prompt label").text("Type the name of this country: ")
    $("#answer").text("")
    writing = options.writingMode !== undefined ? options.writingMode : writing
    capitals = options.capitals !== undefined ? options.capitals : capitals
    landforms = options.landforms !== undefined ? options.landforms : landforms
    skipCountries = options.skipCountries !== undefined ? options.skipCountries : skipCountries
    $("#objective").show()
    $("#writing-prompt").hide()
    if (writing) {
        for (let country of countries) {
            country.classList.add("inactive")
        }
        for (let landform of landformsList) {
            landform.style.pointerEvents = "none"
        }
        $("#objective").hide()
        $("#writing-prompt").show()
        if (skipCountries) {
            if (capitals) {
                section = "capitals"
                questions = shuffleArray(Object.keys(answerSet.capitals))
                $("#writing-prompt label").text("Type the capital of this country: ")
            } else if (landforms) {
                section = "landforms"
                for (let landform of landformsList) {
                    landform.classList.remove("inactive")
                }
                questions = shuffleArray(Object.keys(answerSet.landforms))
                $("#writing-prompt label").text("Type the name of this landform: ")
            }
        }
        $(`#${answerSet[section][questions[0]]}`).addClass("chosen")
    } else if (skipCountries) {
        if (capitals) {
            section = "capitals"
            questions = shuffleArray(Object.keys(answerSet.capitals))
            $("#objective").text(`Click on the country whose capital is ${questions[0]}.`)
        } else if (landforms) {
            section = "landforms"
            for (let country of countries) {
                country.classList.add("inactive")
            }
            for (let landform of landformsList) {
                landform.classList.remove("inactive")
            }
            questions = shuffleArray(Object.keys(answerSet.landforms))
            $("#objective").text(`Click on the ${questions[0]}.`)
        }
    }
    fixBoundingBoxes(mx, my)
    timerId = setInterval(function() {
        time++
        const seconds = time % 60
        $("#time").text(`Time: ${Math.floor(time / 60)}:${seconds < 10 ? "0" + seconds : seconds}`)
    }, 1000)
}

function getAllCountriesFromPoint(x, y) {
    const elements = []
    for (let country of countries) {
        if (country.classList.contains("small")) continue
        const rect = country.getBoundingClientRect()
        if (x >= rect.x && y >= rect.y && x <= rect.x + rect.width && y <= rect.y + rect.height) {
            elements.push(country)
        }
    }
    return elements
}

function getAllLandformsFromPoint(x, y) {
    const elements = []
    for (let landform of landformsList) {
        const rect = landform.getBoundingClientRect()
        if (x >= rect.x && y >= rect.y && x <= rect.x + rect.width && y <= rect.y + rect.height) {
            elements.push(landform)
        }
    }
    return elements
}

for (let country of countries) {
    $(country).click(function(e) {
        if (writing) return
        if (section === "landforms") return
        if (country.classList.contains("correct") || country.classList.contains("incorrect")) return
        const didAnswer = answeredQuestion
        if (!answeredQuestion) {
            total++
            answeredQuestion = true
        }
        if (country.id === answerSet[section][questions[0]]) {
            $(`#${answerSet[section][questions[0]]}`).removeClass("show-answer")
            questions.shift()
            $("#objective").text(section === "capitals" ? `Click on the country whose capital is ${questions[0]}.` :
                `Click on ${questions[0]}.`)
            if (!didAnswer) {
                correct++
                country.classList.add("correct")
            } else {
                country.classList.add("incorrect")
            }
            incorrect = 0
            answeredQuestion = false
        } else {
            incorrect++
            if (incorrect >= 3) {
                $(`#${answerSet[section][questions[0]]}`).addClass("show-answer")
            }
        }
        $("#percent").text(`Correct: ${correct}/${total} (${round((correct / total) * 100)}%)`)
        if (!questions.length) {
            if (section === "countries" && capitals) {
                section = "capitals"
                for (let country of countries) {
                    country.classList.remove("correct")
                    country.classList.remove("incorrect")
                }
                questions = shuffleArray(Object.keys(answerSet.capitals))
                $("#objective").text(`Click on the country whose capital is ${questions[0]}.`)
                return
            } else if (landforms) {
                section = "landforms"
                for (let country of countries) {
                    country.classList.remove("correct")
                    country.classList.remove("incorrect")
                    country.classList.add("inactive")
                }
                for (let landform of landformsList) {
                    landform.classList.remove("inactive")
                }
                questions = shuffleArray(Object.keys(answerSet.landforms))
                $("#objective").text(`Click on the ${questions[0]}.`)
                fixBoundingBoxes(mx, my)
                return
            }
            clearInterval(timerId)
            $("#objective").hide()
            $("dialog")[0].showModal()
            const seconds = time % 60
            $("#result-time").text(`Final Time: ${Math.floor(time / 60)}:${seconds < 10 ? "0" + seconds : seconds}`)
            $("#result-percent").text(`Results: ${correct}/${total} (${round((correct / total) * 100)}%)`)
        }
    })
}

for (let landform of landformsList) {
    $(landform).click(function(e) {
        if (writing) return
        const didAnswer = answeredQuestion
        if (!answeredQuestion) {
            total++
            answeredQuestion = true
        }
        if (landform.id === answerSet.landforms[questions[0]]) {
            $(`#${answerSet[section][questions[0]]}`).removeClass("show-answer")
            questions.shift()
            $("#objective").text(`Click on the ${questions[0]}.`)
            if (!didAnswer) {
                correct++
                landform.classList.add("correct")
            } else {
                landform.classList.add("incorrect")
            }
            incorrect = 0
            answeredQuestion = false
        } else {
            incorrect++
            if (incorrect >= 3) {
                $(`#${answerSet[section][questions[0]]}`).addClass("show-answer")
            }
        }
        $("#percent").text(`Correct: ${correct}/${total} (${round((correct / total) * 100)}%)`)
        if (!questions.length) {
            clearInterval(timerId)
            $("#objective").hide()
            $("dialog")[0].showModal()
            const seconds = time % 60
            $("#result-time").text(`Final Time: ${Math.floor(time / 60)}:${seconds < 10 ? "0" + seconds : seconds}`)
            $("#result-percent").text(`Results: ${correct}/${total} (${round((correct / total) * 100)}%)`)
        }
    })
}

$("#writing-box").on("keypress", function(e) {
    if (e.key === "Enter") {
        $("#enter")[0].click()
    }
})

$("#enter").click(function(e) {
    const didAnswer = answeredQuestion
    if (!answeredQuestion) {
        total++
        answeredQuestion = true
    }
    if ($("#writing-box").val().toLowerCase() === questions[0].toLowerCase()) {
        if (!didAnswer) {
            correct++
            $(`#${answerSet[section][questions[0]]}`).addClass("correct")
        } else {
            $(`#${answerSet[section][questions[0]]}`).addClass("incorrect")
        }
        questions.shift()
        $(".country.chosen, .landform.chosen").removeClass("chosen")
        $(`#${answerSet[section][questions[0]]}`).addClass("chosen")
        $("#writing-box").val("")
        $("#answer").text("")
        answeredQuestion = false
        incorrect = 0
    } else {
        incorrect++
        if (incorrect >= 3) {
            $("#answer").text(questions[0])
        }
    }
    $("#percent").text(`Correct: ${correct}/${total} (${round((correct / total) * 100)}%)`)
    if (!questions.length) {
        if (section === "countries" && capitals) {
            section = "capitals"
            for (let country of countries) {
                country.classList.remove("correct")
                country.classList.remove("incorrect")
            }
            questions = shuffleArray(Object.keys(answerSet.capitals))
            $(`#${answerSet[section][questions[0]]}`).addClass("chosen")
            $("#writing-prompt label").text("Type the capital of this country: ")
            return
        } else if (landforms && section !== "landforms") {
            section = "landforms"
            for (let country of countries) {
                country.classList.remove("correct")
                country.classList.remove("incorrect")
            }
            for (let landform of landformsList) {
                landform.classList.remove("inactive")
            }
            questions = shuffleArray(Object.keys(answerSet.landforms))
            $(`#${answerSet[section][questions[0]]}`).addClass("chosen")
            $("#writing-prompt label").text("Type the name of this landform: ")
            fixBoundingBoxes(mx, my)
            return
        }
        clearInterval(timerId)
        $("dialog")[0].showModal()
        const seconds = time % 60
        $("#result-time").text(`Final Time: ${Math.floor(time / 60)}:${seconds < 10 ? "0" + seconds : seconds}`)
        $("#result-percent").text(`Results: ${correct}/${total} (${round((correct / total) * 100)}%)`)
    }
})

$("#play-again").click(function(e) {
    initGame({})
    $("dialog")[0].close()
})

$("#goto-menu").click(function(e) {
    scene = "menu"
    $("#menu").show()
    $("#game").hide()
    $("dialog")[0].close()
})

window.addEventListener("mousemove", function(e) {
    mx = e.clientX
    my = e.clientY
    if (scene !== "game") {return}
    fixBoundingBoxes(mx, my)
})

window.addEventListener("touchstart", function(e) {
    const touch = e.touches[0]
    mx = touch.clientX
    my = touch.clientY
    if (scene !== "game") {return}
    fixBoundingBoxes(mx, my)
})
