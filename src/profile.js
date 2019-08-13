// Import selenium-webdriver
const { By, until } = require('selenium-webdriver')
// Import config
const Config = require('../config')

async function go_to_profile_page(driver) {
    console.log("Tarayıcı profil sayfasına yönlendiriliyor... " + 'https://twitter.com/' + Config.username)
    // Redirect to profile page related logged in user.
    await driver.get('https://twitter.com/' + Config.username)
}

async function go_to_following_page(driver) {
    console.log("Tarayıcı takip edilenler sayfasına yönlendiriliyor... " + 'https://twitter.com/' + Config.username + '/following')
    // Redirect to following page related logged in user.
    await driver.get('https://twitter.com/' + Config.username + '/following')
}

async function get_followings_count(driver) {
    let XPATH_following_count_field = '//*[@id="react-root"]/div/div/div/main/div/div[2]/div/div[1]/div/div/div[2]/div/div/div[1]/div/div[5]/div[1]/a'

    console.log("Takip edilen kullanıcı sayısı elementinin yüklenmesi bekleniyor...")
    // Wait to loading of element.
    await driver.wait(until.elementLocated(By.xpath(XPATH_following_count_field)), 10000)
    console.log("Takip edilen kullanıcı sayısı elementine erişim sağlanılıyor...")
    let following_count_field = await driver.findElement(By.xpath(XPATH_following_count_field))
    console.log("Takip edilen kullanıcı sayısına erişim sağlanıyor...")
    let following_count = await following_count_field.getAttribute('title')

    return following_count;
}

module.exports = {
    go_to_profile_page: go_to_profile_page,
    go_to_following_page: go_to_following_page,
    get_followings_count: get_followings_count
}