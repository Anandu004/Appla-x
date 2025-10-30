
//selecting date from calender -for issue date

async function selectPastDate(page, daysBefore = 1) {

    const today = new Date()
    const targetDate = new Date()
    targetDate.setDate(today.getDate() - daysBefore)

    const targetDay = targetDate.getDate()
    const targetMonth = targetDate.toLocaleString('default', { month: 'long' })
    const targetYear = targetDate.getFullYear()

    const monthYearLocator = page.locator('.caleran-title:visible')
    await monthYearLocator.waitFor({ state: 'visible' })

    const prevButtonLocator = page.locator('//body[1]/div[15]/div[2]/div[2]/div[1]/div[1]/div[1]/i[1]')

    let found = false;
    for (let i = 0; i < 12; i++) {
        const visibleMonthYear = await monthYearLocator.textContent();
        if (visibleMonthYear.includes(targetMonth) && visibleMonthYear.includes(targetYear.toString())) {
            found = true
            break
        }
        await prevButtonLocator.click()
        await page.waitForTimeout(300)
    }

    if (!found) {
        throw new Error(`Could not find calendar month for ${targetMonth} ${targetYear}`)
    }

    const dateLocator = page.locator('.caleran-calendar:visible')
                            .locator(`.caleran-day:not(.caleran-disabled):not(.caleran-not-in-month):has-text("${targetDay}")`)
                            .first()

    await dateLocator.waitFor({ state: 'visible' })
    await dateLocator.click({ force: true })
}


//expiry date

async function selectFutureDate(page) {


    // Step 1: Get all visible days for that month (excluding disabled days)
    const visibleDays = page.locator(
        '.caleran-calendar:visible .caleran-day:not(.caleran-disabled):not(.caleran-not-in-month)'
    );

    const totalDays = await visibleDays.count()
    if (totalDays === 0) {
        throw new Error(' No selectable days found in the visible calendar.')
    }

    // Step 2: Pick a random date
    const randomIndex = Math.floor(Math.random() * totalDays)
    const randomDay = visibleDays.nth(randomIndex)

    // Step 3: Click it
    await randomDay.scrollIntoViewIfNeeded()
    await randomDay.click({ force: true })

    // Optional: log which one was clicked
    //const selectedText = await randomDay.textContent()
    //console.log(` Selected random visible date: ${selectedText}`)
}



module.exports = { selectPastDate, selectFutureDate }
