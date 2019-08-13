console.log("Selenium kütüphanesi dahil ediliyor...");
// Import selenium-webdriver
const { Builder, By, Key, until } = require('selenium-webdriver')

console.log("Kullanıcı adı ve şifre ayarlanıyor...");
// Username and password settings
let username = 'fantastikzek';
let password = 'darkmode2023xAA';

console.log("Program başlatılıyor...");
// Create a async browser
(async function Main() {
    console.log("Bir tarayıcı başlatılıyor...")

    // Open browser
    let driver = await new Builder().forBrowser('firefox').build()

    console.log("Tarayıcı http://twitter.com adresine yönlendiriliyor...")
    // Go to twitter.com webpage.
    await driver.get('http://www.twitter.com')

    console.log("\nFAZ 1: Giriş başlatılıyor")
    // Phase 1: LOGIN

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
    await username_field.sendKeys(username)
    await password_field.sendKeys(password)

    console.log("Giriş butonu elementine erişim sağlanıyor...")
    // Find login button.
    let login_button = await driver.findElement(By.xpath(XPATH_login_button))

    console.log("Giriş butonuna tıklanılıyor...")
    // Click to login button.
    await login_button.click()

    console.log("\nFAZ 2: Profil sayfası")
    // Phase 2: GO TO PROFILE PAGE

    console.log("Tarayıcı profil sayfasına yönlendiriliyor... " + 'https://twitter.com/' + username)
    // Redirect to profile page related logged in user.
    await driver.get('https://twitter.com/' + username)

    console.log("\nFAZ 3: Kaç adet kullanıcı takip ediliyor?")
    // Phase 3: GET HOW MANY FOLLOWING USERS COUNT
    let XPATH_following_count_field = '//*[@id="react-root"]/div/div/div/main/div/div[2]/div/div[1]/div/div/div[2]/div/div/div[1]/div/div[5]/div[1]/a'

    console.log("Takip edilen kullanıcı sayısı elementinin yüklenmesi bekleniyor...")
    // Wait to loading of element.
    await driver.wait(until.elementLocated(By.xpath(XPATH_following_count_field)), 10000)
    console.log("Takip edilen kullanıcı sayısı elementine erişim sağlanılıyor...")
    let following_count_field = await driver.findElement(By.xpath(XPATH_following_count_field))
    console.log("Takip edilen kullanıcı sayısına erişim sağlanıyor...")
    let following_count = await following_count_field.getAttribute('title')

    console.log("-->" + username + " " + following_count + " kişiyi takip ediyor.")

    console.log("\nFAZ 4: Takip edilenler sayfası")
    // Phase 4: GO TO FOLLOWING PAGE
    console.log("Tarayıcı takip edilenler sayfasına yönlendiriliyor... " + 'https://twitter.com/' + username + '/following')
    // Redirect to following page related logged in user.
    await driver.get('https://twitter.com/' + username + '/following')

    console.log("\nFAZ 5: Kimler beni takip etmiyor? Yok et onları!")
    // Phase 5: Unfollow who is not following my user.

    let XPATH_following_users_list = '//*[@id="react-root"]/div/div/div/main/div/div[2]/div/div[1]/div/div/div[2]/section/div/div/div'
    // Wait to loading of element.
    console.log("Kullanıcılar listesi elementinin yüklenmesi bekleniyor...")
    await driver.wait(until.elementLocated(By.xpath(XPATH_following_users_list)), 1000)

    console.log(following_count + " adet kullanıcı inceleniyor...")

    let unfollowed_users = await (unfollow_stage(driver, XPATH_following_users_list))
    console.log("unfollowed users: ")

    unfollowed_users.forEach(user => {
        console.log(user)
    });
})()

async function unfollow_stage(driver, XPATH_parent_element) {
    let unfollowed_users = []
    let indexer = 1

    while (true) {
        try {
            let XPATH_user = XPATH_parent_element + '/div[' + indexer + ']/div/div/div/div[2]/div[1]/div[1]/a/div/div[2]'
    
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

                    await sleep(100)

                    let XPATH_confirm_unfollow_button = '//*[@id="react-root"]/div/div/div[1]/div/div/div/div/div[2]/div[2]/div[3]/div[2]'
                    // Takibi bırakma onay butonuna erişim sağlanılıyor
                    let confirm_unfollow_button = await driver.findElement(By.xpath(XPATH_confirm_unfollow_button))

                    // Takibi bırakma onay butonuna tıklanılıyor
                    await confirm_unfollow_button.click()

                    console.log("Takipten çıkıldı: " + userScrappedText.split('\n')[0])

                    await sleep(100)
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
            console.log(error)

            if (await scroll_down_to_page(driver) === true) {
                return unfollowed_users
            }

            await sleep(250)
            
            indexer = 1
        }
    }
}

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