console.log("Selenium kütüphanesi dahil ediliyor...");
// Import selenium-webdriver
const { Builder, By, until } = require('selenium-webdriver')
const Login = require('./src/login')
const Profile = require('./src/profile')
const Config = require('./config')
const Following = require('./src/following')

const Readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log("Program başlatılıyor...");
// Create a async browser
(async function Main() {
    console.log("Bir tarayıcı başlatılıyor...")
    // Open browser
    let driver = await new Builder().forBrowser('firefox').build()

    console.log("\nGiriş başlatılıyor")
    // LOGIN
    await Login.login(driver)

    console.log("\nProfil sayfası")
    // GO TO PROFILE PAGE
    await Profile.go_to_profile_page(driver)

    console.log("\nKaç adet kullanıcı takip ediliyor?")
    // GET HOW MANY FOLLOWING USERS COUNT
    let following_count = await Profile.get_followings_count(driver)
    console.log("-->" + Config.username + " " + following_count + " kişiyi takip ediyor.")

    console.log("\nKaç adet kullanıcı takipçim var?")
    // GET HOW MANY FOLLOWERS USER COUNT
    let followers_count = await Profile.get_followers_count(driver)
    console.log("-->" + Config.username + " " + followers_count + " kişi takipçisi var.")

    let input = undefined
    Readline.question(`(1)Beni takip etmeyenlerden kurtul\n(2)Beni takip edenlerden takip etmediklerimi takip et`, (option) => {
        console.log(`${option} numaralı seçeneği seçtiniz!`)

        if (option === '1') {
            unfollow_who_does_not_follow_me(driver)
        } else if (option === '2') {
            follow_who_follow_me(driver)
            input == undefined
        } else {
            console.log('Yanlış seçim yaptınız.')
            input == undefined
        }

        Readline.close()
    })
    
    console.log("unfollowed users: ")
    Following.get_unfollowed_users.forEach(user => {
        console.log(user)
    });
})()

async function unfollow_who_does_not_follow_me(driver) {
    console.log("\nTakip edilenler sayfası")
    // GO TO FOLLOWING PAGE
    await Profile.go_to_following_page(driver)

    console.log("\nKimler beni takip etmiyor? Yok et onları!")
    // Unfollow who is not following my user.
    await Following.unfollow(driver)
}

async function follow_who_follow_me(driver) {
    console.log("\nTakip edenler sayfası")
    // GO TO FOLLOWERS PAGE
    await Profile.go_to_followers_page(driver)

    console.log("\nKimler beni takip ediyor? Takip etmiyorsam hemen takip et!")
    // Follow who is following me.
    await Following.follow(driver)
}