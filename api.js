// comment out this function because we no longer need it, we use streaming instead
// /**
//  * Submit reviewed data to backend
//  * @param {Object} reviewedData - The reviewed data JSON object
//  * @returns {Promise<Object>} Backend response JSON
//  */
// async function submitReviewedData(reviewedData) {
//     const response = await fetch('http://127.0.0.1:8000/api/submit-reviewed-data', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(reviewedData)
//     });
//     if (!response.ok) {
//         throw new Error('Failed to submit reviewed data');
//     }
//     // Return the Response object so the caller can handle streaming or JSON as needed
//     return response;
// }
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
    const response = await fetch('http://127.0.0.1:8000/convert', {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        console.error('Error: ', response.statusText);
        throw new Error('转换请求失败');
    }
    // can you write out content of response in console?  console.log('Response: ', response);
    const responseData = await response.json();
    console.log('Response: ', responseData);
    return responseData;
}
