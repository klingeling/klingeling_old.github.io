/*******************************************************************************

    locals.js - 搭配用户脚本插件`18xx 中文化插件`的页面匹配规则, 翻译忽略规则,
                词条库文件
*/
var I18N = {};

I18N.conf = {
    /**
     * 匹配 pathname 页面的正则
     *
     * 注册页面 /signup
     * 导入仓库 /new/import
     * ...
     */
    rePagePath: /^\/($|profile|about|game|tutorial|new_game|hotseat|signup|login)/,

    /**
     * 忽略区域的 class 正则
     *
     * 代码编辑器 内容 代码高亮 CodeMirror
     * 代码高亮 blob-code
     * 仓库名和用户名 repo-and-owner (已知出现在：应用安装授权页和设置页 选定仓库)
     * 文件,目录位置栏 |js-path-segment|final-path
     * 文件列表 files js-navigation-container js-active-navigation-container
     * 评论内容等 js-comment-body
     * 评论编辑区域 comment-form-textarea
     * 文件搜索模式 js-tree-finder-virtual-filter
     * 仓库文件列表 js-navigation-open Link--primary
     * 快捷键 按键 js-modifier-key
     * 洞察-->流量-->热门内容列表 capped-list-label
     * realease 页面 描述主体 markdown-body my-3
     * f4 my-3
     * 仓库页 用户名/仓库名 标题 AppHeader-globalBar-start 新版全局导航
     * 提交的用户名 commit-author
     * 搜索页 搜索结果 search-match
     */
    reIgnoreClass: /(CodeMirror|blob-code|highlight-.*|repo-and-owner|js-path-segment|final-path|files js-navigation-container|js-comment-body|comment-form-textarea|markdown-title|js-tree-finder-virtual-filter|js-navigation-open Link--primary|js-modifier-key|capped-list-label|blob-code blob-code-inner js-file-line|pl-token|Link--primary no-underline text-bold|markdown-body my-3|f4 my-3|react-code-text|react-file-line|AppHeader-globalBar-start|commit-author|search-match)/,

    /**
     * 忽略区域的 itemprop 属性正则
     * name 列表页 仓库名
     * author 仓库页 作者名称
     * additionalName 个人主页 附加名称
     */
    reIgnoreItemprop: /(name|author|description|text|additionalName)/,

    /**
     * 忽略区域的 特定元素id 正则
     * offset /blob页面 符号-->引用
     */
    reIgnoreId: /(readme|offset)/,

    /**
     * 忽略区域的 标签 正则
     * /i 规则不区分大小写
     */
    reIgnoreTag: /(^CODE$|^SCRIPT$|^STYLE$|LINK|IMG|MARKED-TEXT|^PRE$|KBD)/,
    // marked-text --> 文件搜索模式/<user-name>/<repo-name>/find/<branch> 文件列表条目
    // ^script$ --> 避免勿过滤 notifications-list-subscription-form
    // ^pre$ --> 避免勿过滤
};

I18N.zh = {};

I18N.zh["title"] = { // 标题翻译
    "static": { // 静态翻译
    },
    "regexp": [ // 正则翻译
        [/18Chesapeake/, "18切萨皮克"],
    ],
};

I18N.zh["pubilc"] = { // 公共区域翻译
    "static": { // 静态翻译
        //
        "welcome!": "欢迎！",
        "welcome klingeling!": "欢迎 klingeling！",
    },
    "regexp": [ // 正则翻译
        /**
           * 匹配时间格式
           *
           * 月 日 或 月 日, 年
           * Mar 19, 2015 – Mar 19, 2016
           * January 26 – March 19
           * March 26
           *
           * 不知道是否稳定, 暂时先试用着. 2016-03-19 20:46:45
           *
           * 更新于 2021-10-04 15:19:18
           * 增加 带介词 on 的格式，on 翻译不体现
           * on Mar 19, 2015
           * on March 26
           *
           * 更新于 2021-10-10 13:44:36
           * on 星期(简写), 月 日 年  // 个人访问令牌 有效期
           * on Tue, Nov 9 2021
           *
           * 2021-10-19 12:04:19 融合更多规则
           *
           * 4 Sep
           * 30 Dec 2020
           *
           * on 4 Sep
           * on 30 Dec 2020
           *
           * 2021-11-22 12:51:57 新增 格式
           *
           * 星期(全称), 月 日, 年 // 仓库-->洞察-->流量 图示标识
           * Sunday, November 14, 2021
           *
           * Tip:
           * 正则中的 ?? 前面的字符 重复0次或1次
           * 正则中的 ?: 非捕获符号(即关闭圆括号的捕获能力) 使用方法 (?: 匹配规则) -->该匹配不会被捕获 为 $数字
           */
        // [/(?:on |)(?:(\d{1,2}) |)(?:(Sun(?:day)?|Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?), |)(?:(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May(?:)??|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:,? |$))(\d{4}|)(\d{1,2}|)(?:,? (\d{4})|)/g, function (all, date1, week, month, year1, date2, year2) {
        //     var weekKey = {
        //         "Sun": "周日",
        //         "Mon": "周一",
        //         "Tue": "周二",
        //         "Wed": "周三",
        //         "Thu": "周四",
        //         "Fri": "周五",
        //         "Sat": "周六",
        //     };
        //     var monthKey = {
        //         "Jan": "1月",
        //         "Feb": "2月",
        //         "Mar": "3月",
        //         "Apr": "4月",
        //         "May": "5月",
        //         "Jun": "6月",
        //         "Jul": "7月",
        //         "Aug": "8月",
        //         "Sep": "9月",
        //         "Oct": "10月",
        //         "Nov": "11月",
        //         "Dec": "12月"
        //     };
        //     var date = date1 ? date1 : date2;
        //     var year = year1 ? year1 : year2;
        //     return (year ? year + '年' : '') + monthKey[month.substring(0, 3)] + (date ? date + '日' : '') + (week ? ', ' + weekKey[week.substring(0, 3)] : '');
        // }],
        /**
         * 相对时间格式处理
         *
         * 更新于 2021-11-21 16:47:14
         * 1. 添加 前缀词
         *    over xxx ago // 里程碑页面 最后更新时间
         *    about xxx ago // 里程碑页面 最后更新时间
         *    almost xxx ago // 里程碑页面 最后更新时间
         *    less than xxx ago // 导出帐户数据
         * 2. xxx之内的相对时间格式
         *  in 6 minutes // 拉取请求页面
         *
         * 更新于 2021-11-22 11:54:30
         * 1. 修复 Bug: 意外的扩大了匹配范围(不带前缀与后缀的时间) 干扰了带有相对时间的其他规则
         *  7 months
         */
        // [/^just now|^now|^last month|^yesterday|(?:(over|about|almost|in) |)(an?|\d+)(?: |)(second|minute|hour|day|month|year)s?( ago|)/, function (all, prefix, count, unit, suffix) {
        //     if (all === 'now') {
        //         return '现在';
        //     }
        //     if (all === 'just now') {
        //         return '刚刚';
        //     }
        //     if (all === 'last month') {
        //         return '上个月';
        //     }
        //     if (all === 'yesterday') {
        //         return '昨天';
        //     }
        //     if (count[0] === 'a') {
        //         count = '1';
        //     } // a, an 修改为 1

        //     var unitKey = { second: '秒', minute: '分钟', hour: '小时', day: '天', month: '个月', year: '年' };

        //     if (suffix) {
        //         return (prefix === 'about' || prefix === 'almost' ? '大约 ' : prefix === 'less than' ? '不到 ' : '') + count + ' ' + unitKey[unit] + (prefix === 'over' ? '多之前' : '之前');
        //     } else {
        //         return count + ' ' + unitKey[unit] + (prefix === 'in' ? '之内' : '之前');
        //     }
        // }],
        /**
         * 匹配时间格式 2
         *
         * in 5m 20s
         */
        // [/^(?:(in) |)(?:(\d+)m |)(\d+)s/, function (all, prefix, minute, second) {
        //     all = minute ? minute + '分' + second + '秒' : second + '秒';
        //     return (prefix ? all + '之内' : all);
        // }],
    ],
    "time-regexp": [ // 时间正则翻译专项
        //     /**
        //      * 匹配时间格式
        //      *
        //      * 月 日 或 月 日, 年
        //      * Mar 19, 2015 – Mar 19, 2016
        //      * January 26 – March 19
        //      * March 26
        //      *
        //      * 不知道是否稳定, 暂时先试用着. 2016-03-19 20:46:45
        //      *
        //      * 更新于 2021-10-04 15:19:18
        //      * 增加 带介词 on 的格式，on 翻译不体现
        //      * on Mar 19, 2015
        //      * on March 26
        //      *
        //      * 更新于 2021-10-10 13:44:36
        //      * on 星期(简写), 月 日 年  // 个人访问令牌 有效期
        //      * on Tue, Nov 9 2021
        //      *
        //      * 2021-10-19 12:04:19 融合更多规则
        //      *
        //      * 4 Sep
        //      * 30 Dec 2020
        //      *
        //      * on 4 Sep
        //      * on 30 Dec 2020
        //      *
        //      * 2021-11-22 12:51:57 新增 格式
        //      *
        //      * 星期(全称), 月 日, 年 // 仓库-->洞察-->流量 图示标识
        //      * Sunday, November 14, 2021
        //      *
        //      * Tip:
        //      * 正则中的 ?? 前面的字符 重复0次或1次
        //      * 正则中的 ?: 非捕获符号(即关闭圆括号的捕获能力) 使用方法 (?: 匹配规则) -->该匹配不会被捕获 为 $数字
        //      */
        //     [/(?:on |)(?:(\d{1,2}) |)(?:(Sun(?:day)?|Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?), |)(?:(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May(?:)??|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:,? |$))(\d{4}|)(\d{1,2}|)(?:,? (\d{4})|)/g, function (all, date1, week, month, year1, date2, year2) {
        //         var weekKey = {
        //             "Sun": "周日",
        //             "Mon": "周一",
        //             "Tue": "周二",
        //             "Wed": "周三",
        //             "Thu": "周四",
        //             "Fri": "周五",
        //             "Sat": "周六",
        //         };
        //         var monthKey = {
        //             "Jan": "1月",
        //             "Feb": "2月",
        //             "Mar": "3月",
        //             "Apr": "4月",
        //             "May": "5月",
        //             "Jun": "6月",
        //             "Jul": "7月",
        //             "Aug": "8月",
        //             "Sep": "9月",
        //             "Oct": "10月",
        //             "Nov": "11月",
        //             "Dec": "12月"
        //         };
        //         var date = date1 ? date1 : date2;
        //         var year = year1 ? year1 : year2;
        //         return (year ? year + '年' : '') + monthKey[month.substring(0, 3)] + (date ? date + '日' : '') + (week ? ', ' + weekKey[week.substring(0, 3)] : '');
        //     }],
        //     /**
        //      * 相对时间格式处理
        //      *
        //      * 更新于 2021-11-21 16:47:14
        //      * 1. 添加 前缀词
        //      *    over xxx ago // 里程碑页面 最后更新时间
        //      *    about xxx ago // 里程碑页面 最后更新时间
        //      *    almost xxx ago // 里程碑页面 最后更新时间
        //      *    less than xxx ago // 导出帐户数据
        //      * 2. xxx之内的相对时间格式
        //      *  in 6 minutes // 拉取请求页面
        //      *
        //      * 更新于 2021-11-22 11:54:30
        //      * 1. 修复 Bug: 意外的扩大了匹配范围(不带前缀与后缀的时间) 干扰了带有相对时间的其他规则
        //      *  7 months
        //      */
        //     [/^just now|^now|^last year|^last month|^last week|^yesterday|(?:(over|about|almost|in) |)(an?|\d+)(?: |)(second|minute|hour|day|month|year|week)s?( ago|)/, function (all, prefix, count, unit, suffix) {
        //         if (all === 'now') {
        //             return '现在';
        //         }
        //         if (all === 'just now') {
        //             return '刚刚';
        //         }
        //         if (all === 'last year') {
        //             return '最近 1 年';
        //         }
        //         if (all === 'last month') {
        //             return '上个月';
        //         }
        //         if (all === 'last week') {
        //             return '上周';
        //         }
        //         if (all === 'yesterday') {
        //             return '昨天';
        //         }
        //         if (count[0] === 'a') {
        //             count = '1';
        //         } // a, an 修改为 1

        //         var unitKey = { second: '秒', minute: '分钟', hour: '小时', day: '天', month: '个月', year: '年', week: '周' };

        //         if (suffix) {
        //             return (prefix === 'about' || prefix === 'almost' ? '大约 ' : prefix === 'less than' ? '不到 ' : '') + count + ' ' + unitKey[unit] + (prefix === 'over' ? '多之前' : '之前');
        //         } else {
        //             return count + ' ' + unitKey[unit] + (prefix === 'in' ? '之内' : '之前');
        //         }
        //     }],
        //     [/(\d+)(h|d|w|m)/, function (all, count, suffix) {
        //         var suffixKey = { h: '小时', d: '天', w: '周', m: '个月' };

        //         return count + ' ' + suffixKey[suffix] + '之前';
        //     }],
    ],
    "selector": [ // 元素筛选器规则
        ["a[aria-label='Pull requests you created']", "拉取请求"], // 顶部条 拉取请求
    ],
};

I18N.zh["profile"] = { // 个人资料翻译
    "static": { // 静态翻译
        "About": "关于",
        "Signup": "注册",
        "Login": "登录",
        "Profile Settings": "个人配置",
        "User Name": "用户名",
        "Email": "邮箱",
        "password": "密码",
        "forgot password": "忘记密码",
        "Notifications": "通知",
        "Learn about Notifications": "了解通知",
        "Turn/Message Notifications": "回合/消息通知方式",
        "None": "无",
        "Statistics": "统计",
        "Show Individual Statistics on Profile Page": "在配置文件页面上显示个人统计信息",
        "Display": "显示",
        "Red 18xx.games Logo": "红色18xx.games标志",
        "Main Background": "主背景",
        "Main Font Color": "主字体颜色",
        "Alternative Background": "备选背景",
        "Alternative Font Color": "备选字体颜色",
        "Your Turn": "你的回合",
        "Hotseat Game": "热座游戏",
        "Map & Tile Colors": "地图和板块颜色",
        "Routes, Trains & Players": "线路，火车和玩家",
        "Color": "颜色",
        "Width": "宽度",
        "Dash": "虚线",
        "Save Changes": "保存更改",
        "Reset to Defaults": "重置为默认值",
        "Logout": "登出",
        "Delete Account and All Data": "删除账户和所有数据",
        "Type DELETE to confirm": "键入 DELETE 进行确认",
        "Your Statistics": "你的统计数据",
        "Game": "游戏",
        "Elo Rating": "Elo 等级分",
        "Number of Plays": "游玩次数",
        "Overall": "总计",
        "* Updated daily. Only fully completed games are eligible.": "* 每日更新。只有完全完成的游戏才被统计。",
        "Your Finished Games": "您已完成的游戏",
        "Review": "回顾",
        "Archived": "已归档",
    },
    "regexp": [ // 正则翻译
        [/Profile \(/, "个人 ("],
        [/Route (?=\d)/, "线路 "],
        [/Updated:/, "更新于:"],
        [/Ended:/, "结束于:"],
    ],
};

I18N.zh["homepage"] = { // 个人资料翻译
    "static": { // 静态翻译
        "About": "关于",
        "Signup": "注册",
        "Login": "登录",
        "1880 is now in production. 1822PNW's variants for adjusting the L/2 train roster have been fixed.": "1880 现在是正式版本。1822PNW 中用于调整 L/2 火车数量的变体规则已经修复。",
        "Learn how to get": "了解如何收到",
        "notifications": "通知",
        "by email, Slack, Discord, and Telegram.": "通过邮箱, Slack, Discord 和 Telegram。",
        "Please submit problem reports and make suggestions for improvements on": "请提交问题报告和提出改进建议于",
        ". Join the": "。加入",
        ". to chat about 18xx and the website.": ". 讨论交流18xx游戏和本网站。",
        "The": "这个",
        "has rules, maps, and other information about all the games, along with an FAQ.": "网站有关于所有游戏的规则、地图和其他信息，以及常见问题解答。",
        "Support our publishers:": "支持我们的发行商:",
        ", and": ", 和",
        "You can support this project on": "您可以支持此项目在",
        ".": "。",
        "18xx.games is a website where you can play async or real-time 18xx games (based on the system originally devised by the brilliant Francis Tresham)! If you are new to 18xx games then Shikoku 1889, 18Chesapeake, or 18MS are good games to begin with.": "18xx.games 是一个可以异步或实时游玩18xx游戏的网站（基于才华横溢的 Francis Tresham 最初设计的系统）！如果您是18xx游戏的新手，那么四国 1889、18切萨皮克 或 18MS 都是不错的入门游戏。",
        "You can play locally with hot seat mode without an account. If you want to play multiplayer, you'll need to create an account.": "你可以在没有帐户的情况下使用热座模式进行本地游戏。如果想进行多人模式，你需要创建一个帐户。",
        "If you look at other people's games, you can make moves to play around but it won't affect them and changes won't be saved. You can clone games in the tools tab and then play around locally.": "如果观战其他人的游戏，你可以四处移动，但这不会影响他们，更改也不会保存。您可以在“工具”选项卡中克隆游戏，然后在本地游玩。",
        "In multiplayer games, you'll also be able to make moves for other players, this is so people can say 'pass me this SR' and you don't need to wait. To use this feature in a game, enable \"Master Mode\" in the Tools tab. Please use it politely!": "在多人模式中，你还可以替代其他玩家行动，这样玩家就可以说“我跳过这个股票轮”，而不需要花时间等待。要在游戏中使用此功能，请在“工具”选项卡中启用“主模式”。请礼貌地使用它！",
        "Send a message (Please keep discussions to 18xx)": "发送一条消息 (请保持讨论 18xx 游戏)",
        "CREATE A NEW GAME": "创建一局新游戏",
        "TUTORIAL": "教程",
        "Hotseat Games": "热座模式游戏",
        "New Games": "新创建的游戏",
        "Active Games": "进行中的游戏",
        "Finished Games": "已结束的游戏",
        "Live": "实时",
        "Async": "异步",
        "Prev": "上一页",
        "Next": "下一页",
        "Filters": "筛选",
        "Reset filters": "重置筛选",
        "(All titles)": "（所有名称）",
        "Auto Routing": "自动线路",
        "Join": "加入",
        "Review": "回顾",
        "Delete": "删除",
        "Confirm": "确认",
        "Enter": "进入",
        "Allows players to request automatic route suggestions. Using them is optional.": "允许玩家寻求自动线路的建议。使用它们是可选的。",
        //游戏名称
        "Shikoku 1889": "四国 1889",
        "Game: Shikoku 1889": "游戏名: 四国 1889",
        "18Chesapeake": "18切萨皮克",
        "Game: 18Chesapeake": "游戏名: 18切萨皮克",
        "18Chesapeake: The Birth of American Railroads": "18切萨皮克: 北美铁路的诞生",
        "Game: 18Chesapeake: The Birth of American Railroads": "游戏名: 18切萨皮克: 北美铁路的诞生",
        "18Chesapeake: Off the Rails": "18切萨皮克: 狂野之路",
        "Game: 18Chesapeake: Off the Rails": "游戏名: 18切萨皮克: 狂野之路",
        //可选规则
        "Off the Rails": "狂野之路",
    },
    "regexp": [ // 正则翻译
        [/Profile \(/, "个人 ("],
        [/Welcome/, "欢迎"],
        [/Players:/, "玩家:"],
        [/Description:/, "描述:"],
        [/Seats:/, "座位:"],
        [/Round:/, "轮次:"],
        [/Result:/, "结果:"],
        [/Optional Rules:/, "可选规则:"],
        [/Game:/, "游戏名:"],
        [/Owner:/, "所有者:"],
        [/Updated:/, "更新于:"],
        [/Ended:/, "结束于:"],
        [/Stock (?=\d)/, "股票轮 "],
        [/Auction (?=\d)/, "拍卖轮 "],
        [/Operating (?=\d)/, "运营轮 "],
        [/Draft (?=\d)/, "Draft轮 "],
        [/Merger (?=\d)/, "合并轮 "],
         
    ],
};

I18N.zh["new_game"] = { // 个人资料翻译
    "static": { // 静态翻译
        "About": "关于",
        "Signup": "注册",
        "Login": "登录",
        "Create New Game": "创建新游戏",
        "If you are new to 18xx games then Shikoku 1889, 18Chesapeake or 18MS are good games to begin with.": "如果您是18xx游戏的新手，那么四国 1889、18切萨皮克 或 18MS 都是不错的入门游戏。",
        "Multiplayer": "多人模式",
        "Hotseat": "热座模式",
        "Import hotseat game": "导入热座模式游戏",
        "Upload file": "上传文件",
        "Add a title": "添加一个标题",
        "Paste JSON game data or upload a file.": "粘贴 JSON 游戏数据或上传一个文件。",
        "Game Variants / Optional Rules": "游戏变体 / 可选规则",
        "Create": "创建",
        "Game Info": "游戏信息",
        "Published by": "出版商为",
        "Rules": "规则",
        "Known Issues": "已知问题",
        "More info": "更多信息",
        "Invite only game": "仅限邀请游戏",
        "Optional random seed": "可选随机种子",
        "Description": "描述",
        "Players": "玩家",
        "Player Names": "玩家名称",
        "Min Players": "最小玩家人数",
        "Max Players": "最大玩家人数",
        "Production": "正式版本",
        "Beta": "Beta 版本",
        "Alpha": "Alpha 版本",
        "Prototype, Production": "雏形, 正式版本",
        "Prototype, Beta": "雏形, Beta 版本",
        "Prototype, Alpha": "雏形, Alpha 版本",
        "Status": "状态",
        "Location": "地点",
        "Title": "标题",
        "Game Options": "游戏选项",
        "Live": "实时",
        "Async": "异步",
        "Auto Routing": "自动线路",
        //game
        "Shikoku 1889": "四国 1889",
        "18Chesapeake": "18切萨皮克",
        "18Chesapeake: The Birth of American Railroads": "18切萨皮克: 北美铁路的诞生",
        "18Chesapeake: Off the Rails": "18切萨皮克: 狂野之路",
        "Off the Rails": "狂野之路",
        "Off the Rails: fewer trains, float at 50%, 1882-like stock market": "狂野之路: 更少的火车, 50%可上市, 类似 1882 的股票市场",

    },
    "regexp": [ // 正则翻译
        [/Profile \(/, "个人 ("],
        [/Designed by/, "设计师为"],
        [/Rules$/, "规则"],
    ],
};

I18N.zh["game"] = { // 个人资料翻译
    "static": { // 静态翻译
        "About": "关于",
        "History": "历史",
        "Optional rules used in this game:": "本局游戏中使用的可选规则:",
        "PRIVATE COMPANY": "私有公司",
        "The Bank": "银行",
        "Bank": "银行",
        "Companies": "公司",
        "Company": "公司",
        "Income": "收入",
        "Cash": "现金",
        "Value": "资产",
        "Liquidity": "流动资产",
        "Certs": "证书",
        "Committed": "承诺",
        "Available": "可用",
        "Shares": "股票",
        "Price": "价格",
        "Shareholder": "股东",
        "Priority Deal": "优先交易权",
        "Shareholder": "股东",

        // 18Chesapeake
        // 18Chesapeake_location
        "Green Spring": "格林斯普林",
        "Washington": "华盛顿",
        // 18Chesapeake_company
        "Delaware and Raritan Canal": "特拉华拉里坦运河公司",
        "Columbia - Philadelphia Railroad": "哥伦比亚费城铁路公司",
        "Baltimore and Susquehanna Railroad": "巴尔的摩萨斯奎哈纳铁路公司",
        "No special ability. Blocks hex K3 while owned by a player.": "没有特殊能力。当拥有人为玩家时, 封阻 K3 六角格。",
        "Blocks hexes H2 and I3 while owned by a player. The owning corporation may lay two connected tiles in hexes H2 and I3. Only #8 and #9 tiles may be used. If any tiles are played in these hexes other than by using this ability, the ability is forfeit. These tiles may be placed even if the owning corporation does not have a route to the hexes. These tiles are laid during the tile laying step and are in addition to the corporation’s tile placement action.": "当拥有人为玩家时, 封阻 H2 和 I3 六角格。拥有它的股份公司可以在 H2 和 I3 六角格铺设两块彼此相连的板块。仅能使用 #8 和 #9 轨道板块。如果其中的任一六角格, 已在本特殊能力以外的情况下放置了任何板块, 则该特殊能力失效。即使拥有它的股份公司还未有线路连通至这些六角格, 这些板块依然可以被放置。这些板块的铺设需在铺设板块步骤中进行, 并且其作为额外的公司放置板块行动。",
        "Blocks hexes F4 and G5 while owned by a player. The owning corporation may lay two connected tiles in hexes F4 and G5. Only #8 and #9 tiles may be used. If any tiles are played in these hexes other than by using this ability, the ability is forfeit. These tiles may be placed even if the owning corporation does not have a route to the hexes. These tiles are laid during the tile laying step and are in addition to the corporation’s tile placement action.": "当拥有人为玩家时, 封阻 F4 和 G5 六角格。拥有它的股份公司可以在 F4 和 G5 六角格铺设两块彼此相连的板块。仅能使用 #8 和 #9 轨道板块。如果其中的任一六角格, 已在本特殊能力以外的情况下放置了任何板块, 则该特殊能力失效。即使拥有它的股份公司还未有线路连通至这些六角格, 这些板块依然可以被放置。这些板块的铺设需在铺设板块步骤中进行, 并且其作为额外的公司放置板块行动。",

    },
    "regexp": [ // 正则翻译
        [/Profile \(/, "个人 ("],
        [/Value:/, "价值:"],
        [/Revenue:/, "收入:"],
        [/Available Tiles:/, "可用板块:"],
        [/Operating Rounds:/, "运营轮:"],
        [/Yellow/, "黄色"],
        [/Certs\//, "证书/"],
        [/\bto float/, "以上市"]
    ],
};

I18N.zh["hotseat"] = { // 个人资料翻译
    "static": { // 静态翻译
        ...I18N.zh["game"]["static"],
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["game"]["regexp"],
    ],
};

I18N.zh["tutorial"] = { // 个人资料翻译
    "static": { // 静态翻译
        ...I18N.zh["game"]["static"],
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["game"]["regexp"],
    ],
};

I18N.zh["about"] = { // 个人资料翻译
    "static": { // 静态翻译
        "About": "关于",
    },
    "regexp": [ // 正则翻译
        [/Profile \(/, "个人 ("],
    ],
};
I18N.zh["signup"] = { // 个人资料翻译
    "static": { // 静态翻译
        "About": "关于",
        "Signup": "注册",
        "Login": "登录",
        "User Name": "用户名",
        "Email": "邮箱",
        "Password": "密码",
        "Forgot Password": "忘记密码",
        "Notifications": "通知",
        "Learn about Notifications": "了解通知",
        "Turn/Message Notifications": "回合/消息通知方式",
        "Create Account": "创建账户",
        "None": "无",
    },
    "regexp": [ // 正则翻译
        [/Profile \(/, "个人 ("],
    ],
};
I18N.zh["login"] = { // 个人资料翻译
    "static": { // 静态翻译
        "About": "关于",
        "Signup": "注册",
        "Login": "登录",
        "Email or Username": "邮箱或用户名",
        "Password": "密码",
        "Forgot Password": "忘记密码",
    },
    "regexp": [ // 正则翻译
        [/Profile \(/, "个人 ("],
    ],
};