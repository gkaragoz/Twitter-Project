// Import selenium-webdriver
const { By, until } = require('selenium-webdriver')
// Import utils
const Utils = require('./utils')

let unfollowed_users = []
let followed_users = []

async function unfollow_last_x_users(driver, count) {
    let users = []

    let XPATH_following_users_list = '//*[@id="react-root"]/div/div/div/main/div/div[2]/div/div[1]/div/div/div[2]/section/div/div/div'
    // Wait to loading of element.
    console.log("Kullanıcılar listesi elementinin yüklenmesi bekleniyor...")
    await driver.wait(until.elementLocated(By.xpath(XPATH_following_users_list)), 1000)

    let indexer = 1

    while (true) {
        try {
            // Eğer takipten çıkarılan kullanıcı sayısı istenilen sayıya ulaşmamışsa devam et
            if (users.length <= count) {
                let XPATH_user = XPATH_following_users_list + '/div[' + indexer + ']/div/div/div/div[2]/div[1]/div[1]/a/div/div[2]'
        
                // Kullanıcı elementine erişim sağlanılıyor
                let user = await driver.findElement(By.xpath(XPATH_user))
                let userScrappedText = await user.getText()
        
                // Kullanıcının takip durumu inceleniyor
                if (userScrappedText.includes('Seni takip ediyor') !== true && users.includes(userScrappedText.split('\n')[0]) !== true) {
                    // Seni takip etmiyor!
        
                    let XPATH_user_unfollow_button = '//*[@id="react-root"]/div/div/div/main/div/div[2]/div/div[1]/div/div/div[2]/section/div/div/div/div[' + indexer + ']/div/div/div/div[2]/div[1]/div[2]/div'
                    // Takip etmeyen kullanıcının takibi bırak buton elementine erişim sağlanılıyor
                    let user_unfollow_button = await driver.findElement(By.xpath(XPATH_user_unfollow_button))
    
                    let XPATH_user_unfollow_button_text = XPATH_user_unfollow_button + '/div/span/span'
                    // Unfollow buttonunun textine erişim sağlanılıyor.
                    let user_unfollow_button_text = await driver.findElement(By.xpath(XPATH_user_unfollow_button_text))
    
                    // Takipten çıkılmamışsa çık!
                    if ((await user_unfollow_button_text.getText()).includes('Takip ediliyor') === true) {
                        // Takibi bırak butonuna tıklanılıyor
                        await user_unfollow_button.click()
    
                        await Utils.sleep(100)
    
                        let XPATH_confirm_unfollow_button = '//*[@id="react-root"]/div/div/div[1]/div/div/div/div/div[2]/div[2]/div[3]/div[2]'
                        // Takibi bırakma onay butonuna erişim sağlanılıyor
                        let confirm_unfollow_button = await driver.findElement(By.xpath(XPATH_confirm_unfollow_button))
    
                        // Takibi bırakma onay butonuna tıklanılıyor
                        await confirm_unfollow_button.click()
    
                        console.log("Takipten çıkıldı: " + userScrappedText.split('\n')[0])
    
                        await Utils.sleep(100)
                    }
                } else {
                    // Seni takip ediyor!
                    indexer++
        
                    continue
                }
            } else {
                // Limit doldu. Count kadar kullanıcı takipten çıkartıldı.
                break
            }
    
            // Takipten çıkıldı!")
            indexer = 1
            users.push(userScrappedText.split('\n')[0])
        } catch (error) {
            if (error.name === 'NoSuchElementError') {
                console.log('NoSuchElementError: ' + 'Muhtemelen şuanki sayfada herkes beni takip ediyor...')
            } else {
                console.log('İncelenmesi gereken bir hata: ' + error)
            }

            if (await Utils.scroll_down_to_page(driver, 750) === true) {
                return users
            }

            await Utils.sleep(250)
            
            indexer = 1
        }
    }
}

async function unfollow(driver) {
    let XPATH_following_users_list = '//*[@id="react-root"]/div/div/div/main/div/div[2]/div/div[1]/div/div/div[2]/section/div/div/div'
    // Wait to loading of element.
    console.log("Kullanıcılar listesi elementinin yüklenmesi bekleniyor...")
    await driver.wait(until.elementLocated(By.xpath(XPATH_following_users_list)), 1000)

    let indexer = 1

    while (true) {
        try {
            let XPATH_user = XPATH_following_users_list + '/div[' + indexer + ']/div/div/div/div[2]/div[1]/div[1]/a/div/div[2]'
    
            // Kullanıcı elementine erişim sağlanılıyor
            let user = await driver.findElement(By.xpath(XPATH_user))
            let userScrappedText = await user.getText()
    
            // Kullanıcının takip durumu inceleniyor
            if (userScrappedText.includes('Seni takip ediyor') !== true && unfollowed_users.includes(userScrappedText.split('\n')[0]) !== true) {
                // Seni takip etmiyor!
    
                let XPATH_user_unfollow_button = '//*[@id="react-root"]/div/div/div/main/div/div[2]/div/div[1]/div/div/div[2]/section/div/div/div/div[' + indexer + ']/div/div/div/div[2]/div[1]/div[2]/div'
                // Takip etmeyen kullanıcının takibi bırak buton elementine erişim sağlanılıyor
                let user_unfollow_button = await driver.findElement(By.xpath(XPATH_user_unfollow_button))

                let XPATH_user_unfollow_button_text = XPATH_user_unfollow_button + '/div/span/span'
                // Unfollow buttonunun textine erişim sağlanılıyor.
                let user_unfollow_button_text = await driver.findElement(By.xpath(XPATH_user_unfollow_button_text))

                // Takipten çıkılmamışsa çık!
                if ((await user_unfollow_button_text.getText()).includes('Takip ediliyor') === true) {
                    // Takibi bırak butonuna tıklanılıyor
                    await user_unfollow_button.click()

                    await Utils.sleep(100)

                    let XPATH_confirm_unfollow_button = '//*[@id="react-root"]/div/div/div[1]/div/div/div/div/div[2]/div[2]/div[3]/div[2]'
                    // Takibi bırakma onay butonuna erişim sağlanılıyor
                    let confirm_unfollow_button = await driver.findElement(By.xpath(XPATH_confirm_unfollow_button))

                    // Takibi bırakma onay butonuna tıklanılıyor
                    await confirm_unfollow_button.click()

                    console.log("Takipten çıkıldı: " + userScrappedText.split('\n')[0])

                    await Utils.sleep(100)
                }
            } else {
                //Seni takip ediyor!
                indexer++
    
                continue
            }
    
            //Takipten çıkıldı!")
            indexer = 1
            unfollowed_users.push(userScrappedText.split('\n')[0])
        } catch (error) {
            if (error.name === 'NoSuchElementError') {
                console.log('NoSuchElementError: ' + 'Muhtemelen şuanki sayfada herkes beni takip ediyor...')
            } else {
                console.log('İncelenmesi gereken bir hata: ' + error)
            }

            if (await Utils.scroll_down_to_page(driver, 750) === true) {
                return unfollowed_users
            }

            await Utils.sleep(250)
            
            indexer = 1
        }
    }
}

async function follow(driver) {
    let XPATH_follower_users_list = '//*[@id="react-root"]/div/div/div/main/div/div[2]/div/div[1]/div/div/div[2]/section/div/div/div'
    // Wait to loading of element.
    console.log("Kullanıcılar listesi elementinin yüklenmesi bekleniyor...")
    await driver.wait(until.elementLocated(By.xpath(XPATH_follower_users_list)), 1000)

    let indexer = 1

    while (true) {
        try {
            let XPATH_user = XPATH_follower_users_list + '/div[' + indexer + ']/div/div/div/div[2]/div[1]/div[1]/a/div/div[2]'
    
            // Kullanıcı elementine erişim sağlanılıyor
            let user = await driver.findElement(By.xpath(XPATH_user))
            let userScrappedText = await user.getText()
    
            // Kullanıcı inceleniyor
            if (followed_users.includes(userScrappedText.split('\n')[0]) !== true) {
                let XPATH_user_follow_button = '//*[@id="react-root"]/div/div/div/main/div/div[2]/div/div[1]/div/div/div[2]/section/div/div/div/div[' + indexer + ']/div/div/div/div[2]/div[1]/div[2]/div'
                // Takip eden kullanıcının takip butonuna erişim sağlanılıyor
                let user_follow_button = await driver.findElement(By.xpath(XPATH_user_follow_button))

                let XPATH_user_follow_button_text = XPATH_user_follow_button + '/div/span/span'
                // Follow buttonunun textine erişim sağlanılıyor.
                let user_follow_button_text = await driver.findElement(By.xpath(XPATH_user_follow_button_text))

                // Takip edilmiyorsa takip et!
                if ((await user_follow_button_text.getText()).includes('Takip ediliyor') !== true) {
                    // Takip et butonuna tıklanılıyor
                    await user_follow_button.click()

                    console.log("Takip edildi: " + userScrappedText.split('\n')[0])

                    await Utils.sleep(100)
                }
            } else {
                //Bu kullanıcıyı zaten inceledin!
                indexer++
    
                continue
            }
    
            //Takip edildi!")
            indexer = 1
            followed_users.push(userScrappedText.split('\n')[0])
        } catch (error) {
            if (error.name === 'NoSuchElementError') {
                console.log('NoSuchElementError: ' + 'Muhtemelen şuanki sayfada herkesi takip ediyorum...')
            } else {
                console.log('İncelenmesi gereken bir hata: ' + error)
            }

            if (await Utils.scroll_down_to_page(driver, 750) === true) {
                return followed_users
            }

            await Utils.sleep(250)
            
            indexer = 1
        }
    }
}

module.exports = {
    unfollow_last_x_users: unfollow_last_x_users,
    unfollow: unfollow,
    follow: follow,
    get_unfollowed_users: unfollowed_users
}