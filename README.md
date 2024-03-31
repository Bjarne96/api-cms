## Description
This project aimed to develop an e-commerce website for selling virgin wool blankets and pillows. To achieve this goal, I co-founded Awakeningbirds UG with two other individuals. As the computer scientist, I was responsible for the IT tasks and decisions of the UG. Eager to learn and keep monthly website costs low, I decided to code everything myself. It made sense to integrate everything into a CMS so that other people could access customer data and edit website content, without having an IT background.

#### Tech-Stack
Due to familiarity and efficiency, I chose React.js, TypeScript, Node.js and Express.js. Additionally, MongoDB seemed like a lightweight and easy-to-learn database solution, making it a good fit. Amazon Web Services (AWS) offers a free EC2 Micro instance for the first 12 months, making the choice of hosting provider easy. We also chose PayPal as the payment service provider due to its support for various payment methods. 

#### Development
I started programming this project from May 2019 to September 2019, and then worked on it intermittently during my studies. I developed the main website in React.js and TypeScript, along with the CMS frontend and backend in Node.js and Express.js. I implemented authentication for administrators and functionalities for creating, editing, and saving content. On the AWS EC2 instance, I installed Nginx as a reverse proxy with SSL, a firewall, the MongoDB server, CI/CD processes, and the different Node.js servers with frontends and the REST API. In August 2021, the last task I worked on was integrating the payment process using the PayPal API.

## Learnings
After developing the payment process, I realized that actual users could make payments on the website, their data would be captured and stored, and I would be responsible for the security of this data and access to our PayPal account. Despite integrating everything, I lacked in-depth knowledge of IT security and had limited experience. It became clear that going into production with this system posed a significant risk, so I decided against it. However, I learned a lot about myself, the technologies I worked with, and the decision-making processes involved.

- For a quick and successful implementation, it would have been better to choose an existing CMS solution.
- React.js as a Single Page Application might not be the best solution for a simple e-commerce website.
<br> A performance-optimized site using native technologies is easier to optimize for On-Page SEO. <br>
<a href="https://github.com/Bjarne96/webbase">Repository of a performance-optimzed website.</a>
- I should have delved deeper into TypeScript; I only grasped its true benefits in later projects.
<br>
<a href="https://github.com/Bjarne96/learn-with-karel">Repository to a TypeScript Project.</a>
- Embarking on a self-developed project entails a large scope, making it challenging to assess the project's timeline and tasks accurately.

*This repository was migrated in 2020 from a part of another repository that included the API, the CMS frontend, and the website together. This was necessary for implementing CI/CD processes into the hosting evironment.
## Installation (DEPRECATED)
Install the Server: <br>
To install npm modules run "npm install".<br>
To build the server: "npm run build".<br>

Start the Server:<br>
To start the server in production: "npm run api"<br>
To start the server in development: "npm run dev"<br>

Server Configuration:<br>
API is on "https://localhost:4000".