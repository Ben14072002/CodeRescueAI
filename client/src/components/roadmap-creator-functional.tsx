import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Copy, Play, ChevronRight, ArrowLeft, Rocket, Code, Database, Shield, Zap } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ProjectInput {
  name: string;
  description: string;
  platform: string;
  dataComplexity: string;
  authenticationNeeds: string;
  integrations: string[];
  hostingType: string;
}

interface RoadmapStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime: string;
  isCompleted: boolean;
  dependencies: number[];
  rescuePrompts: string[];
  startPrompt: string;
  validationChecklist: string[];
  integrationTests: string[];
  previousStepContext?: string;
}

interface Recommendations {
  recommendedTechStack: string[];
  reasoning: string;
  alternatives: string[];
}

interface FunctionalRoadmapCreatorProps {
  onBack: () => void;
}

export function FunctionalRoadmapCreator({ onBack }: FunctionalRoadmapCreatorProps) {
  const [phase, setPhase] = useState<'input' | 'analysis' | 'roadmap' | 'execution'>('input');
  const [projectInput, setProjectInput] = useState<ProjectInput>({
    name: '',
    description: '',
    platform: 'Web Application',
    dataComplexity: 'Database driven',
    authenticationNeeds: 'Simple login',
    integrations: [],
    hostingType: 'Cloud hosting'
  });
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [projectRecipe, setProjectRecipe] = useState<string | null>(null);
  const { toast } = useToast();

  // WORKING PROTOTYPE FIRST APPROACH
  const generateWorkingPrototypePrompt = (input: ProjectInput, recommendations: Recommendations): string => {
    const stack = recommendations.recommendedTechStack;
    const isEcommerce = input.description.toLowerCase().includes('ecommerce') || input.description.toLowerCase().includes('shop') || input.description.toLowerCase().includes('product');
    const isTaskManagement = input.description.toLowerCase().includes('task') || input.description.toLowerCase().includes('todo') || input.description.toLowerCase().includes('project management');
    const isCMS = input.description.toLowerCase().includes('blog') || input.description.toLowerCase().includes('content') || input.description.toLowerCase().includes('article');
    const isDashboard = input.description.toLowerCase().includes('dashboard') || input.description.toLowerCase().includes('analytics') || input.description.toLowerCase().includes('report');

    return `Build a complete, working "${input.name}" application from scratch.

PROJECT DESCRIPTION: "${input.description}"

CRITICAL REQUIREMENT: Build a FULLY FUNCTIONAL app where every feature works end-to-end.

TECH STACK TO USE:
${stack.slice(0, 4).map(tech => `- ${tech}`).join('\n')}

BUILD COMPLETE WORKING APP WITH THESE FILES:

1. **package.json** - Complete dependencies
\`\`\`json
{
  "name": "${input.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \\"npm run server\\" \\"npm run client\\"",
    "server": "nodemon server.js",
    "client": "react-scripts start",
    "build": "react-scripts build"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    ${stack.includes('MongoDB') ? '"mongoose": "^7.0.0",' : '"pg": "^8.8.0",'}
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "axios": "^1.3.0",
    "react-router-dom": "^6.8.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "concurrently": "^7.6.0"
  }
}
\`\`\`

2. **server.js** - Complete backend server
\`\`\`javascript
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
${stack.includes('MongoDB') ? 
  "const mongoose = require('mongoose');" : 
  "const { Pool } = require('pg');"}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database setup
${stack.includes('MongoDB') ? 
  `mongoose.connect('mongodb://localhost:27017/${input.name.toLowerCase().replace(/[^a-z0-9]/g, '')}', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

${isEcommerce ? `// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);` : ''}

${isTaskManagement ? `// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);` : ''}

${isCMS ? `// Post Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);` : ''}` :

  `const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: '${input.name.toLowerCase().replace(/[^a-z0-9]/g, '')}',
  password: 'password',
  port: 5432,
});

// Create tables
const initDB = async () => {
  try {
    await pool.query(\`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    \`);

    ${isEcommerce ? `await pool.query(\`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(50),
        in_stock BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    \`);` : ''}

    ${isTaskManagement ? `await pool.query(\`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    \`);` : ''}

    ${isCMS ? `await pool.query(\`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER REFERENCES users(id),
        published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    \`);` : ''}

    console.log('Database initialized');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

initDB();`}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    ${stack.includes('MongoDB') ? 
      `const user = new User({ username, email, password: hashedPassword });
    await user.save();` :
      `const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    const user = result.rows[0];`}

    res.status(201).json({ message: 'User created successfully', user: { id: user.id, username, email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    ${stack.includes('MongoDB') ? 
      `const user = await User.findOne({ username });` :
      `const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];`}

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, 'your-secret-key');
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

${isEcommerce ? `// Product routes
app.get('/api/products', async (req, res) => {
  try {
    ${stack.includes('MongoDB') ? 
      `const products = await Product.find().sort({ createdAt: -1 });` :
      `const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    const products = result.rows;`}
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    ${stack.includes('MongoDB') ? 
      `const product = new Product({ name, description, price, category });
    await product.save();` :
      `const result = await pool.query(
      'INSERT INTO products (name, description, price, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, category]
    );
    const product = result.rows[0];`}
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});` : ''}

${isTaskManagement ? `// Task routes
app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    ${stack.includes('MongoDB') ? 
      `const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 });` :
      `const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', [req.user.userId]);
    const tasks = result.rows;`}
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    ${stack.includes('MongoDB') ? 
      `const task = new Task({ title, description, userId: req.user.userId });
    await task.save();` :
      `const result = await pool.query(
      'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, req.user.userId]
    );
    const task = result.rows[0];`}
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    ${stack.includes('MongoDB') ? 
      `const task = await Task.findByIdAndUpdate(id, { completed }, { new: true });` :
      `const result = await pool.query(
      'UPDATE tasks SET completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [completed, id, req.user.userId]
    );
    const task = result.rows[0];`}
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});` : ''}

app.listen(PORT, () => {
  console.log(\`${input.name} server running on port \${PORT}\`);
});
\`\`\`

3. **public/index.html** - HTML template
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${input.name}</title>
    <style>
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
    </style>
</head>
<body>
    <div id="root"></div>
</body>
</html>
\`\`\`

4. **src/index.js** - React entry point
\`\`\`javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
\`\`\`

5. **src/App.js** - Main React application
\`\`\`javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

// Auth context
const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(\`\${API_BASE}/login\`, { username, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post(\`\${API_BASE}/register\`, { username, email, password });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) {
    return <div style={{padding: '20px', textAlign: 'center'}}>Loading ${input.name}...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          <nav style={{ 
            backgroundColor: '#fff', 
            padding: '1rem 2rem', 
            borderBottom: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>
              ${input.name}
            </Link>
            {user ? (
              <div>
                <span style={{ marginRight: '1rem' }}>Welcome, {user.username}!</span>
                <button onClick={logout} style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <Link to="/login" style={{ marginRight: '1rem', textDecoration: 'none' }}>Login</Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>Register</Link>
              </div>
            )}
          </nav>

          <Routes>
            <Route path="/" element={user ? <Dashboard /> : <HomePage />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

function HomePage() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#333' }}>${input.name}</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
        ${input.description}
      </p>
      <div>
        <Link to="/register">
          <button style={{ 
            padding: '1rem 2rem', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            fontSize: '1.1rem',
            marginRight: '1rem',
            cursor: 'pointer'
          }}>
            Get Started
          </button>
        </Link>
        <Link to="/login">
          <button style={{ 
            padding: '1rem 2rem', 
            backgroundColor: 'transparent', 
            color: '#007bff', 
            border: '2px solid #007bff', 
            borderRadius: '8px',
            fontSize: '1.1rem',
            cursor: 'pointer'
          }}>
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
}

function LoginPage() {
  const { login } = React.useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login to ${input.name}</h2>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <button type="submit" style={{ 
          width: '100%', 
          padding: '0.75rem', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}>
          Login
        </button>
      </form>
    </div>
  );
}

function RegisterPage() {
  const { register } = React.useContext(AuthContext);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData.username, formData.email, formData.password);
    if (result.success) {
      setSuccess(true);
      setError('');
    } else {
      setError(result.error);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '4rem 2rem', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: '#28a745', marginBottom: '1rem' }}>Registration Successful!</h2>
        <p>You can now <Link to="/login">login</Link> to ${input.name}.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Register for ${input.name}</h2>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username:</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <button type="submit" style={{ 
          width: '100%', 
          padding: '0.75rem', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}>
          Register
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>${input.name} Dashboard</h1>
      
      ${isEcommerce ? '<ProductManager />' : ''}
      ${isTaskManagement ? '<TaskManager />' : ''}
      ${isCMS ? '<PostManager />' : ''}
      ${isDashboard ? '<AnalyticsDashboard />' : ''}
      ${!isEcommerce && !isTaskManagement && !isCMS && !isDashboard ? '<DefaultDashboard />' : ''}
    </div>
  );
}

${isEcommerce ? `function ProductManager() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(\`\${API_BASE}/products\`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(\`\${API_BASE}/products\`, formData);
      setFormData({ name: '', description: '', price: '', category: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div>
      <h2>Product Management</h2>
      
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
            style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem' }}
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem', minHeight: '100px' }}
        />
        <button type="submit" style={{ 
          padding: '0.75rem 1.5rem', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Add Product
        </button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {products.map(product => (
          <div key={product.id || product._id} style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}>
            <h3 style={{ marginTop: 0 }}>{product.name}</h3>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>{product.description}</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#28a745' }}>
              \${parseFloat(product.price).toFixed(2)}
            </p>
            {product.category && (
              <span style={{ 
                backgroundColor: '#e9ecef', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px', 
                fontSize: '0.8rem' 
              }}>
                {product.category}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}` : ''}

${isTaskManagement ? `function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(\`\${API_BASE}/tasks\`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(\`\${API_BASE}/tasks\`, newTask);
      setNewTask({ title: '', description: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const toggleTask = async (taskId, completed) => {
    try {
      await axios.put(\`\${API_BASE}/tasks/\${taskId}\`, { completed: !completed });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div>
      <h2>Task Management</h2>
      
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
          required
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem' }}
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '1rem', minHeight: '100px' }}
        />
        <button type="submit" style={{ 
          padding: '0.75rem 1.5rem', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Add Task
        </button>
      </form>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
        {tasks.map(task => (
          <div key={task.id || task._id} style={{ 
            padding: '1rem', 
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            textDecoration: task.completed ? 'line-through' : 'none',
            opacity: task.completed ? 0.6 : 1
          }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id || task._id, task.completed)}
              style={{ marginRight: '1rem', transform: 'scale(1.2)' }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>{task.title}</h4>
              {task.description && <p style={{ margin: 0, color: '#666' }}>{task.description}</p>}
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            No tasks yet. Add one above!
          </div>
        )}
      </div>
    </div>
  );
}` : ''}

${!isEcommerce && !isTaskManagement && !isCMS && !isDashboard ? `function DefaultDashboard() {
  return (
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
      <h2>Welcome to ${input.name}!</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Your application is ready and fully functional. You can now start building additional features.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4>✅ Authentication</h4>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>User registration and login working</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4>✅ Database</h4>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>Database connection established</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4>✅ API</h4>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>Backend endpoints functional</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4>✅ Frontend</h4>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>React application ready</p>
        </div>
      </div>
    </div>
  );
}` : ''}

export default App;
\`\`\`

## CRITICAL VALIDATION STEPS:

1. **Install dependencies**: \`npm install\`
2. **Start the application**: \`npm run dev\`
3. **Test registration**: Create a new user account
4. **Test login**: Login with created credentials
5. **Test main features**: Verify all core functionality works
6. **Database verification**: Confirm data persistence

## SUCCESS CRITERIA:
- ✅ App runs without errors
- ✅ User can register and login
- ✅ Database operations work
- ✅ All main features are functional
- ✅ Frontend and backend communicate properly

This is a COMPLETE, WORKING application. Every component connects to every other component. The user can complete the full workflow from registration to using core features.

DO NOT create separate components or partial implementations. This is ONE COMPLETE APP that works end-to-end.`;
  };

  const generateAuthenticationIntegrationPrompt = (input: ProjectInput, recommendations: Recommendations): string => {
    return `Add authentication to the existing working "${input.name}" application.

CONTEXT: You already have a functional ${input.name} app. Now enhance it with authentication.

INTEGRATION TASK: Connect authentication to your existing working app.

CURRENT APP STATE VERIFICATION:
1. Confirm your app runs with \`npm run dev\`
2. Verify existing features work
3. Check database connection is active

ADD AUTHENTICATION TO EXISTING APP:

1. **Update your existing server.js** - ADD authentication middleware:
\`\`\`javascript
// ADD these imports at top
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ADD authentication middleware after existing middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ADD auth routes to existing routes
app.post('/api/register', async (req, res) => {
  // [Registration endpoint code]
});

app.post('/api/login', async (req, res) => {
  // [Login endpoint code]
});

// PROTECT existing routes with authenticateToken middleware
// Example: app.get('/api/your-existing-route', authenticateToken, (req, res) => {
\`\`\`

2. **Update your existing React app** - ADD authentication context:
\`\`\`javascript
// ADD to your existing App.js
const AuthContext = React.createContext();

// WRAP your existing content with auth provider
function App() {
  const [user, setUser] = useState(null);
  
  // ADD login/logout functions
  const login = async (username, password) => {
    // Login logic
  };
  
  const logout = () => {
    // Logout logic
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {/* Your existing app content */}
    </AuthContext.Provider>
  );
}
\`\`\`

3. **Test Authentication Integration**:
- Register new user
- Login successfully
- Verify protected routes work
- Confirm existing features still functional

INTEGRATION VALIDATION:
✅ Existing app features still work
✅ New auth features work
✅ Protected content only shows to logged-in users
✅ User sessions persist across browser refresh
✅ Logout clears authentication state

Your app should now have working authentication ADDED to your existing functional features.`;
  };

  const generatePaymentIntegrationPrompt = (input: ProjectInput, recommendations: Recommendations): string => {
    return `Add payment processing to your working "${input.name}" application.

CONTEXT: You have a functional ${input.name} app with authentication. Now add payments.

INTEGRATION TASK: Add Stripe payment processing to existing app.

VERIFY CURRENT STATE:
1. Confirm app runs and authentication works
2. Verify existing features are functional

ADD PAYMENTS TO EXISTING APP:

1. **Install Stripe**: \`npm install stripe @stripe/stripe-js\`

2. **Update server.js** - ADD payment routes:
\`\`\`javascript
// ADD Stripe import
const stripe = require('stripe')('sk_test_your_stripe_secret_key');

// ADD payment routes to existing routes
app.post('/api/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      metadata: {
        userId: req.user.userId
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/confirm-payment', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Update your database with successful payment
      res.json({ success: true, paymentIntent });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
\`\`\`

3. **Add payment component to React app**:
\`\`\`javascript
// ADD to your existing App.js
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');

// ADD payment component to existing dashboard
function PaymentForm({ amount, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create payment intent
      const response = await axios.post(\`\${API_BASE}/create-payment-intent\`, { amount });
      const { clientSecret } = response.data;

      const stripe = await stripePromise;
      
      // Confirm payment (simplified - use Stripe Elements in production)
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2025,
            cvc: '123'
          }
        }
      });

      if (result.error) {
        alert('Payment failed: ' + result.error.message);
      } else {
        await axios.post(\`\${API_BASE}/confirm-payment\`, { 
          paymentIntentId: result.paymentIntent.id 
        });
        onSuccess();
        alert('Payment successful!');
      }
    } catch (error) {
      alert('Payment error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '1.5rem', 
      borderRadius: '8px', 
      marginTop: '1rem' 
    }}>
      <h3>Make Payment</h3>
      <p>Amount: \${amount}</p>
      <button 
        onClick={handlePayment}
        disabled={loading}
        style={{ 
          padding: '0.75rem 1.5rem', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
        Test card: 4242 4242 4242 4242
      </p>
    </div>
  );
}

// INTEGRATE payment into your existing features
// Example: Add \<PaymentForm amount={productPrice} onSuccess={handlePurchase} />
\`\`\`

PAYMENT INTEGRATION VALIDATION:
✅ Payment form displays correctly
✅ Test payment processes successfully
✅ Payment confirmation works
✅ Existing app features still functional
✅ Payment data integrates with your app logic

Your app now has working payments ADDED to your existing functionality.`;
  };

  const generateRealTimeIntegrationPrompt = (input: ProjectInput, recommendations: Recommendations): string => {
    return `Add real-time features to your working "${input.name}" application.

CONTEXT: You have a functional ${input.name} app. Now add live updates and real-time features.

INTEGRATION TASK: Add WebSocket-based real-time functionality to existing app.

VERIFY CURRENT STATE:
1. Confirm app runs and core features work
2. Test existing functionality

ADD REAL-TIME TO EXISTING APP:

1. **Install Socket.io**: \`npm install socket.io socket.io-client\`

2. **Update server.js** - ADD WebSocket support:
\`\`\`javascript
// ADD Socket.io imports
const { createServer } = require('http');
const { Server } = require('socket.io');

// MODIFY your existing server setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// ADD WebSocket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // JOIN user to their personal room
  socket.on('join-user-room', (userId) => {
    socket.join(\`user-\${userId}\`);
  });
  
  // HANDLE real-time events based on your app type
  socket.on('data-updated', (data) => {
    // Broadcast to all users or specific rooms
    io.emit('data-changed', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// UPDATE your existing API endpoints to emit real-time events
// Example: After creating/updating data
app.post('/api/your-existing-endpoint', authenticateToken, async (req, res) => {
  // Your existing logic
  const result = await createOrUpdateData(req.body);
  
  // ADD real-time broadcast
  io.emit('data-changed', {
    type: 'created',
    data: result,
    userId: req.user.userId
  });
  
  res.json(result);
});

// CHANGE app.listen to httpServer.listen
httpServer.listen(PORT, () => {
  console.log(\`${input.name} server with WebSocket running on port \${PORT}\`);
});
\`\`\`

3. **Add real-time to React app**:
\`\`\`javascript
// ADD to your existing App.js
import { io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  
  // ADD WebSocket connection in existing useEffect
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    
    // JOIN user room if authenticated
    if (user) {
      newSocket.emit('join-user-room', user.id);
    }
    
    // LISTEN for real-time updates
    newSocket.on('data-changed', (data) => {
      console.log('Real-time update:', data);
      // Update your existing state/components
      handleRealTimeUpdate(data);
    });
    
    return () => {
      newSocket.close();
    };
  }, [user]);
  
  const handleRealTimeUpdate = (data) => {
    // UPDATE your existing components with new data
    // Example: Refresh product list, update task status, etc.
  };
  
  // Your existing app code continues...
}

// ADD real-time indicators to existing components
function YourExistingComponent() {
  const [isOnline, setIsOnline] = useState(false);
  
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => setIsOnline(true));
      socket.on('disconnect', () => setIsOnline(false));
    }
  }, [socket]);
  
  return (
    <div>
      {/* Your existing component content */}
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        padding: '0.5rem', 
        backgroundColor: isOnline ? '#28a745' : '#dc3545',
        color: 'white',
        borderRadius: '4px',
        fontSize: '0.8rem'
      }}>
        {isOnline ? '🟢 Live' : '🔴 Offline'}
      </div>
    </div>
  );
}
\`\`\`

REAL-TIME INTEGRATION VALIDATION:
✅ WebSocket connection establishes
✅ Real-time status indicator works
✅ Live updates appear across browser tabs
✅ Connection recovery works after disconnect
✅ Existing app features still functional

Your app now has working real-time features ADDED to your existing functionality.`;
  };

  const generateFileUploadIntegrationPrompt = (input: ProjectInput, recommendations: Recommendations): string => {
    return `Add file upload functionality to your working "${input.name}" application.

CONTEXT: You have a functional ${input.name} app. Now add file upload capabilities.

INTEGRATION TASK: Add secure file upload to existing app.

VERIFY CURRENT STATE:
1. Confirm app runs and core features work
2. Test existing functionality

ADD FILE UPLOAD TO EXISTING APP:

1. **Install file upload packages**: \`npm install multer uuid\`

2. **Update server.js** - ADD file upload handling:
\`\`\`javascript
// ADD file upload imports
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// CREATE uploads directory
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// CONFIGURE multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents allowed.'));
    }
  }
});

// ADD static file serving
app.use('/uploads', express.static('uploads'));

// ADD file upload routes to existing routes
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileInfo = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: \`/uploads/\${req.file.filename}\`,
      uploadedBy: req.user.userId
    };
    
    res.json({
      success: true,
      file: fileInfo
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/upload-multiple', authenticateToken, upload.array('files', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const filesInfo = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: \`/uploads/\${file.filename}\`,
      uploadedBy: req.user.userId
    }));
    
    res.json({
      success: true,
      files: filesInfo
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/upload/:filename', authenticateToken, (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join('uploads', filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ success: true, message: 'File deleted' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
\`\`\`

3. **Add file upload component to React app**:
\`\`\`javascript
// ADD to your existing App.js
function FileUploader({ onUploadSuccess, multiple = false }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (files) => {
    setUploading(true);
    try {
      const formData = new FormData();
      
      if (multiple) {
        Array.from(files).forEach(file => {
          formData.append('files', file);
        });
        const response = await axios.post(\`\${API_BASE}/upload-multiple\`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        onUploadSuccess(response.data.files);
      } else {
        formData.append('file', files[0]);
        const response = await axios.post(\`\${API_BASE}/upload\`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        onUploadSuccess([response.data.file]);
      }
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      style={{
        border: \`2px dashed \${dragOver ? '#007bff' : '#ddd'}\`,
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: dragOver ? '#f8f9ff' : '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      {uploading ? (
        <div>
          <div style={{ marginBottom: '1rem' }}>Uploading...</div>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            backgroundColor: '#e9ecef', 
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#007bff',
              animation: 'progress 1s infinite'
            }} />
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
          <p>Drop files here or click to select</p>
          <input
            type="file"
            multiple={multiple}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input" style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'inline-block'
          }}>
            Choose Files
          </label>
          <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
            Supported: Images, PDFs, Documents (max 5MB)
          </p>
        </div>
      )}
    </div>
  );
}

function FileManager() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUploadSuccess = (files) => {
    setUploadedFiles(prev => [...prev, ...files]);
    alert(\`\${files.length} file(s) uploaded successfully!\`);
  };

  const deleteFile = async (filename) => {
    try {
      await axios.delete(\`\${API_BASE}/upload/\${filename}\`);
      setUploadedFiles(prev => prev.filter(f => f.filename !== filename));
      alert('File deleted successfully!');
    } catch (error) {
      alert('Delete failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>File Upload</h3>
      
      <FileUploader onUploadSuccess={handleUploadSuccess} multiple={true} />
      
      {uploadedFiles.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h4>Uploaded Files</h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {uploadedFiles.map((file, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}>
                <div style={{ flex: 1 }}>
                  <strong>{file.originalname}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <a 
                  href={\`http://localhost:5000\${file.url}\`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ marginRight: '1rem', color: '#007bff', textDecoration: 'none' }}
                >
                  View
                </a>
                <button 
                  onClick={() => deleteFile(file.filename)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// INTEGRATE file upload into your existing dashboard
// Add \<FileManager /> to your dashboard component
\`\`\`

FILE UPLOAD INTEGRATION VALIDATION:
✅ File upload form works correctly
✅ Drag and drop functionality works
✅ Files are stored securely
✅ File validation prevents malicious uploads
✅ Uploaded files can be viewed and deleted
✅ Existing app features still functional

Your app now has working file upload ADDED to your existing functionality.`;
  };

  const generateProductionDeploymentPrompt = (input: ProjectInput, recommendations: Recommendations): string => {
    return `Deploy your working "${input.name}" application to production.

CONTEXT: You have a fully functional ${input.name} app running locally. Now deploy it.

DEPLOYMENT TASK: Configure and deploy to production environment.

VERIFY LOCAL STATE:
1. Confirm app runs perfectly with \`npm run dev\`
2. Test all features work locally
3. Ensure database operations function

DEPLOY TO PRODUCTION:

1. **Create production configuration** - UPDATE package.json:
\`\`\`json
{
  "scripts": {
    "start": "node server.js",
    "dev": "concurrently \\"npm run server\\" \\"npm run client\\"",
    "server": "nodemon server.js",
    "client": "react-scripts start",
    "build": "react-scripts build",
    "heroku-postbuild": "npm run build"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
\`\`\`

2. **Update server.js for production**:
\`\`\`javascript
// ADD at the top of server.js
const path = require('path');

// REPLACE existing port configuration
const PORT = process.env.PORT || 5000;

// ADD environment variables for production
const DB_CONNECTION = process.env.DATABASE_URL || 'your-local-db-connection';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// UPDATE database connection for production
${recommendations.recommendedTechStack.includes('MongoDB') ? 
  `mongoose.connect(DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});` :
  `const pool = new Pool({
  connectionString: DB_CONNECTION,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});`}

// ADD static file serving for production build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  // Serve React app for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// UPDATE JWT secret usage
jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET);
jwt.verify(token, JWT_SECRET, (err, user) => {
  // verification logic
});
\`\`\`

3. **Create environment configuration** - CREATE .env file:
\`\`\`
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-super-secure-jwt-secret-key-change-this
PORT=5000
\`\`\`

4. **Deploy to Heroku** (recommended):
\`\`\`bash
# Install Heroku CLI and login
heroku login

# Create Heroku app
heroku create ${input.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}

# Add database addon
${recommendations.recommendedTechStack.includes('MongoDB') ? 
  'heroku addons:create mongolab:sandbox' :
  'heroku addons:create heroku-postgresql:mini'}

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secure-jwt-secret

# Deploy
git add .
git commit -m "Deploy ${input.name} to production"
git push heroku main

# Open your deployed app
heroku open
\`\`\`

5. **Alternative: Deploy to Railway**:
\`\`\`bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Add database
railway add postgresql

# Set environment variables in Railway dashboard
\`\`\`

6. **Alternative: Deploy to Vercel + PlanetScale**:
\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
vercel

# Set up PlanetScale database
# Configure DATABASE_URL in Vercel dashboard
\`\`\`

7. **Update React app for production** - UPDATE src/App.js:
\`\`\`javascript
// UPDATE API base URL for production
const API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api'  // Same domain in production
  : 'http://localhost:5000/api';  // Local development
\`\`\`

PRODUCTION DEPLOYMENT VALIDATION:
✅ App builds without errors
✅ Production database connects
✅ Environment variables are set
✅ App is accessible via public URL
✅ All features work in production
✅ HTTPS is enabled (automatic with most platforms)
✅ Database operations persist data
✅ Authentication works in production

## DEPLOYMENT SUCCESS CHECKLIST:

1. **Access your live app**: Visit the deployed URL
2. **Test registration**: Create a new account
3. **Test login**: Login with created credentials  
4. **Test core features**: Verify all functionality works
5. **Test database**: Confirm data persists across sessions
6. **Test on mobile**: Verify responsive design works

Your ${input.name} app is now LIVE and accessible to users worldwide!

NEXT STEPS:
- Share your app URL with users
- Monitor app performance and logs
- Set up custom domain (optional)
- Configure automated backups
- Add monitoring/analytics tools

Congratulations! Your fully functional ${input.name} application is now deployed to production.`;
  };

  const generateFunctionalRoadmap = (input: ProjectInput, recommendations: Recommendations): RoadmapStep[] => {
    console.log("=== GENERATING FUNCTIONAL ROADMAP ===");
    console.log("Strategy: Working Prototype First");
    console.log("Project Name:", input.name);
    
    const steps: RoadmapStep[] = [];
    let stepNumber = 1;

    // PHASE 1: COMPLETE WORKING PROTOTYPE
    steps.push({
      stepNumber: stepNumber++,
      title: `Build Complete Working Prototype of ${input.name}`,
      description: `Create a fully functional ${input.name} app with all core features working end-to-end. This is a complete, deployable application.`,
      estimatedTime: "30-45 minutes",
      isCompleted: false,
      dependencies: [],
      rescuePrompts: [
        `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} PROTOTYPE**: My ${input.name} prototype is broken. Help me create a complete working app with all features functional. I need a fully working application that I can run and test immediately.`,
        `**AI CODING AGENT RESCUE - FULL STACK**: My full-stack ${input.name} application has errors. Debug and fix all frontend, backend, and database connection issues. I need the complete working app.`
      ],
      startPrompt: generateWorkingPrototypePrompt(input, recommendations),
      validationChecklist: [
        "Complete app runs without errors",
        "All core features are functional",
        "Database operations work correctly", 
        "Frontend and backend communicate properly",
        "User can complete main workflow successfully",
        "Application is ready for production deployment"
      ],
      integrationTests: [
        "Run `npm install` successfully",
        "Run `npm run dev` and app starts on both ports",
        "Register a new user account",
        "Login with created credentials",
        "Test all main features of the application",
        "Verify data persists in database"
      ],
      previousStepContext: "Starting fresh - building complete functional application from scratch"
    });

    // PHASE 2: AUTHENTICATION INTEGRATION (if needed)
    if (input.authenticationNeeds !== 'None') {
      steps.push({
        stepNumber: stepNumber++,
        title: `Enhance Authentication in ${input.name}`,
        description: `Add advanced authentication features to the existing functional ${input.name} app including protected routes and session management.`,
        estimatedTime: "20-25 minutes",
        isCompleted: false,
        dependencies: [1],
        rescuePrompts: [
          `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} AUTH ENHANCEMENT**: My ${input.name} authentication enhancement is broken. Help me add advanced auth features to my working app without breaking existing functionality.`,
        ],
        startPrompt: generateAuthenticationIntegrationPrompt(input, recommendations),
        validationChecklist: [
          "Advanced authentication features work",
          "Protected routes properly secure content",
          "User sessions persist correctly",
          "Auth state management is robust",
          "All original features still work perfectly"
        ],
        integrationTests: [
          "Confirm original app still runs perfectly",
          "Test enhanced authentication features",
          "Verify protected content is properly secured",
          "Check session persistence across browser refresh",
          "Ensure logout clears authentication state properly"
        ],
        previousStepContext: "Working app with basic auth exists. Now enhancing auth capabilities while maintaining all existing functionality."
      });
    }

    // PHASE 3: ADVANCED FEATURES (conditionally add based on project needs)
    if (input.description.toLowerCase().includes('payment') || input.description.toLowerCase().includes('ecommerce') || input.description.toLowerCase().includes('purchase')) {
      steps.push({
        stepNumber: stepNumber++,
        title: `Add Payment Processing to ${input.name}`,
        description: `Integrate Stripe payment processing into the working ${input.name} app for secure transactions.`,
        estimatedTime: "25-35 minutes",
        isCompleted: false,
        dependencies: [input.authenticationNeeds !== 'None' ? 2 : 1],
        rescuePrompts: [
          `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} PAYMENTS**: My ${input.name} payment integration is broken. Help me add Stripe payments to my working app without breaking existing features.`,
        ],
        startPrompt: generatePaymentIntegrationPrompt(input, recommendations),
        validationChecklist: [
          "Payment forms work correctly",
          "Stripe integration processes test payments",
          "Payment confirmations display properly", 
          "Payment data integrates with app logic",
          "All original features still work perfectly"
        ],
        integrationTests: [
          "Confirm original app functionality is intact",
          "Test payment form displays correctly",
          "Process test payment with Stripe test card",
          "Verify payment confirmation appears",
          "Check payment data is stored/handled correctly"
        ],
        previousStepContext: "Working app with authentication exists. Now adding payment processing while maintaining all existing functionality."
      });
    }

    if (input.description.toLowerCase().includes('real-time') || input.description.toLowerCase().includes('live') || input.description.toLowerCase().includes('chat') || input.description.toLowerCase().includes('notification')) {
      steps.push({
        stepNumber: stepNumber++,
        title: `Add Real-time Features to ${input.name}`,
        description: `Integrate WebSocket-based live updates and real-time notifications into the working ${input.name} app.`,
        estimatedTime: "20-30 minutes",
        isCompleted: false,
        dependencies: [input.authenticationNeeds !== 'None' ? 2 : 1],
        rescuePrompts: [
          `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} REALTIME**: My ${input.name} real-time features are broken. Help me add WebSocket live updates to my working app without breaking existing functionality.`,
        ],
        startPrompt: generateRealTimeIntegrationPrompt(input, recommendations),
        validationChecklist: [
          "Real-time updates work across browser tabs",
          "WebSocket connections establish properly",
          "Live data syncs between users",
          "Connection recovery works after disconnect",
          "All original features still work perfectly"
        ],
        integrationTests: [
          "Confirm original app functionality is intact",
          "Open app in multiple browser tabs",
          "Test real-time updates appear in all tabs",
          "Verify WebSocket connection indicator works",
          "Check connection recovers after simulated disconnect"
        ],
        previousStepContext: "Working app exists. Now adding real-time capabilities while maintaining all existing functionality."
      });
    }

    if (input.description.toLowerCase().includes('upload') || input.description.toLowerCase().includes('file') || input.description.toLowerCase().includes('image') || input.description.toLowerCase().includes('document')) {
      steps.push({
        stepNumber: stepNumber++,
        title: `Add File Upload to ${input.name}`,
        description: `Integrate secure file upload functionality into the working ${input.name} app with proper validation and storage.`,
        estimatedTime: "15-25 minutes",
        isCompleted: false,
        dependencies: [input.authenticationNeeds !== 'None' ? 2 : 1],
        rescuePrompts: [
          `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} UPLOADS**: My ${input.name} file upload is broken. Help me add secure file uploads to my working app without breaking existing functionality.`,
        ],
        startPrompt: generateFileUploadIntegrationPrompt(input, recommendations),
        validationChecklist: [
          "File upload forms work correctly",
          "Files are stored securely with validation",
          "Drag and drop functionality works",
          "Uploaded files display and can be managed",
          "All original features still work perfectly"
        ],
        integrationTests: [
          "Confirm original app functionality is intact",
          "Test file upload form works",
          "Upload various file types (images, documents)",
          "Verify files are stored and accessible",
          "Test file deletion functionality"
        ],
        previousStepContext: "Working app exists. Now adding file upload capabilities while maintaining all existing functionality."
      });
    }

    // PHASE 4: PRODUCTION DEPLOYMENT
    steps.push({
      stepNumber: stepNumber++,
      title: `Deploy ${input.name} to Production`,
      description: `Configure and deploy the fully functional ${input.name} app to a production environment with proper security and optimization.`,
      estimatedTime: "15-20 minutes",
      isCompleted: false,
      dependencies: [1],
      rescuePrompts: [
        `**AI CODING AGENT RESCUE - ${input.name.toUpperCase()} DEPLOYMENT**: My ${input.name} deployment is failing. Help me deploy my working app to production with proper configuration.`,
      ],
      startPrompt: generateProductionDeploymentPrompt(input, recommendations),
      validationChecklist: [
        "App deploys without errors to production platform",
        "Production database connects and works properly",
        "Environment variables are configured securely",
        "App is accessible via public URL with HTTPS",
        "All features work correctly in production environment"
      ],
      integrationTests: [
        "Deploy app to chosen platform (Heroku/Railway/Vercel)",
        "Access deployed app via public URL",
        "Test user registration in production",
        "Test login and all features in production",
        "Verify data persists in production database"
      ],
      previousStepContext: "Fully functional app exists locally. Now deploying to production environment for public access."
    });

    console.log("=== FUNCTIONAL ROADMAP COMPLETED ===");
    console.log("Total Steps:", steps.length);
    console.log("Estimated Total Time:", steps.reduce((acc, step) => {
      const time = step.estimatedTime.match(/(\d+)/)?.[0] || "30";
      return acc + parseInt(time);
    }, 0) + " minutes");
    console.log("Strategy: Each step builds on previous working state");

    return steps;
  };

  const generateProjectRecipe = (input: ProjectInput, recommendations: Recommendations): string => {
    return `# ${input.name} - Complete Project Recipe

## Project Overview
**Name:** ${input.name}
**Platform:** ${input.platform}
**Description:** ${input.description}

## Technical Architecture
**Primary Tech Stack:** ${recommendations.recommendedTechStack.slice(0, 4).join(', ')}
**Database:** ${recommendations.recommendedTechStack.includes('MongoDB') ? 'MongoDB' : 'PostgreSQL'}
**Authentication:** ${input.authenticationNeeds}
**Hosting:** ${input.hostingType}

## Project Structure
\`\`\`
${input.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}/
├── server.js                 # Express backend server
├── package.json             # Dependencies and scripts
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── index.js            # React entry point
│   └── App.js              # Main React application
├── uploads/                # File storage directory
└── .env                    # Environment variables
\`\`\`

## Core Features Implementation
1. **User Authentication** - Complete registration and login system
2. **Database Integration** - Full CRUD operations with data persistence
3. **Responsive Frontend** - Modern React-based user interface
4. **API Layer** - RESTful endpoints for all functionality
5. **File Upload** - Secure file handling and storage
6. **Real-time Updates** - WebSocket-based live features
7. **Payment Processing** - Stripe integration for transactions

## Development Workflow
1. **Phase 1:** Build complete working prototype (30-45 min)
2. **Phase 2:** Enhance authentication and security (20-25 min) 
3. **Phase 3:** Add advanced features as needed (15-35 min each)
4. **Phase 4:** Deploy to production environment (15-20 min)

## Deployment Strategy
- **Development:** Local environment with hot reloading
- **Production:** Cloud deployment with automatic builds
- **Database:** Managed database service with backups
- **Security:** Environment variables and secure authentication

## Success Metrics
✅ Complete functional application
✅ All features work end-to-end
✅ Deployed and accessible via public URL
✅ Ready for real users and production traffic

## Next Steps After Completion
1. Share application URL with target users
2. Monitor application performance and logs
3. Collect user feedback for future enhancements
4. Set up analytics and monitoring tools
5. Plan additional features based on user needs

This recipe produces a complete, production-ready application that users can immediately start using.`;
  };

  const analyzeProject = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockRecommendations: Recommendations = {
        recommendedTechStack: projectInput.platform === 'Mobile App' 
          ? ['React Native', 'Node.js', 'MongoDB', 'Express.js']
          : ['React', 'Node.js', 'Express.js', projectInput.dataComplexity === 'Simple forms' ? 'SQLite' : 'PostgreSQL'],
        reasoning: `Based on your ${projectInput.platform.toLowerCase()} requirements and ${projectInput.dataComplexity.toLowerCase()} needs, this stack provides the optimal balance of development speed and scalability.`,
        alternatives: ['Next.js + Prisma', 'Vue.js + Supabase', 'Angular + Firebase']
      };
      
      setRecommendations(mockRecommendations);
      const recipe = generateProjectRecipe(projectInput, mockRecommendations);
      setProjectRecipe(recipe);
      setPhase('analysis');
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRoadmap = async () => {
    if (!recommendations) return;
    
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const steps = generateFunctionalRoadmap(projectInput, recommendations);
      setRoadmapSteps(steps);
      setPhase('roadmap');
    } catch (error) {
      toast({
        title: "Generation Failed", 
        description: "Unable to generate roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const startExecution = () => {
    setPhase('execution');
    if (roadmapSteps.length > 0) {
      setCurrentStep(1);
    }
  };

  const markStepCompleted = (stepNumber: number) => {
    setRoadmapSteps(prev => prev.map(step => 
      step.stepNumber === stepNumber 
        ? { ...step, isCompleted: true }
        : step
    ));
  };

  if (phase === 'input') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Functional Roadmap Creator</h1>
            <p className="text-gray-600">Build complete, working applications with guaranteed functionality</p>
          </div>
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Project Configuration
            </CardTitle>
            <CardDescription>
              Describe your project and we'll create a roadmap that builds a complete, functional application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Project Name</label>
              <Input
                value={projectInput.name}
                onChange={(e) => setProjectInput(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Project Description</label>
              <Textarea
                value={projectInput.description}
                onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project in detail - what it does, who it's for, and key features"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Platform</label>
                <select
                  value={projectInput.platform}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Web Application">Web Application</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Desktop App">Desktop App</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data Complexity</label>
                <select
                  value={projectInput.dataComplexity}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, dataComplexity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Static content">Static content</option>
                  <option value="Simple forms">Simple forms</option>
                  <option value="Database driven">Database driven</option>
                  <option value="Complex data relationships">Complex data relationships</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Authentication</label>
                <select
                  value={projectInput.authenticationNeeds}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, authenticationNeeds: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="None">None</option>
                  <option value="Simple login">Simple login</option>
                  <option value="OAuth/Social login">OAuth/Social login</option>
                  <option value="Role-based access">Role-based access</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hosting Preference</label>
                <select
                  value={projectInput.hostingType}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, hostingType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cloud hosting">Cloud hosting</option>
                  <option value="Self-hosted">Self-hosted</option>
                  <option value="Static hosting">Static hosting</option>
                </select>
              </div>
            </div>

            <Button 
              onClick={analyzeProject} 
              disabled={!projectInput.name || !projectInput.description || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Analyzing Project...
                </>
              ) : (
                <>
                  <Code className="h-4 w-4 mr-2" />
                  Analyze Project & Generate Recipe
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === 'analysis') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Project Analysis Complete</h1>
            <p className="text-gray-600">Review the technical architecture and project recipe</p>
          </div>
          <Button variant="outline" onClick={() => setPhase('input')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Input
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Recommended Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {recommendations?.recommendedTechStack.map((tech, index) => (
                  <Badge key={index} variant="secondary">{tech}</Badge>
                ))}
              </div>
              <p className="text-gray-600">{recommendations?.reasoning}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Complete Project Recipe
              </CardTitle>
              <CardDescription>
                Comprehensive specification for building your functional application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(projectRecipe || '')}
                  className="absolute top-2 right-2 z-10"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm whitespace-pre-wrap max-h-96">
                  {projectRecipe}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strategy: Working Prototype First</CardTitle>
              <CardDescription>
                We build complete, functional applications - not partial components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600">✅ What We Build</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Complete working application in 30-45 minutes</li>
                    <li>• End-to-end functionality from start</li>
                    <li>• Full integration between components</li>
                    <li>• Production-ready deployment</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-600">❌ What We Avoid</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Isolated components that don't connect</li>
                    <li>• Step-by-step micro-builds</li>
                    <li>• Partial implementations</li>
                    <li>• Integration left for later</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={generateRoadmap} disabled={isGenerating} className="flex-1">
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Generating Roadmap...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Generate Functional Roadmap
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'roadmap') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Functional Development Roadmap</h1>
            <p className="text-gray-600">Complete working application guaranteed - each step builds on the previous</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPhase('analysis')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Analysis
            </Button>
            <Button onClick={startExecution} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start Building
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {roadmapSteps.map((step, index) => (
            <Card key={step.stepNumber} className={`${step.isCompleted ? 'border-green-500 bg-green-50' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    {step.isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-semibold">
                        {step.stepNumber}
                      </div>
                    )}
                    {step.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {step.estimatedTime}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Integration Tests
                    </h4>
                    <ul className="space-y-1">
                      {step.integrationTests.map((test, testIndex) => (
                        <li key={testIndex} className="text-sm text-gray-600 flex items-center gap-2">
                          <ChevronRight className="h-3 w-3" />
                          {test}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Success Validation
                    </h4>
                    <ul className="space-y-1">
                      {step.validationChecklist.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-600 flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {step.previousStepContext && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm text-blue-800 mb-1">Previous Step Context</h4>
                      <p className="text-sm text-blue-700">{step.previousStepContext}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <h3 className="text-xl font-bold mb-3 text-center">🎯 Roadmap Success Guarantee</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600">Functional Applications</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{roadmapSteps.reduce((acc, step) => {
                const time = step.estimatedTime.match(/(\d+)/)?.[0] || "30";
                return acc + parseInt(time);
              }, 0)}</div>
              <div className="text-sm text-gray-600">Minutes to Working App</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">Deploy Ready</div>
              <div className="text-sm text-gray-600">Production Ready Output</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'execution') {
    const currentStepData = roadmapSteps.find(step => step.stepNumber === currentStep);
    
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Building {projectInput.name}</h1>
            <p className="text-gray-600">Step {currentStep} of {roadmapSteps.length}</p>
          </div>
          <Button variant="outline" onClick={() => setPhase('roadmap')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmap
          </Button>
        </div>

        {currentStepData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {currentStep}
                    </div>
                    {currentStepData.title}
                  </CardTitle>
                  <CardDescription>{currentStepData.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">AI Assistant Prompt</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(currentStepData.startPrompt)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="max-h-96 overflow-auto">
                        <pre className="text-sm whitespace-pre-wrap">{currentStepData.startPrompt}</pre>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => markStepCompleted(currentStep)}
                        className="flex-1"
                        disabled={currentStepData.isCompleted}
                      >
                        {currentStepData.isCompleted ? 'Completed' : 'Mark as Complete'}
                      </Button>
                      
                      {currentStep < roadmapSteps.length && (
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentStep(currentStep + 1)}
                        >
                          Next Step
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progress Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {roadmapSteps.map((step) => (
                      <div 
                        key={step.stepNumber}
                        className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                          step.stepNumber === currentStep 
                            ? 'bg-blue-50 border border-blue-200' 
                            : step.isCompleted 
                            ? 'bg-green-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setCurrentStep(step.stepNumber)}
                      >
                        {step.isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : step.stepNumber === currentStep ? (
                          <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                            {step.stepNumber}
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs">
                            {step.stepNumber}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{step.title}</div>
                          <div className="text-xs text-gray-500">{step.estimatedTime}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Rescue Prompts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentStepData.rescuePrompts.map((prompt, index) => (
                      <div key={index} className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(prompt)}
                          className="absolute top-2 right-2 z-10"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <div className="bg-red-50 border border-red-200 p-3 rounded text-sm">
                          {prompt}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}