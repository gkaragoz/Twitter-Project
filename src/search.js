// Import selenium-webdriver
const { By, until } = require('selenium-webdriver')
// Import utils
const Utils = require('./utils')

async function go_to_search_in_last_tweets(driver, word) {
    let search_query = 'https://twitter.com/search?q=' + word + '&src=typed_query&f=live'
    console.log("Aranacak query oluşturuldu: " + search_query)

    console.log("Tarayıcı aramayı gerçekleştiriyor... (" + word + ")")
    // Redirect to searched page.
    await driver.get(search_query)
}

async function process_last_x_tweets(driver, options) {
    let XPATH_tweets_list = '//*[@id="react-root"]/div/div/div/main/div/div[2]/div/div[1]/div/div/div[2]/div/section/div/div/div'
    // Wait to loading of element.
    console.log("Tweetler listesi elementinin yüklenmesi bekleniyor...")
    await driver.wait(until.elementLocated(By.xpath(XPATH_tweets_list)), 10000)

    let indexer = 1
    let counter = 1

    while (true) {
        // Limit doldu. Daha fazla işlem yapma.
        if (counter > options.limit) {
            break
        }
        try {
            let XPATH_tweet = XPATH_tweets_list + '/div[' + indexer++ + ']'
            
            let tweet = {
                owner_username: await get_tweet_owner_username(driver, XPATH_tweet),
                created_date: await get_tweet_created_date(driver, XPATH_tweet),
                content: await get_tweet_content(driver, XPATH_tweet)
            }

            console.log("Tweeti atan kişi: " + JSON.stringify(tweet))
            
            if (options.follow === true) {
                
            }

            if (options.like === true) {
                await like_tweet(driver, XPATH_tweet)
            }

            counter++
        } catch (error) {
            if (error.name === 'NoSuchElementError') {
                console.log('NoSuchElementError: ' + 'Muhtemelen şuanki sayfadaki her tweeti inceledim...')
            } else {
                console.log('İncelenmesi gereken bir hata: ' + error)
            }

            if (await Utils.scroll_down_to_page(driver, 2000) === true) {
                return users
            }

            await Utils.sleep(250)
            
            indexer = 1
        }
    }
}

async function get_tweet_owner_username(driver, XPATH_tweet) {
    let XPATH_tweet_owner_username = XPATH_tweet + '/div/article/div/div[2]/div[2]/div[1]/div[1]/div[1]/a/div/div[2]/div/span'

    // Tweet'i atan kullanıcı adına erişim sağlanılıyor.
    let tweet_owner_username = await driver.findElement(By.xpath(XPATH_tweet_owner_username))
    let tweet_owner_username_text = await tweet_owner_username.getText()

    return tweet_owner_username_text
}

async function get_tweet_created_date(driver, XPATH_tweet) {
    let XPATH_tweet_created_date = XPATH_tweet + '/div/article/div/div[2]/div[2]/div[1]/div[1]/a'

    // Tweet'in oluşturulma tarihine erişim sağlanılıyor.
    let tweet_created_date = await driver.findElement(By.xpath(XPATH_tweet_created_date))
    return await tweet_created_date.getAttribute('title')
}

async function get_tweet_content(driver, XPATH_tweet) {
    let XPATH_tweet_content = XPATH_tweet + '/div/article/div/div[2]/div[2]/div[@lang="tr"]'

    // Tweet içeriği bölümüne erişiliyor...
    let tweet_content_element = await driver.findElement(By.xpath(XPATH_tweet_content))
    // Ayrı ayrı yer alan tweet içeriği toparlanıyor...
    let tweet_ugly_content_element_array = await tweet_content_element.findElements(By.xpath('.//span'))

    // İçerik birleştiriliyor...
    let tweet_single_content = ""
    for (let ii = 0; ii < tweet_ugly_content_element_array.length; ii++) {
        tweet_single_content += await tweet_ugly_content_element_array[ii].getText()
    }

    return tweet_single_content
}

async function like_tweet(driver, XPATH_tweet) {
    let XPATH_tweet_like = XPATH_tweet + '/div/article/div/div[2]/div[2]//*[@data-testid="like"]'
    // Like lanacak tweet'e erişim sağlanılıyor.
    let tweet_like = await driver.findElement(By.xpath(XPATH_tweet_like))

    tweet_like.click()
    console.log("Likeladım")
}

module.exports = {
    go_to_search_in_last_tweets: go_to_search_in_last_tweets,
    process_last_x_tweets: process_last_x_tweets
}