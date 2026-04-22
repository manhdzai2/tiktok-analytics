const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());
process.stdout.setDefaultEncoding('utf8');

async function findChrome() {
    const paths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
    ];
    for (const path of paths) {
        if (fs.existsSync(path)) return path;
    }
    return null;
}

function parseAbbreviatedNumber(str) {
    if (!str) return 0;
    const cleanStr = str.replace(/[^0-9.KM]/g, '');
    let num = parseFloat(cleanStr);
    if (cleanStr.includes('K')) num *= 1000;
    else if (cleanStr.includes('M')) num *= 1000000;
    return Math.floor(num);
}

async function scrape(url) {
    const chromePath = await findChrome();
    if (!chromePath) process.exit(1);
 
    const browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: "new",
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
        ]
    });
 
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 1000 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 3000));
 
        // Scroll and collect all videos to find Newest, Oldest, and Most Viewed
        const initialData = await page.evaluate(async (parseFnStr) => {
            const parseFn = new Function('return ' + parseFnStr)();
            const hydration = document.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__')?.textContent;
            
            let lastHeight = document.body.scrollHeight;
            let scrollAttempts = 0;
            const maxAttempts = 100; // Limit to ~1200+ videos for safety/speed
            
            while (scrollAttempts < maxAttempts) {
                window.scrollTo(0, document.body.scrollHeight);
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                let newHeight = document.body.scrollHeight;
                if (newHeight === lastHeight) {
                    // Try one more scroll after longer wait
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    newHeight = document.body.scrollHeight;
                    if (newHeight === lastHeight) break;
                }
                lastHeight = newHeight;
                scrollAttempts++;
            }
 
            const containers = Array.from(document.querySelectorAll('div[data-e2e="user-post-item"]'));
            if (containers.length === 0) return { hydration, videoLinks: [] };
 
            const items = containers.map(c => {
                const link = c.querySelector('a')?.href;
                const viewText = c.querySelector('strong[data-e2e="video-views"]')?.textContent;
                return { link, views: parseFn(viewText) || 0 };
            }).filter(i => i.link);
 
            if (items.length === 0) return { hydration, videoLinks: [] };
 
            const newest = items[0].link;
            const oldest = items[items.length - 1].link;
            const mostViewed = [...items].sort((a, b) => b.views - a.views)[0].link;
 
            return {
                hydration: hydration,
                videoLinks: [...new Set([newest, oldest, mostViewed])]
            };
        }, parseAbbreviatedNumber.toString());
 
        const detailedVideos = [];
        for (const videoUrl of initialData.videoLinks) {
            try {
                await page.goto(videoUrl, { waitUntil: 'networkidle2', timeout: 30000 });
                await new Promise(r => setTimeout(r, 2000));
 
                const videoInfo = await page.evaluate((parseFnStr) => {
                    const parseFn = new Function('return ' + parseFnStr)();
                    const script = document.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__')?.textContent;
                    
                    if (script) {
                        try {
                            const json = JSON.parse(script);
                            const item = json['__DEFAULT_SCOPE__']?.['webapp.video-detail']?.itemInfo?.itemStruct || {};
                            return {
                                id: item.id,
                                desc: item.desc,
                                thumb: item.video?.cover,
                                views: item.stats?.playCount || 0,
                                likes: item.stats?.diggCount || 0,
                                comments: item.stats?.commentCount || 0,
                                shares: item.stats?.shareCount || 0,
                                createTime: item.createTime,
                                success: true
                            };
                        } catch(e) {}
                    }
                    
                    return {
                        id: window.location.pathname.split('/video/')[1]?.split('?')[0],
                        likes: parseFn(document.querySelector('strong[data-e2e="like-count"]')?.textContent),
                        createTime: null,
                        success: false
                    };
                }, parseAbbreviatedNumber.toString());
                
                if (videoInfo.id) detailedVideos.push(videoInfo);
            } catch (e) {}
        }
 
        console.log(JSON.stringify({
            hydration: initialData.hydration,
            domVideos: detailedVideos
        }));
    } catch (error) {
    } finally {
        await browser.close();
    }
}
 
const url = process.argv[2];
if (url) scrape(url);
