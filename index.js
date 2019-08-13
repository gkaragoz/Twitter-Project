console.log("Selenium kütüphanesi dahil ediliyor...");
// Import selenium-webdriver
const { Builder, By, until } = require('selenium-webdriver')
const Login = require('./src/login')
const Profile = require('./src/profile')
const Config = require('./config')
const Following = require('./src/following')

console.log("Program başlatılıyor...");
// Create a async browser
(async function Main() {
    console.log("Bir tarayıcı başlatılıyor...")
    // Open browser
    let driver = await new Builder().forBrowser('firefox').build()

    console.log("\nFAZ 1: Giriş başlatılıyor")
    // Phase 1: LOGIN
    await Login.login(driver)

    console.log("\nFAZ 2: Profil sayfası")
    // Phase 2: GO TO PROFILE PAGE
    await Profile.go_to_profile_page(driver)

    console.log("\nFAZ 3: Kaç adet kullanıcı takip ediliyor?")
    // Phase 3: GET HOW MANY FOLLOWING USERS COUNT
    let following_count = await Profile.get_followings_count(driver)
    console.log("-->" + Config.username + " " + following_count + " kişiyi takip ediyor.")

    console.log("\nFAZ 4: Takip edilenler sayfası")
    // Phase 4: GO TO FOLLOWING PAGE
    await Profile.go_to_following_page(driver)

    console.log("\nFAZ 5: Kimler beni takip etmiyor? Yok et onları!")
    // Phase 5: Unfollow who is not following my user.
    await Following.unfollow(driver)

    console.log("unfollowed users: ")
    Following.get_unfollowed_users.forEach(user => {
        console.log(user)
    });
})()