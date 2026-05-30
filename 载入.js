// 载入.js - 安全公告加载模块 (无硬编码令牌/零依赖)
(function() {
    'use strict';

    // 🔧 配置区：修改此处即可切换公告源，无需改动主程序
    const CONFIG = {
        // 推荐：使用 Gitee Raw 地址（公开仓库直接访问，无需 Token）
        // 格式: https://gitee.com/{用户名}/{仓库名}/raw/{分支}/{文件路径}
        ANN_URL: 'https://github.com/GameYellowBox/Test/raw/main/%E5%85%AC%E5%91%8A.md',
        
        // 备用源（可选）：如 GitHub Raw 或 CDN
        FALLBACK_URL: null, 
        
        CACHE_KEY: 'ann_cache_v2',
        CACHE_TTL: 30 * 60 * 1000 // 30分钟缓存，减轻服务器压力
    };

    // 🌐 安全加载公告（暴露给全局）
    window.fetchAnnouncement = async function() {
        const toast = window.toast || console.log;
        const $ = window.$ || (id => document.getElementById(id));
        const esc = window.esc || (t => { const d=document.createElement('div'); d.textContent=t; return d.innerHTML; });
        const marked = window.marked;

        // 1️⃣ 优先读取本地缓存
        const cached = localStorage.getItem(CONFIG.CACHE_KEY);
        if (cached) {
            try {
                const data = JSON.parse(cached);
                if (Date.now() - data.time < CONFIG.CACHE_TTL) {
                    renderAnnouncement(data.content, '已加载缓存公告', 's');
                    return;
                }
            } catch(e) { localStorage.removeItem(CONFIG.CACHE_KEY); }
        }

        toast('正在获取公告...', 'i');

        // 2️⃣ 尝试主地址
        try {
            const res = await fetch(CONFIG.ANN_URL, { 
                method: 'GET',
                headers: { 'Accept': 'text/markdown, text/plain, */*' },
                cache: 'no-store'
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const content = await res.text();
            
            localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify({ content, time: Date.now() }));
            renderAnnouncement(content, '公告加载成功', 's');
            return;
        } catch(e) {
            console.warn('主地址加载失败:', e.message);
        }

        // 3️⃣ 尝试备用地址
        if (CONFIG.FALLBACK_URL) {
            try {
                const res = await fetch(CONFIG.FALLBACK_URL);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const content = await res.text();
                localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify({ content, time: Date.now() }));
                renderAnnouncement(content, '通过备用源加载成功', 's');
                return;
            } catch(e) {
                console.warn('备用地址加载失败:', e.message);
            }
        }

        // 4️⃣ 失败降级：显示友好提示
        renderAnnouncement(
            `### ⚠️ 公告加载失败\n\n- 网络请求受阻或文件未设为公开\n- 建议管理员检查仓库设置或启用 Gitee Pages\n- 错误: ${esc(e.message || '未知')}`, 
            '加载失败', 'e'
        );
    };

    // 🎨 渲染公告到 UI
    function renderAnnouncement(content, msg, type) {
        const toast = window.toast || console.log;
        const $ = window.$ || (id => document.getElementById(id));
        const marked = window.marked;

        let html = content;
        if (typeof marked !== 'undefined') {
            try {
                marked.setOptions({ breaks: true, gfm: true });
                html = marked.parse(content);
            } catch(e) { html = `<pre>${esc(content)}</pre>`; }
        } else {
            html = `<pre style="white-space:pre-wrap;word-break:break-all;font-family:monospace">${esc(content)}</pre>`;
        }

        const annContent = $('annContent');
        const annModal = $('annModal');
        if (annContent) annContent.innerHTML = html;
        if (annModal) annModal.classList.add('act');
        if (toast) toast(msg, type);
    }

    console.log('✅ 载入.js 已就绪 | 安全公告模块加载完成');
})();
