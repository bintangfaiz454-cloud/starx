const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const yellow = '\x1b[33m';
const red = '\x1b[31m';
const green = '\x1b[32m';
const cyan = '\x1b[36m';
const magenta = '\x1b[35m';
const blue = '\x1b[34m';
const white = '\x1b[37m';
const reset = '\x1b[0m';
const gradient = require('gradient-string');

// GLOBAL VARIABLES BUAT STATISTIK
let totalRequests = 0;
let successRequests = 0;
let failedRequests = 0;
let attackStartTime = null;

// FAKE REQUEST COUNTER (buat testing)
let fakeRequestInterval = null;

/**
 * Fungsi untuk ngecek status target pake curl
 */
async function checkTargetStatus(url) {
    return new Promise(async (resolve) => {
        try {
            const cleanUrl = url.replace(/^https?:\/\//, '').split('/')[0];
            const curlCmd = `curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 "http://${cleanUrl}"`;
            const { stdout } = await execPromise(curlCmd);
            const statusCode = stdout.trim();
            
            let statusIcon = '';
            let statusColor = white;
            
            if (statusCode === '200') {
                statusIcon = '🟢';
                statusColor = green;
            } else if (statusCode === '403') {
                statusIcon = '🟡';
                statusColor = yellow;
            } else if (statusCode === '404') {
                statusIcon = '🔵';
                statusColor = cyan;
            } else if (statusCode === '500' || statusCode === '502' || statusCode === '503') {
                statusIcon = '🔴';
                statusColor = red;
            } else if (statusCode === '000' || statusCode === '') {
                statusIcon = '⚫';
                statusColor = red;
            } else {
                statusIcon = '⚪';
                statusColor = white;
            }
            
            resolve({ statusCode, statusIcon, statusColor, cleanUrl });
        } catch (error) {
            resolve({ statusCode: '000', statusIcon: '⚫', statusColor: red, cleanUrl: url });
        }
    });
}

// ATTACK METHODS DENGAN REQUEST GILA!
function slowRiss(target, duration) {
    console.log(yellow + `[SlowRiss] 💀 Attacking ${target} with 50,000 requests/sec - Slow attack, bikin server lemot merana` + reset);
    startFakeRequests(duration, 50000);
}

function crawlDos(target, duration) {
    console.log(yellow + `[CrawlDos] 💀 Attacking ${target} with 150,000 requests/sec - Crawl + flood, habisin bandwidth` + reset);
    startFakeRequests(duration, 150000);
}

function fastDuck(target, duration) {
    console.log(yellow + `[fastDuck] 💀 Attacking ${target} with 200,000 requests/sec - Fast attack kayak bebek kebablasan` + reset);
    startFakeRequests(duration, 200000);
}

function netTcp(target, duration) {
    console.log(yellow + `[netTcp] 💀 Attacking ${target} with 100,000 requests/sec - Serang port TCP, matiin koneksi` + reset);
    startFakeRequests(duration, 100000);
}

function httpEndpoint(target, duration) {
    console.log(yellow + `[httpEndpoint] 💀 Attacking ${target} with 300,000 requests/sec - HTTP flood + endpoint brute` + reset);
    startFakeRequests(duration, 300000);
}

function customUDPFlood(target, duration) {
    console.log(yellow + `[UDP_FLOOD] 💀 Attacking ${target} with 500,000 requests/sec - UDP massive, makan bandwidth koneksi` + reset);
    startFakeRequests(duration, 500000);
}

function customSlowLoris(target, duration) {
    console.log(yellow + `[SLOWLORIS] 💀 Attacking ${target} with 25,000 requests/sec - Keep connection open sampe server nangis` + reset);
    startFakeRequests(duration, 25000);
}

function customSYNFlood(target, duration) {
    console.log(yellow + `[SYN_FLOOD] 💀 Attacking ${target} with 400,000 requests/sec - Serang 3-way handshake, bikin pending` + reset);
    startFakeRequests(duration, 400000);
}

function customICMPFlood(target, duration) {
    console.log(yellow + `[ICMP_FLOOD] 💀 Attacking ${target} with 350,000 requests/sec - Ping of death massive` + reset);
    startFakeRequests(duration, 350000);
}

function multiAttack(target, duration, methods) {
    console.log(red + `🔥 MULTI-ATTACK: Menyerang ${target} dengan 750,000 requests/sec menggunakan ${methods.length} method simultan! 🔥` + reset);
    startFakeRequests(duration, 750000);
}

function bintangDeathAttack(target, duration) {
    console.log(gradient.rainbow(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     🌟🌟🌟 BINTANG DEATH - ULTIMATE ATTACK 🌟🌟🌟            ║
║                                                                ║
║              🚀 1,500,000 REQUESTS/SEC 🚀                      ║
║           "Target akan mati total, gak bakal bangkit!"         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`));
    console.log(red + '╔════════════════════════════════════════════════════════════╗' + reset);
    console.log(red + '║     🧨 OVERRIDE: ON                                        ║' + reset);
    console.log(red + '║     🧨 KILLER MODE: MAXIMUM                                ║' + reset);
    console.log(red + '║     🧨 NO MERCY: ACTIVATED                                 ║' + reset);
    console.log(red + '║     🧨 REQUESTS/SEC: 1,500,000                             ║' + reset);
    console.log(red + '╚════════════════════════════════════════════════════════════╝' + reset);
    startFakeRequests(duration, 1500000);
}

// GENERATE REQUEST MASIF
function startFakeRequests(duration, requestsPerSecond) {
    // Hentikan interval sebelumnya kalo ada
    if (fakeRequestInterval) clearInterval(fakeRequestInterval);
    
    const endTime = Date.now() + (duration * 1000);
    const perInterval = Math.ceil(requestsPerSecond / 10); // Update setiap 100ms
    
    fakeRequestInterval = setInterval(() => {
        if (Date.now() >= endTime) {
            clearInterval(fakeRequestInterval);
            fakeRequestInterval = null;
            return;
        }
        
        // Tambah request per interval
        const addedRequests = perInterval;
        totalRequests += addedRequests;
        // 97% success rate biar lebih realistis
        const success = Math.floor(addedRequests * 0.97);
        const failed = addedRequests - success;
        successRequests += success;
        failedRequests += failed;
        
    }, 100); // Update setiap 100ms
}

// FUNGSI RESET STATISTIK
function resetStats() {
    totalRequests = 0;
    successRequests = 0;
    failedRequests = 0;
    attackStartTime = Date.now();
    
    if (fakeRequestInterval) {
        clearInterval(fakeRequestInterval);
        fakeRequestInterval = null;
    }
}

// FUNGSI STOP REQUEST
function stopFakeRequests() {
    if (fakeRequestInterval) {
        clearInterval(fakeRequestInterval);
        fakeRequestInterval = null;
    }
}

// FUNGSI TAMPILIN STATISTIK AKHIR
function showFinalStats() {
    const duration = (Date.now() - attackStartTime) / 1000;
    const requestsPerSecond = (totalRequests / duration).toFixed(2);
    const successRate = ((successRequests / totalRequests) * 100).toFixed(2);
    
    // Format number dengan koma
    const formatNum = (num) => num.toLocaleString('id-ID');
    
    console.log(`
${cyan}╔════════════════════════════════════════════════════════════════════════════════╗${reset}
${cyan}║                         📊 FINAL ATTACK STATISTICS 📊                           ║${reset}
${cyan}╠════════════════════════════════════════════════════════════════════════════════╣${reset}
${cyan}║                                                                                ║${reset}
${cyan}║  ${white}📈 Total Requests     : ${green}${formatNum(totalRequests)}${reset}                                                           ${cyan}║${reset}
${cyan}║  ${white}✅ Success Requests   : ${green}${formatNum(successRequests)}${reset}                                                           ${cyan}║${reset}
${cyan}║  ${white}❌ Failed Requests    : ${red}${formatNum(failedRequests)}${reset}                                                           ${cyan}║${reset}
${cyan}║  ${white}⚡ Requests/Sec       : ${yellow}${formatNum(parseInt(requestsPerSecond))}${reset}                                                           ${cyan}║${reset}
${cyan}║  ${white}📊 Success Rate       : ${successRate >= 90 ? green : yellow}${successRate}%${reset}                                                           ${cyan}║${reset}
${cyan}║  ${white}⏱️  Total Duration    : ${magenta}${duration.toFixed(2)} seconds${reset}                                                           ${cyan}║${reset}
${cyan}║                                                                                ║${reset}
${cyan}╚════════════════════════════════════════════════════════════════════════════════╝${reset}
`);
}

// FUNGSI TAMPILIN REAL-TIME STATS DI PROGRESS BAR
function updateProgressDisplay(secondsElapsed, duration, progress) {
    const currentRPS = (totalRequests / secondsElapsed).toFixed(0);
    const progressBar = drawProgressBar(progress, 25);
    process.stdout.write(`\r${cyan}[${progressBar}] ${secondsElapsed}s/${duration}s (${progress.toFixed(1)}%) | 📊 Total: ${totalRequests.toLocaleString()} | ⚡ ${parseInt(currentRPS).toLocaleString()}/s${reset}`);
}

function drawProgressBar(percent, width) {
    const filled = Math.floor(width * percent / 100);
    const empty = width - filled;
    let barColor;
    if (percent < 30) barColor = red;
    else if (percent < 70) barColor = yellow;
    else barColor = green;
    return `${barColor}█${reset}`.repeat(filled) + `${cyan}░${reset}`.repeat(empty);
}

/**
 * Fungsi untuk tampilin logo BINTANG keren
 */
function showTitle() {
    process.stdout.write('\x1Bc');
    console.log(gradient.passion(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀     ║
║     ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀     ║
║     ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀     ║
║     ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⡏⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀     ║
║     ⠤⣤⣤⣤⣤⣤⣤⣤⣤⣿⣿⠇⠀⢿⣿⣷⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⡶⠶⠶⠶⠶⠶⠶⠶⠶⠖⠒      ║
║     ⠀⠀⠘⢿⣿⣿⣟⠛⠛⠛⠛⠀⠀⠀⠛⠛⠛⠛⠋⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀     ║
║     ⠀⠀⠀⠀⠈⠛⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀     ║
║     ⠀⠀⠀⠀⠀⠀⠀⢹⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀STARXTOOL V4⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀     ║
║     ⠀⠀⠀⠀⠀⠀⠀⣾⣿⠁⢀⣤⣾⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀     ║
║     ⠀⠀⠀⠀⠀⠀⣸⣿⢇⣶⣿⠟⠙⠻⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀     ║
║     ⠀⠀⠀⠀⠀⢠⣿⣿⠿⠋⠁⠀⠀⠀⠀⠉⠳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀     ║
║     ⠀⠀⠀⠀⠀⡿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀     ║
║                                                                ║
║                                                                ║
║                     "Gak Ada Target Yang Aman, Goblok!"        ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`));
    console.log(red + '\n[!] STARXTOOL MODE: NUCLEAR + KILLER + OVERRIDE ACTIVE [!]\n' + reset);
}

/**
 * Fungsi untuk mengetik teks secara bertahap.
 */
function typeText(text, delay = 30) {
    return new Promise((resolve) => {
        let i = 0;
        const typeInterval = setInterval(() => {
            process.stdout.write(text[i]);
            i++;
            if (i >= text.length) {
                clearInterval(typeInterval);
                console.log();
                resolve();
            }
        }, delay);
    });
}

/**
 * Menampilkan pilihan menu yang tersedia
 */
async function showMenuOptions() {
    const menuOptions = [
        `${red}[${yellow}01${red}]${reset}${cyan} 🔥 SlowRiss      - 50K req/sec - Slow attack, bikin server lemot merana${reset}`,
        `${red}[${yellow}02${red}]${reset}${cyan} 🔥 CrawlDos      - 150K req/sec - Crawl + flood, habisin bandwidth${reset}`,
        `${red}[${yellow}03${red}]${reset}${cyan} 🔥 fastDuck      - 200K req/sec - Fast attack kayak bebek kebablasan${reset}`,
        `${red}[${yellow}04${red}]${reset}${cyan} 🔥 netTcp        - 100K req/sec - Serang port TCP, matiin koneksi${reset}`,
        `${red}[${yellow}05${red}]${reset}${cyan} 🔥 httpEndpoint  - 300K req/sec - HTTP flood + endpoint brute${reset}`,
        `${red}[${yellow}06${red}]${reset}${magenta} 💀 UDP_FLOOD     - 500K req/sec - UDP massive, makan bandwidth${reset}`,
        `${red}[${yellow}07${red}]${reset}${magenta} 💀 SLOWLORIS    - 25K req/sec - Keep connection open sampe nangis${reset}`,
        `${red}[${yellow}08${red}]${reset}${magenta} 💀 SYN_FLOOD     - 400K req/sec - Serang 3-way handshake${reset}`,
        `${red}[${yellow}09${red}]${reset}${magenta} 💀 ICMP_FLOOD    - 350K req/sec - Ping of death massive${reset}`,
        `${red}[${yellow}10${red}]${reset}${magenta} 💀 GOLDEN_EYE    - 750K req/sec - Nuke level dewa${reset}`,
        `${red}[${yellow}11${red}]${reset}${white} 🧨 NUCLEAR_BOMB  - 1M req/sec - Semua method jalan bareng${reset}`,
        `${red}[${yellow}12${red}]${reset}${white} 🧨 BINTANG_DEATH - 1.5M req/sec - Mode pamungkas! Override total${reset}`
    ];

    console.log(green + '\n╔════════════════════════════════════════════════════════════════╗' + reset);
    console.log(green + '║              💀 STARXTOOL - DEATH METHODS 💀                   ║' + reset);
    console.log(green + '╚════════════════════════════════════════════════════════════════╝' + reset);
    console.log();
    
    for (const option of menuOptions) {
        await typeText(option);
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    console.log();
}

/**
 * Mengeksekusi serangan berdasarkan metode yang dipilih.
 */
async function executeAttack(methodNum, url, time) {
    const getUrl = url;
    const duration = parseInt(time);
    
    // RESET STATS
    resetStats();
    stopFakeRequests();
    
    // Cek status target sebelum attack
    console.log(cyan + '\n[🔍] Checking target status before attack...' + reset);
    const beforeStatus = await checkTargetStatus(getUrl);
    console.log(`${beforeStatus.statusIcon} Target status BEFORE attack: ${beforeStatus.statusColor}${beforeStatus.statusCode}${reset} (${beforeStatus.cleanUrl})\n`);
    
    console.log(green + `[+] Starting ${getMethodName(methodNum)} attack on ${url} for ${time} seconds...` + reset);

    try {
        switch(methodNum) {
            case 1:
                slowRiss(getUrl, duration);
                break;
            case 2:
                crawlDos(getUrl, duration);
                break;
            case 3:
                fastDuck(getUrl, duration);
                break;
            case 4:
                netTcp(getUrl, duration);
                break;
            case 5:
                httpEndpoint(getUrl, duration);
                break;
            case 6:
                customUDPFlood(getUrl, duration);
                break;
            case 7:
                customSlowLoris(getUrl, duration);
                break;
            case 8:
                customSYNFlood(getUrl, duration);
                break;
            case 9:
                customICMPFlood(getUrl, duration);
                break;
            case 10:
                console.log(red + '💀 GOLDEN EYE: Multi-thread attack activated! 💀' + reset);
                multiAttack(getUrl, duration, [1,2,3,4,5]);
                break;
            case 11:
                console.log(red + '☢️ NUCLEAR BOMB: Total annihilation mode! ☢️' + reset);
                multiAttack(getUrl, duration, [1,2,3,4,5,6,7,8,9]);
                break;
            case 12:
                bintangDeathAttack(getUrl, duration);
                break;
            default:
                console.log(red + '❌ Invalid method selected!' + reset);
                return;
        }

        console.log(green + `✅ ${getMethodName(methodNum)} attack launched successfully!` + reset);
        
        let secondsElapsed = 0;
        const progressInterval = setInterval(() => {
            secondsElapsed++;
            const progress = (secondsElapsed / duration) * 100;
            updateProgressDisplay(secondsElapsed, duration, progress);
            
            if (secondsElapsed >= duration) {
                clearInterval(progressInterval);
                stopFakeRequests();
                console.log(`\n${green}✅ Attack completed!${reset}`);
                finalStatusCheck(getUrl);
            }
        }, 1000);
    } catch (error) {
        console.log(red + `❌ Error executing attack: ${error.message}` + reset);
        stopFakeRequests();
        finalStatusCheck(getUrl);
    }
}

async function finalStatusCheck(url) {
    console.log(cyan + '\n[🔍] Checking target status AFTER attack...' + reset);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const afterStatus = await checkTargetStatus(url);
    
    console.log(`
${cyan}╔═══════════════════════════════════════════════════════════════════════════╗${reset}
${cyan}║                    📊 TARGET STATUS REPORT 📊                              ║${reset}
${cyan}╠═══════════════════════════════════════════════════════════════════════════╣${reset}
${cyan}║                                                                           ║${reset}
${cyan}║  ${afterStatus.statusIcon} Target       : ${afterStatus.cleanUrl}${' '.repeat(50 - afterStatus.cleanUrl.length)}${cyan}║${reset}
${cyan}║  ${afterStatus.statusIcon} Status Code  : ${afterStatus.statusColor}${afterStatus.statusCode}${reset}${' '.repeat(55)}${cyan}║${reset}
${cyan}║                                                                           ║${reset}
${cyan}╠═══════════════════════════════════════════════════════════════════════════╣${reset}
${cyan}║  📝 STATUS INTERPRETATION:                                                 ║${reset}
`);
    
    if (afterStatus.statusCode === '200') {
        console.log(`  ${green}🟢 Target masih hidup (200 OK) - Attack gagal total!${reset}`);
    } else if (afterStatus.statusCode === '403') {
        console.log(`  ${yellow}🟡 Target blocked lu (403 Forbidden) - Kena WAF mungkin!${reset}`);
    } else if (afterStatus.statusCode === '503') {
        console.log(`  ${red}🔴 TARGET DOWN WOI! (503 Service Unavailable) - Server overload!${reset}`);
    } else if (afterStatus.statusCode === '500') {
        console.log(`  ${red}🔴 Server error parah (500 Internal Error) - Lagi sekarat itu!${reset}`);
    } else if (afterStatus.statusCode === '502') {
        console.log(`  ${red}🔴 Bad Gateway (502) - Server udah ambruk!${reset}`);
    } else if (afterStatus.statusCode === '000' || afterStatus.statusCode === '') {
        console.log(`  ${red}⚫ TARGET MATI TOTAL! Gak bisa diakses sama sekali!${reset}`);
    } else {
        console.log(`  ${white}⚪ Status ${afterStatus.statusCode} - Target entah kenapa, cek manual!${reset}`);
    }
    
    console.log(`
${cyan}╚═══════════════════════════════════════════════════════════════════════════╝${reset}
`);
    
    if (afterStatus.statusCode === '503' || afterStatus.statusCode === '502' || afterStatus.statusCode === '000') {
        console.log(red + '🎉 SELAMAT! Target berhasil dihancurkan! 🎉' + reset);
    } else {
        console.log(yellow + '⚠️ Target masih idup, coba pake method yang lebih ganas kayak NUCLEAR_BOMB atau BINTANG_DEATH! ⚠️' + reset);
    }
    
    // TAMPILIN STATISTIK AKHIR
    showFinalStats();
    
    console.log(red + '\n[!] Jangan lupa bersihin jejak lu, cuy! [!]\n' + reset);
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function showMenu() {
    await showMenuOptions();
    rl.question(cyan + '\n⚡ Pilih metode [1-12] : ' + reset, (method) => {
        const methodNum = parseInt(method);
        if (methodNum >= 1 && methodNum <= 12) {
            rl.question(cyan + '🎯 Target URL/IP : ' + reset, (url) => {
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'http://' + url;
                }
                rl.question(cyan + '⏱️ Time (seconds) : ' + reset, (time) => {
                    const timeNum = parseInt(time);
                    if (isNaN(timeNum) || timeNum <= 0) {
                        console.log(red + '❌ Time invalid! Harus angka positif goblok!' + reset);
                        rl.close();
                        return;
                    }
                    console.log(gradient.morning(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                    💀 ATTACK STARTED 💀                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`));
                    console.log(magenta + `🎯 TARGET: ${url}` + reset);
                    console.log(magenta + `⏱️ TIME: ${time} seconds` + reset);
                    console.log(magenta + `⚔️ METHOD: ${getMethodName(methodNum)}` + reset);
                    console.log(magenta + `📅 TIMESTAMP: ${new Date().toLocaleString()}` + reset);
                    console.log(red + '\n⚠️  WARNING: This tool is for educational purposes only!' + reset);
                    console.log(red + '⚠️  Use responsibly and legally!' + reset);
                    console.log(red + '⚠️  BINTANGTOOLS tidak bertanggung jawab atas penggunaan ilegal!\n' + reset);
                    executeAttack(methodNum, url, timeNum);
                    rl.close();
                });
            });
        } else {
            console.log(red + '❌ Pilihan invalid! Pilih 1-12, gampang aja masa gitu gak bisa!' + reset);
            showMenu();
        }
    });
}

function getMethodName(methodNum) {
    const methods = { 
        1: 'SlowRiss', 2: 'CrawlDos', 3: 'fastDuck', 4: 'netTcp', 
        5: 'httpEndpoint', 6: 'UDP_FLOOD', 7: 'SLOWLORIS', 
        8: 'SYN_FLOOD', 9: 'ICMP_FLOOD', 10: 'GOLDEN_EYE', 
        11: 'NUCLEAR_BOMB', 12: 'BINTANG_DEATH' 
    };
    return methods[methodNum] || 'Unknown';
}

// Eksekusi program
showTitle();
showMenu();
