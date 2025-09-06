// api.js - 前端与后端交互的基础封装

/** 上传 FormData 到后端分析接口
 * @param {FormData} formData - 包含文件和文字的 FormData 对象
 * @returns {Promise<Object>} 后端返回的 JSON
 */
async function analyze(formData) {
    const response = await fetch('/analyze', {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) throw new Error('分析请求失败');
    return await response.json();
}


/** 上传 FormData 到后端转换接口
 * @param {FormData} formData - 包含文件和文字的 FormData 对象
 * @returns {Promise<Object>} 后端返回的 JSON
 */
async function convert(formData) {
    const response = await fetch('/convert', {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) throw new Error('转换请求失败');
    return await response.json();
}
