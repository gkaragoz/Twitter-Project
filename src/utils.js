async function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

async function scroll_down_to_page(driver) {
    let SCROLL_PAUSE_TIME = 750

    // Get scroll height
    let last_height = await driver.executeScript("return document.body.scrollHeight")

    // Scroll down
    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);")

    // Wait to load page
    await sleep(SCROLL_PAUSE_TIME);

    // Calculate new scroll height and compare with last scroll height
    let new_height = await driver.executeScript("return document.body.scrollHeight")
    if (new_height == last_height) {
        return true
    } else {
        return false
    }
}

module.exports = {
    sleep: sleep,
    scroll_down_to_page: scroll_down_to_page
}