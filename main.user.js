// ==UserScript==
// @name         18xx 中文化插件
// @namespace    https://github.com/klingeling/18xx-i18n-plugin/
// @description  中文化 18xx.games 界面的部分菜单及内容。
// @copyright    2023, klingeling
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @version      1.0.0
// @author       klingeling
// @license      GPL-3.0
// @match        https://18xx.games/*
// @require      file://D:/tmp/18xx-I18N/locals.js
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @supportURL   https://github.com/klingeling/18xx-i18n-plugin/issues
// @license MIT
// ==/UserScript==


(function (window, document, undefined) {
    'use strict';

    var enable_RegExp = GM_getValue("enable_RegExp", 1);
    var lang = 'zh'; // 中文

    // 要翻译的页面
    var page = getPage();

    transTitle(); // 页面标题翻译
    page && transBySelector(); // Selector 翻译
    page && traverseNode(document.body); // 立即翻译页面
    watchUpdate();


    /**
     * 监听节点变化, 触发和调用翻译函数
     *
     * 2021-10-07 11:28:30
     * 使用原生API 代替 jQuery 的 `ajaxComplete`函数
     */
    function watchUpdate() {
        const m =
            window.MutationObserver ||
            window.WebKitMutationObserver ||
            window.MozMutationObserver;
        let currentURL = document.URL;

        // 监视 BODY 变化
        const observer = new m(function (mutations, observer) {
            /**
             * 仅翻译变更部分 不在全局匹配
             *
             * 且仅监听:
             *    1. 节点增加
             *    2. 节点属性的变化
             *
             **/
            if(document.URL !== currentURL) {
                currentURL = document.URL;
                page = getPage(); // 仅当, 页面地址发生变化时运行 更新全局变量 page

                // 目前先跟随 url
                transTitle(); // 标题翻译
                page && transBySelector(); // Selector 翻译可能需要延迟运行
            }

            for(let mutation of mutations) { // for速度比forEach快
                if (mutation.addedNodes.length > 0 || mutation.type === 'attributes') { // 仅当节点增加 或者属性更改

                    page && traverseNode(mutation.target);
                }
            }
        });
        const config = {
            subtree: true,
            childList: true,
            attributeFilter: ['value', 'placeholder', 'aria-label', 'data-confirm'], // 仅观察特定属性变化(试验测试阶段，有问题再恢复) , 'datetime'
        }
        observer.observe(document.body, config);

    }

    /**
     * 遍历节点
     *
     * @param {Element} node 节点
     */
    function traverseNode(node) {
        // 跳过忽略
        if (I18N.conf.reIgnoreId.test(node.id) ||
            I18N.conf.reIgnoreClass.test(node.className) ||
            I18N.conf.reIgnoreTag.test(node.tagName) ||
            (node.getAttribute && I18N.conf.reIgnoreItemprop.test(node.getAttribute("itemprop")))
           ) {
            return;
        }

        if (node.nodeType === Node.ELEMENT_NODE) { // 元素节点处理

            // 翻译时间元素
            if (node.tagName === 'RELATIVE-TIME' || node.tagName === 'TIME-AGO'|| node.tagName === 'TIME' || node.tagName === 'LOCAL-TIME') {
                if (node.shadowRoot) {
                    transTimeElement(node.shadowRoot);
                    watchTimeElement(node.shadowRoot);
                 } else {
                     transTimeElement(node);
                 }
                return;
            }

            // 元素节点属性翻译
            if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') { // 输入框 按钮 文本域
                if (node.type === 'button' || node.type === 'submit' || node.type === 'reset') {
                    if (node.hasAttribute('data-confirm')) { // 翻译 浏览器 提示对话框
                        transElement(node, 'data-confirm', true);
                    }
                    transElement(node, 'value');
                } else {
                    transElement(node, 'placeholder');
                }
            } else if (node.tagName === 'BUTTON'){
                if (node.hasAttribute('aria-label') && /tooltipped/.test(node.className)) {
                    transElement(node, 'aria-label', true); // 翻译 浏览器 提示对话框
                }
                if (node.hasAttribute('title')) {
                    transElement(node, 'title', true); // 翻译 浏览器 提示对话框
                }
                if (node.hasAttribute('data-confirm')) {
                    transElement(node, 'data-confirm', true); // 翻译 浏览器 提示对话框 ok
                }
                if (node.hasAttribute('data-confirm-text')) {
                    transElement(node, 'data-confirm-text', true); // 翻译 浏览器 提示对话框 ok
                }
                if (node.hasAttribute('data-confirm-cancel-text')) {
                    transElement(node, 'data-confirm-cancel-text', true); // 取消按钮 提醒
                }
                if (node.hasAttribute('cancel-confirm-text')) {
                    transElement(node, 'cancel-confirm-text', true); // 取消按钮 提醒
                }
                if (node.hasAttribute('data-disable-with')) { // 按钮等待提示
                    transElement(node.dataset, 'disableWith');
                }
            } else if (node.tagName === 'OPTGROUP') { // 翻译 <optgroup> 的 label 属性
                transElement(node, 'label');
            } else if (/tooltipped/.test(node.className)) { // 仅当 元素存在'tooltipped'样式 aria-label 才起效果
                transElement(node, 'aria-label', true); // 带提示的元素，类似 tooltip 效果的
            }

            if (node.childNodes.length >0) {
                for (const child of node.childNodes) {
                    traverseNode(child); // 遍历子节点
                }
            }

        } else if (node.nodeType === Node.TEXT_NODE) { // 文本节点翻译
            if (node.length <= 500){ // 修复 许可证编辑框初始化载入内容被翻译
                transElement(node, 'data');
            }
        }
    }

    /**
     * 获取翻译页面
     *
     *
     * 2021-10-07 11:48:50
     * 参考 v2.0 中规则
     */
    function getPage() {
        const site = location.host.replace(/\.?18xx\.games$/, '') || '18xx'; // 站点
        const pathname = location.pathname; // 当前路径
        let page, t = document.body.className.match(I18N.conf.rePageClass);

        if (pathname === '/' && site === '18xx') { // github.com 首页
            page = 'homepage';
        }  else {
            t = pathname.match(I18N.conf.rePagePath);
            page = t ? t[1] : false; // 取页面 key
        }
        if (!page || I18N[lang][page] == undefined) {
            console.log("请注意对应 page: %s 词库节点不存在", page);
            // return false;
            page = false;
        }
        return page;
    }

    /**
     * 翻译页面标题
     */
    function transTitle() {
        let str; // 翻译结果
        let key = document.title;

        // 静态翻译
        str = I18N[lang]['title']['static'][key];
        if (str) {
            document.title =  str;
            return;
        }

        let res = I18N[lang]['title'].regexp; // 正则标题
        for (let [a, b] of res) {
            str = key.replace(a, b);
            if (str !== key) {
                document.title =  str;
                break;
            }
        }
    }

    /**
     * 时间元素翻译
     *
     * @param {Element} node 节点
     */
    function transTimeElement(el) {
        let str; // 翻译结果
        let key = el.childNodes.length > 0 ? el.lastChild.textContent : el.textContent;
        let res = I18N[lang]['pubilc']['time-regexp']; // 时间正则规则

        for (let [a, b] of res) {
            str= key.replace(a, b);
            if (str !== key) {
                el.textContent = str;
                break;
            }
        }
    }

    /**
     * 监听时间元素变化, 触发和调用时间元素翻译
     *
     * @param {Element} node 节点
     */
    function watchTimeElement(el) {
        const m =
            window.MutationObserver ||
            window.WebKitMutationObserver ||
            window.MozMutationObserver;

        new m(function(mutations) {
            transTimeElement(mutations[0].addedNodes[0]);
        }).observe(el, {
            childList: true
        });
    }

    /**
     * 翻译节点对应属性内容
     *
     * @param {object} el 对象
     * @param {string} field 属性字段
     * @param {boolean} isAttr 是否是 attr 属性
     *
     * @returns {boolean}
     */
    function transElement(el, field, isAttr=false) {
        let str; // 翻译后的文本

        if (!isAttr) { // 非属性翻译
            str = translate(el[field], page);
        } else {
            str = translate(el.getAttribute(field), page);
        }

        if (!str) { // 无翻译则退出
            return false;
        }

        // 替换翻译后的内容
        if (!isAttr) {
            el[field] = str;
        } else {
            el.setAttribute(field, str);
        }
    }

    /**
     * 翻译文本
     *
     * @param {string} text 待翻译字符串
     * @param {string} page 页面字段
     *
     * @returns {string|boolean}
     */
    function translate(text, page) { // 翻译

        // 内容为空, 空白字符和或数字, 不存在英文字母和符号,. 跳过
        if (!isNaN(text) || !/[a-zA-Z,.]+/.test(text)) {
            return false;
        }
        let str;
        let _key = text.trim(); // 去除首尾空格的 key
        let _key_neat = _key.replace(/\xa0|[\s]+/g, ' ') // 去除多余空白字符(&nbsp; 空格 换行符)

        if (page) {
            str = transPage(page, _key_neat); // 翻译已知页面 (局部优先)
        } // 未知页面不翻译

        if (str && str !== _key_neat) { // 已知页面翻译完成
            return text.replace(_key, str);  // 替换原字符，保留首尾空白部分
        }

        return false;
    }

    /**
     * 翻译页面内容
     *
     * @param {string} page 页面
     * @param {string} key 待翻译内容
     *
     * @returns {string|boolean}
     */
    function transPage(page, key) {
        let str; // 翻译结果

        // 静态翻译
        str = I18N[lang][page]['static'][key] || I18N[lang]['pubilc']['static'][key]; // 默认翻译 公共部分
        if (typeof str === 'string') {
            return str;
        }

        // 正则翻译
        if (enable_RegExp){
            let res = I18N[lang][page].regexp; // 正则数组
            res= res.concat(I18N[lang]['pubilc'].regexp); // 追加公共正则
            if (res) {
                for (let [a, b] of res) {
                    str = key.replace(a, b);
                    if (str !== key) {
                        return str;
                    }
                }
            }
        }

        return false; // 没有翻译条目
    }

    /**
     * js原生选择器 翻译元素
     *
     * @param {string} JS 选择器或 CSS 选择器
     *
     * 2022-02-04 19:46:44
     * 灵感参考自：k1995/github-i18n-plugin
     */
    function transBySelector() {
        let res = I18N[lang][page].selector != undefined ? I18N[lang]['pubilc'].selector.concat(I18N[lang][page].selector) : I18N[lang]['pubilc'].selector; // 数组
        if (res) {
            for (let [a, b] of res) {
                let element = document.querySelector(a)
                if (element) {
                    element.textContent = b;
                } else if (document.getElementsByClassName(a).length > 0) {
                    document.getElementsByClassName(a)[0].textContent = b;
                }
            }
        }
    }

    GM_registerMenuCommand("正则切换", () => {
        if (enable_RegExp){
            GM_setValue("enable_RegExp", 0);
            enable_RegExp = 0;
            GM_notification("已关闭正则功能");
        } else {
            GM_setValue("enable_RegExp", 1);
            GM_notification("已开启正则功能");
            location.reload();
        }
    })

})(window, document);
