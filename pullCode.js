const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch(
        {
            headless: false,
            defaultViewport: false
        }
    );
    const page = await browser.newPage();
    // connects to the trello tasks
    await page.goto('https://trello.com/b/QvHVksDa/personal-work-goals');

    // clicks on the first popup to close it
    await page.waitForSelector('xpath///*[@id="layer-manager-overlay"]/div/div/div/div/div[2]/div[4]/button');
    await page.click('xpath///*[@id="layer-manager-overlay"]/div/div/div/div/div[2]/div[4]/button');

    // this loops through all different tasks lists and saves all tasks to an array called tasks
    const taskHandles = await page.$$('div.list.js-list-content');
    const tasks = [];
    // loops through tasks lists
    for (const taskHandle of taskHandles) {
        const numChildElements = await taskHandle.$$eval('a > div.list-card-details.js-card-details > span', elements => elements.length);

        // loops through all tasks in every tasklist
        for (let n = 1; n <= numChildElements; n++) {
            const title = await page.evaluate((taskHandle, n) => {
                const childElement = taskHandle.querySelector(`a:nth-child(${n}) > div.list-card-details.js-card-details > span`);
                return childElement ? childElement.textContent : null;
            }, taskHandle, n);

            // pushes to tasks, removing a # and a number obtained extracting the html doc which is not part of the task
            tasks.push(title.replace(/^#\d+/, '').trim());
        }
    }

    
    const todoistLoginURL = 'https://todoist.com/users/showlogin';

    await page.goto(todoistLoginURL);

    // Logs into a Test Todoist account
    // Replace with your Todoist login credentials
    const username = 'cgbcarlosgarcia@gmail.com';
    const password = 'qwertyuiop123';

    // waits until proper login credentials can be typed
    await page.waitForSelector('#element-0');
    await page.type('#element-0', username);
    await page.type('#element-3', password);

    // clicks login
    await page.click('.F9gvIPl.rWfXb_e._8313bd46._7a4dbd5f._95951888._2a3b75a1._8c75067a');

    await page.waitForSelector('button.plus_add_button');
    
    // change to how many tasks you want to be inserted, if its more that existing it will log all
    let n = 5;
    // inserts task by task in the Todoist account
    for (let t = 0; t < Math.min(n, tasks.length); t++) {

        await page.keyboard.press('q');
        await page.waitForSelector('p.is-empty.is-editor-empty');
    
        await page.keyboard.type(tasks[t]);
        
        await page.waitForTimeout(500);
    
        await page.keyboard.press('Enter');

        await page.waitForTimeout(500);
    }

    await page.waitForTimeout(500);

    // page will close at the end of the automation, 
    // if you want to see your list of tasks just log into the account
    await browser.close();
})();
