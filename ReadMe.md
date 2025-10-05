# LeadgerAI: https://yuanfengli168.github.io/LedgerAI/
- An open source tool that helps you saving at least 30 mins on your financial ledger per month. 
- author: Yuafeng Li
- first Date: Aug 31 2025



## Designs: 

### MVP 1.0 
yuanfeng Li
Aug 31 2025

- frontend: (done by using 1 our with Github copilot on Aug31st 2025)
  - One big form
  - default 1 submit input boxes
  - input boxes has 2 selections: 
    - a) manual Inputs
      - 1. manually input the start date, end date
      - 2. manually input the total number of spendings during this start data and end date
    - b) files upload:
      - 1. only supports uploading excel files for now.
  - a submit button, 
    - debating, whether should we have a next confirmation page or not?
  - Data Pipelines from Frontend is Done. (2 hours Sep062025), next steps is to build microservices of python, and deploy locally, then use HTTPS, and CryptoJS to encrypt all the sending files, and all the contents in the files since they are personal financial informations.


- Data Pipelines, and microservices: 
  - using Python:  
    - because openAI API probably not able to take more than 2 excel files, so we need to turn excel file content into 1 single text file. 
    - using python on a microservices to do 2 things: 
      - 1) create JSON file for the contents that we can send to DEEPSEEK, and OPENAI apis
      - 2) need to create an HTML file, and it is using <td>,<tr>, and a delete button, or recover button.
  - This microservices must be locally deployed, 


- The flow: 
  - 1) frontend
  - 2) submit from frontend
  - 3) go to Data Pipelines, cleasing, and give back HTML to frontend
  - 4) HTML is like a table, wait to remove, add, recover
  - 5) final confirm and submit button clicked on frontend
  - 6) send to Data Pipelines again, to create one piece of information for OPEN AI APIs
  - 7) waiting for APIs reply for total cost, total spendings in (local currency)


MVP2.0: 
- can add encryption for all data transferring to data pipelines
- can add encryption for all data transferring to OPEN AI APIs
- can add a real-time currency exchange view.



- backend: 
  - Open AI apis: 
    - Chatgpt
      - you need to login with your google account, and will lasts the validation for 3 months
    - Deepseek
      - you need to login wit your google account , and will lastes the validation for 3 months


- Default output
  - on another new page, give back few things. 
  - 1) input of open ai apis
    - 1) IP location: if Singapre, all dollars need to give back like SGD
    - 2) default give intotal, you income in USD, your spending in USD, in table views
    - 3) if IP is different, default give second thing SGD/RMB in the next, in table views
  - 2) for mvp1.0, just spending in total , and income in total is enough

MVP2.0 Visions: 
  - 3) after MVP1.0, we add more features. 
  - 4) It is open sources, so we can let everyone to get another api of the users input, and they can substitute the api with theirs



## TODOS:
### from 09212025: 
1. review table currency, description 需要可以改动
2. date 需要可以升序或者降序（其他的以后再说）
3. 也需要可以收缩像Features


### TODOS、From09062025
Data Pipelines from Frontend is Done today. (2 hours Sep062025), next steps is to build microservices of python, and deploy locally, then use HTTPS, and CryptoJS to encrypt all the sending files, and all the contents in the files since they are personal financial informations.

1. 前端集成 CryptoJS 加密：
   - 选择合适的加密算法（如 AES）。
   - 在 api.js 的 analyze/convert 方法中，对所有文本字段加密。
   - 文件加密方案调研（如用 FileReader + CryptoJS）。
   - 前端加密密钥管理方案设计。

2. 后端解密支持：
   - Python 后端集成 CryptoJS 对应算法（如 pycryptodome）。
   - 解密前端加密的内容，确保与前端密钥一致。
   - 测试端到端加密/解密流程。

3. HTTPS 部署：
   - 本地开发环境配置自签名证书。
   - 线上服务器申请并配置正规 SSL/TLS 证书（如 Let’s Encrypt）。
   - 强制所有接口只接受 HTTPS 请求。
   - 检查浏览器和服务器 HTTPS 配置是否生效。

4. 安全性测试与合规：
   - 检查前后端传输和存储环节是否有明文泄露风险。
   - 增加接口鉴权（如 JWT、API Key）。
   - 定期安全审计和漏洞扫描。

5. 文档与用户指引：
   - 在 ReadMe.md 中补充加密和 HTTPS 配置说明。
   - 编写加密/解密使用示例。
   - 用户隐私和数据安全声明。

预期这个用两周做出来。
Analyze 这个要四周，以为还要和GPT， Deepseek 绑定。

## Plans/Predictions: 
- 我觉得大概要做到11/15 号前，我们这个网站可以在local 跑起来，就很不错了。



# Learnings：
- local date time for current month:

  ## 前端日期默认值与时区问题
  - 之前用 `toISOString().slice(0, 10)` 设置 `<input type="date">` 默认值，结果部分用户看到的日期不是本地时间（如显示为8月30日），原因是 `toISOString()` 返回的是 UTC 时间。
  - 解决方法：用本地时间格式，避免时区影响。

  ### 推荐代码
  ```js
  function formatDateLocal(date) {
      let yyyy = date.getFullYear();
      let mm = String(date.getMonth() + 1).padStart(2, '0');
      let dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
  }
  startDateInput.value = formatDateLocal(firstDay);
  endDateInput.value = formatDateLocal(lastDay);
  ```
  - 这样设置 `<input type="date">` 的 value 就是本地时间，用户体验一致。

  ### 总结
  - 日期输入框建议用本地格式，避免 UTC/时区导致的日期偏移。
  - 适用于所有需要本地日期的场景。


## Git push, how to see diff? 

我想要merge 但是保留所有我本地的变化，网上的变化不保留

你可以用如下命令实现“只保留本地变化，丢弃远程变化”：

首先确保你的本地代码是最新的、没问题。
然后强制推送覆盖远程分支：

git push origin main --force
这样会用你本地的 main 分支完全覆盖远程的 main 分支，远程的变化会被丢弃，只保留你的本地内容。

⚠️ 注意：这会丢弃远程 main 上的所有新提交，谨慎操作。如果多人协作，建议先和团队沟通。

如果你只想合并本地和远程的内容，但以本地为主，可以用：


git fetch origingit reset --hard origin/main# 然后用你本地的文件覆盖，再提交并推送
但最直接的就是 git push --force，只保留本地。




# IMPORTANTS LEARNINGS:
1. Never ask Github Copilot to rollback by typing, please either use their discard button (not working sometimes, so I would not recomment), be very cautious, It might delete everything you Wrote;
2. If one functionality is working, please `git add`, then `git commit` because No.1 might happen and Due to AI added thousands lines of code, you as a Human are easy to loss track of what have done or not.