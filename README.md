<div align="center" style="padding:20px;">
  <h1 style="font-size:40px; color:#FF6F61;">🐾 Pawmart Backend – Node.js & MongoDB</h1>
  <p>
    Backend server for <strong>Pawmart</strong> web application where users can adopt pets, purchase pet products, 
    and sellers can list, update, or delete products. Built using <strong>Node.js, Express, MongoDB, Firebase Admin SDK</strong>, 
    and secured with JWT authentication.
  </p>
</div>

<hr/>

<h2 style="color:#FF6F61;">📌 Features</h2>

<h3>🔐 Authentication & Authorization</h3>
<ul>
  <li>Firebase SDK used to verify user authentication tokens</li>
  <li>JWT-based authentication generated for backend session management</li>
  <li>Protected routes for users and sellers</li>
  <li>Cookie-based sessions and secure endpoints</li>
</ul>

<h3>🐶 Pet Adoption & Product Management</h3>
<ul>
  <li>Users can adopt pets by creating adoption requests</li>
  <li>Users can order products from the store</li>
  <li>Sellers can create, update, and delete product listings</li>
  <li>All product & pet listings managed securely in MongoDB</li>
</ul>

<h3>📦 Order & Cart System</h3>
<ul>
  <li>Users can place orders for products</li>
  <li>Admins or sellers can delete or update orders</li>
  <li>Order management API with status updates</li>
</ul>

<h3>🛡 Security & Best Practices</h3>
<ul>
  <li>Helmet for securing HTTP headers</li>
  <li>CORS configured for frontend integration</li>
  <li>Rate limiting using express-rate-limit</li>
  <li>Environment variables managed with dotenv</li>
  <li>Logging using Morgan</li>
</ul>

<hr/>

<h2 style="color:#FF6F61;">🛠 Tech Stack</h2>

<h3>Server</h3>
<ul>
  <li>Node.js</li>
  <li>Express.js</li>
</ul>

<h3>Database</h3>
<ul>
  <li>MongoDB</li>
  <li>Mongoose ODM</li>
</ul>

<h3>Authentication & Security</h3>
<ul>
  <li>Firebase Admin SDK</li>
  <li>jsonwebtoken (JWT)</li>
  <li>bcrypt</li>
  <li>cookie-parser</li>
  <li>helmet</li>
  <li>express-rate-limit</li>
</ul>

<h3>Other Tools</h3>
<ul>
  <li>dotenv</li>
  <li>morgan (logging)</li>
  <li>cors</li>
</ul>

<hr/>

<h2 style="color:#FF6F61;">⚙️ Installation & Setup</h2>

<pre>
<code class="language-bash">
# Clone the repository
git clone https://github.com/BiplobSordar/PawMart-Backend.git

# Navigate into folder
cd PawMart-Backend

# Install dependencies
npm install
</code>
</pre>

<h3>Create a .env file</h3>
<pre>
<code>
PORT=Insert_Your_Port_Number
MONGO_URI=Insert_Your_MongoDb_Uri
CLIENT_URL=Insert_Your_Client_Url
JWT_SECRET=Insert_Your_Jwt_secret
FIREBASE_SA_BASE64=Insert_Your_Firebase_Sdk_creadentials
</code>
</pre>

<h3>Start the server</h3>
<pre>
<code class="language-bash">
npm run dev
</code>
</pre>

<hr/>

<h2 style="color:#FF6F61;">📂 Folder Structure</h2>

<pre>
<code class="language-bash">
root/
 ├─ controllers/
 │   ├─ authController.js
 │   ├─ productController.js
 │   ├─ petController.js
 │   └─ orderController.js
 ├─ models/
 │   ├─ User.js
 │   ├─ Product.js
 │   ├─ Pet.js
 │   └─ Order.js
 ├─ routes/
 │   ├─ authRoutes.js
 │   ├─ productRoutes.js
 │   ├─ petRoutes.js
 │   └─ orderRoutes.js
 ├─ middleware/
 │   └─ authMiddleware.js
 ├─ utils/
 ├─ config/
 │   └─ firebase.js
 ├─ server.js
 └─ app.js
</code>
</pre>

<hr/>

<h2 style="color:#FF6F61;">🛠 API Endpoints (Summary)</h2>

<h3>Users</h3>
<ul>
  <li>POST /api/users/</li>
  <li>POST /api/users/login</li>
  <li>POST /api/users/logout</li>
</ul>



<h3>Products</h3>
<ul>
  <li>POST /api/products</li>
  <li>GET /api/products</li>
  <li>GET /api/my-listing/</li>
  <li>GET /api/products/:id</li>
  <li>PUT /api/products/:id</li>
  <li>DELETE /api/products/:id</li>
</ul>



<h3>Orders</h3>
<ul>
  <li>POST /api/orders</li>
  <li>GET /api/orders</li>
 
</ul>

<h3>Categories</h3>
<ul>
 
  <li>GET /api/categories</li>
 
</ul>

<hr/>

<h2 style="color:#FF6F61;">🚀 Future Improvements</h2>
<ul>
  <li>Real-time notifications</li>
  <li>Payment gateway integration</li>
  <li>Admin dashboard for product & order management</li>
  <li>Enhanced search & filters for pets/products</li>
</ul>

<hr/>

<h2 style="color:#FF6F61;">🧑‍💻 Author</h2>
<p>
  <strong>Biplob Sordar</strong><br/>
  MERN Stack Developer – Bangladesh<br/>
  Portfolio: <em>Add link</em><br/>
  LinkedIn: <em>https://www.linkedin.com/in/biplob-sordar-047a87264/</em>
</p>

<hr/>

<h2>⭐ Support</h2>
<p>If you like this backend project, please star ⭐ the repository!</p>
