// Import selenium-webdriver
const { By, until } = require('selenium-webdriver')
// Import config
const Config = require('../config')

async function login(driver) {
    console.log("Tarayıcı http://twitter.com adresine yönlendiriliyor...")
    // Go to twitter.com webpage.
    await driver.get('http://www.twitter.com')

    // Initialize XPATHs of username, password and login elements.
    let XPATH_username_field = '//*[@id="doc"]/div/div[1]/div[1]/div[1]/form/div[1]/input'
    let XPATH_password_field = '//*[@id="doc"]/div/div[1]/div[1]/div[1]/form/div[2]/input'
    let XPATH_login_button = '//*[@id="doc"]/div/div[1]/div[1]/div[1]/form/input[1]'

    console.log("Kullanıcı adı, şifre ve giriş butonu elementlerinin yüklenmesi bekleniyor...")
    // Wait to loading of username, password and login elements.
    await driver.wait(until.elementLocated(By.xpath(XPATH_username_field)), 10000)
    await driver.wait(until.elementLocated(By.xpath(XPATH_password_field)), 10000)
    await driver.wait(until.elementLocated(By.xpath(XPATH_login_button)), 10000)

    console.log("Kullanıcı adı, şifre elementlerine erişim sağlanıyor...")
    // Find username and password fields by using XPATHs.
    let username_field = await driver.findElement(By.xpath(XPATH_username_field))
    let password_field = await driver.findElement(By.xpath(XPATH_password_field))

    console.log("Kullanıcı adı, şifre elementlerine bilgiler giriliyor...")
    // Fill username and password fields.
    await username_field.sendKeys(Config.username)
    await password_field.sendKeys(Config.password)

    console.log("Giriş butonu elementine erişim sağlanıyor...")
    // Find login button.
    let login_button = await driver.findElement(By.xpath(XPATH_login_button))

    console.log("Giriş butonuna tıklanılıyor...")
    // Click to login button.
    await login_button.click()
}

module.exports = {
    login: login
}