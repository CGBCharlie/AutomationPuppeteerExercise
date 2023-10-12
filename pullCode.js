const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch(
        {
            headless: false,
            defaultViewport: false
        }
    );
    const page = await browser.newPage();
    await page.goto('https://trello.com/b/QvHVksDa/personal-work-goals');

    await page.waitForSelector('xpath///*[@id="layer-manager-overlay"]/div/div/div/div/div[2]/div[4]/button');
    await page.click('xpath///*[@id="layer-manager-overlay"]/div/div/div/div/div[2]/div[4]/button');

    const taskHandles = await page.$$('div.list.js-list-content');
    const tasks = [];
    for (const taskHandle of taskHandles) {
        const numChildElements = await taskHandle.$$eval('a > div.list-card-details.js-card-details > span', elements => elements.length);

        for (let n = 1; n <= numChildElements; n++) {
            const title = await page.evaluate((taskHandle, n) => {
                const childElement = taskHandle.querySelector(`a:nth-child(${n}) > div.list-card-details.js-card-details > span`);
                return childElement ? childElement.textContent : null;
            }, taskHandle, n);

            tasks.push(title.replace(/^#\d+/, '').trim());
        }
    }

    // await browser.close()
    const todoistLoginURL = 'https://todoist.com/users/showlogin';

    await page.goto(todoistLoginURL);

    // Replace with your Todoist login credentials
    const username = 'cgbcarlosgarcia@gmail.com';
    const password = 'qwertyuiop123';

    await page.waitForSelector('#element-0');
    await page.type('#element-0', username);
    await page.type('#element-3', password);

    await page.click('.F9gvIPl.rWfXb_e._8313bd46._7a4dbd5f._95951888._2a3b75a1._8c75067a');

    await page.waitForSelector('button.plus_add_button');
    // console.log(tasks);
    for (let t = 0; t < Math.min(5, tasks.length); t++) {

        await page.keyboard.press('q');
        await page.waitForSelector('p.is-empty.is-editor-empty');
    
        await page.keyboard.type(tasks[t]);
        // console.log(tasks[t]);
        await page.waitForTimeout(500);
    
        await page.keyboard.press('Enter');

        await page.waitForTimeout(500);
    }
})();
