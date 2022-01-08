let beerCreators = []


function getNewCreatorID() {
    let id = Math.floor(Math.random() * 1000)
    return beerCreators.map(e => { return e.id }).includes(id) ? getNewCreatorID() : id
}

function getCreatorById(creatorID) {
    return beerCreators.filter(e => e.id === creatorID)[0]
}

function renderRemovers() {
    let removers = [...document.getElementsByClassName('remover')]
    if (removers.length === 1) {
        removers[0].getElementsByTagName('button')[0].setAttribute('disabled', '')
    } else {
        removers[0].getElementsByTagName('button')[0].removeAttribute('disabled')
    }
}

function renderAdder() {
    if (beerCreators.length === 10) {
        document.getElementById('beerAdder').setAttribute('disabled', '')
    } else {
        document.getElementById('beerAdder').removeAttribute('disabled')
    }
}

function setRemoverListener(creatorID) {
    document.getElementById(`remover${creatorID}`).addEventListener('click', () => {
        if (beerCreators.length > 1) {
            beerCreators.splice(beerCreators.indexOf(beerCreators.filter(e => e.id === creatorID)[0]), 1)
            document.getElementById('beerContainer')
                .removeChild(document.getElementById(`beerCreator${creatorID}`))
            renderRemovers()
            renderAdder()
            renderPrice()
        }
    })
}

function setCounterListeners(creatorID) {
    const creator = getCreatorById(creatorID)
    document.getElementById(`decrease${creatorID}`).addEventListener('click', () => {
        if (creator.count > 1) {
            --creator.count
            document.getElementById(`counterView${creatorID}`).innerText = creator.count
        }
        if (creator.count === 1) {
            document.getElementById(`decrease${creatorID}`).setAttribute('disabled', '')
        }
        document.getElementById(`increase${creatorID}`).removeAttribute('disabled')
        renderPrice()
    })
    document.getElementById(`increase${creatorID}`).addEventListener('click', () => {
        if (creator.count < 10) {
            ++creator.count
            document.getElementById(`counterView${creatorID}`).innerText = creator.count
        }
        if (creator.count === 10) {
            document.getElementById(`increase${creatorID}`).setAttribute('disabled', '')
        }
        document.getElementById(`decrease${creatorID}`).removeAttribute('disabled')
        renderPrice()
    })
}

function setArrowListeners(creatorID) {
    const creator = getCreatorById(creatorID)
    const onArrow = (changeBottle, changeSticker, changeTaste) => {
        if (document.getElementById(`bottleRadio${creatorID}`).checked) {
            changeBottle()
        } else if (document.getElementById(`stickerRadio${creatorID}`).checked) {
            changeSticker()
        } else {
            changeTaste()
        }
        renderPreview(creatorID)
    }
    const bottleKeys = [...bottles.keys()]
    const stickerKeys = [...stickers.keys()]
    const tasteKeys = [...tastes.keys()]
    document.getElementById(`left${creatorID}`).addEventListener('click', () => { onArrow(
        () => {
            creator.bottle = creator.bottle === bottleKeys[0] ?
                bottleKeys[bottleKeys.length - 1] : bottleKeys[bottleKeys.indexOf(creator.bottle) - 1]
        },
        () => {
            creator.sticker = creator.sticker === stickerKeys[0] ?
                stickerKeys[stickerKeys.length - 1] : stickerKeys[stickerKeys.indexOf(creator.sticker) - 1]
        },
        () => {
            creator.taste = creator.taste === tasteKeys[0] ?
                tasteKeys[tasteKeys.length - 1] : tasteKeys[tasteKeys.indexOf(creator.taste) - 1]
        }
    )})
    document.getElementById(`right${creatorID}`).addEventListener('click', () => { onArrow(
        () => {
            creator.bottle = creator.bottle === bottleKeys[bottleKeys.length - 1] ?
                bottleKeys[0] : bottleKeys[bottleKeys.indexOf(creator.bottle) + 1]
        },
        () => {
            creator.sticker = creator.sticker === stickerKeys[stickerKeys.length - 1] ?
                stickerKeys[0] : stickerKeys[stickerKeys.indexOf(creator.sticker) + 1]
        },
        () => {
            creator.taste = creator.taste === tasteKeys[tasteKeys.length - 1] ?
                tasteKeys[0] : tasteKeys[tasteKeys.indexOf(creator.taste) + 1]
        }
    )})
}

function addBeer() {
    if (beerCreators.length < 10) {
        let creatorID = getNewCreatorID()
        document.getElementById('beerContainer').innerHTML += `
            <div class="beer__creator" id="beerCreator${creatorID}">
                <div class="beer__visualizer">
                    <div class="visualizer">
                        <div class="counter">
                            <div class="counter__viewer rounded border border-dark text__center" id="counterView${creatorID}">1</div>
                            <div class="counter__control">
                                <button type="button" class="counter__decrease btn btn-lg btn-outline-danger text__center" id="decrease${creatorID}" disabled>-</button>
                                <button type="button" class="counter__increase btn btn-lg btn-outline-success text__center" id="increase${creatorID}">+</button>
                            </div>
                        </div>
                        <div class="left">
                            <img id="left${creatorID}" class="arrow" alt="" src="static/img/arrow.svg">
                        </div>
                        <div class="viewer">
                            <div class="product__viewer">
                                <img class="bottle__layer" src="" alt="" id="bottleLayer${creatorID}">
                                <img class="sticker__layer" src="" alt="" id="stickerLayer${creatorID}">
                            </div>
                            <div class="taste__viewer text__center" id="tasteViewer${creatorID}"></div>
                        </div>
                        <div class="right">
                            <img id="right${creatorID}" class="arrow" alt="" src="static/img/arrow.svg">
                        </div>
                        <div class="remover" id="remover${creatorID}">
                            <button type="button" class="btn btn-lg btn-outline-danger">
                                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#dc3545">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M0 0h24v24H0V0z" fill="none"/>
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="parameters btn-group-lg" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" class="btn-check" name="parameters${creatorID}" id="bottleRadio${creatorID}" autocomplete="off" checked>
                    <label class="bottle__parameter btn btn-outline-dark text__center" for="bottleRadio${creatorID}" id="bottleLabel${creatorID}"></label>
                    <input type="radio" class="btn-check" name="parameters${creatorID}" id="stickerRadio${creatorID}" autocomplete="off">
                    <label class="sticker__parameter btn btn-outline-dark text__center" for="stickerRadio${creatorID}" id="stickerLabel${creatorID}"></label>
                    <input type="radio" class="btn-check" name="parameters${creatorID}" id="tasteRadio${creatorID}" autocomplete="off">
                    <label class="taste__parameter btn btn-outline-dark text__center" for="tasteRadio${creatorID}" id="tasteLabel${creatorID}"></label>
                </div>
            </div>
        `
        beerCreators.push({id: creatorID, count: 1, bottle: 0, sticker: -1, taste: 0});
        beerCreators.forEach(e => setRemoverListener(e.id))
        beerCreators.forEach(e => setCounterListeners(e.id))
        beerCreators.forEach(e => setArrowListeners(e.id))
        renderRemovers()
        renderAdder()
        renderPreview(creatorID)
    }
}

function renderPrice() {
    let sum = 0
    beerCreators.forEach(e => sum += e.count *
        (bottles.get(e.bottle) + stickers.get(e.sticker) + tastes.get(e.taste).price))
    document.getElementById('footerText').innerText = `Итоговая сумма: ${sum} руб.`
}

function renderPreview(creatorID) {
    const creator = getCreatorById(creatorID)
    document.getElementById(`bottleLayer${creatorID}`).src = `static/img/bottle-${creator.bottle}.png`
    document.getElementById(`stickerLayer${creatorID}`).src = creator.sticker === -1 ?
        '' : `static/img/sticker-${creator.sticker}.png`
    document.getElementById(`tasteViewer${creatorID}`).innerText = tastes.get(creator.taste).name
    document.getElementById(`bottleLabel${creatorID}`).innerHTML =
        `Стиль бутылки<br>${bottles.get(creator.bottle)}`
    document.getElementById(`stickerLabel${creatorID}`).innerHTML =
        `Стикер<br>${stickers.get(creator.sticker)}`
    document.getElementById(`tasteLabel${creatorID}`).innerHTML =
        `Вкус<br>${tastes.get(creator.taste).price}`
    renderPrice()
}

function getUniqueBeers() {
    let beers = new Map()
    beerCreators.forEach(creator => {
        let data = `${creator.bottle} ${creator.sticker} ${creator.taste}`
        beers.set(data, beers.get(data) !== undefined ? beers.get(data) + creator.count : creator.count)
    })
    return [...beers.keys()].map(key => {
        let splitted = key.split(' ').map(value => +value)
        return {count: beers.get(key), bottle: splitted[0], sticker: splitted[1], taste: splitted[2]}
    })
}


function onPay() {
    let params = JSON.stringify({ session: session, beers: getUniqueBeers() })
fetch(`${host}/submit-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: params
    })
    .then(response => {
        if (response.ok && response.redirected) {
            window.location.href = response.url
        } else {
            alert('Произошла ошибка! Перезагрузите страницу!')
        }
    })
}

addBeer()
document.getElementById('beerAdder').addEventListener('click', () => { addBeer() })
document.getElementById('pay').addEventListener('click', () => { onPay() })
