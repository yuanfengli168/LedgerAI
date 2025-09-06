# LeadgerAI
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