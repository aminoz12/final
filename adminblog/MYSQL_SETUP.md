# 🗄️ MySQL Database Setup for Mad2Moi Blog Admin

## 📋 Prerequisites

### **1. Install MySQL Server**
- **Windows**: Download and install [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- **macOS**: Use Homebrew: `brew install mysql`
- **Linux**: `sudo apt-get install mysql-server` (Ubuntu/Debian)

### **2. Start MySQL Service**
```bash
# Windows (as Administrator)
net start mysql

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

### **3. Secure MySQL Installation**
```bash
# Set root password and secure installation
mysql_secure_installation
```

## 🚀 **Quick Setup**

### **Step 1: Update Configuration**
Edit `config.env` file with your MySQL credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_password_here
DB_NAME=mad2moi_blog_admin
```

### **Step 2: Initialize Database**
```bash
npm run init-db
```

### **Step 3: Start Development Server**
```bash
npm run dev
```

## 🔧 **Manual Setup (Alternative)**

### **1. Create Database Manually**
```sql
CREATE DATABASE mad2moi_blog_admin;
USE mad2moi_blog_admin;
```

### **2. Create Tables**
Run the SQL commands from `src/utils/database.js` manually in MySQL.

### **3. Create Admin User**
```sql
INSERT INTO users (username, email, password_hash, role, first_name, last_name, is_active)
VALUES ('admin', 'admin@mad2moi.com', 'hashed_password_here', 'admin', 'Admin', 'User', true);
```

## 📊 **Database Schema**

### **Tables Created:**
- **`users`** - Admin users and authors
- **`categories`** - Article categories
- **`articles`** - Blog articles
- **`subscribers`** - Newsletter subscribers
- **`analytics`** - User activity tracking
- **`settings`** - Application configuration

### **Key Features:**
- **Foreign Key Relationships** between tables
- **Automatic Timestamps** for created_at/updated_at
- **Enum Fields** for status and roles
- **JSON Fields** for flexible data storage
- **Indexes** on frequently queried fields

## 🔐 **Default Login Credentials**

After initialization, you can login with:
- **Email**: `admin@mad2moi.com`
- **Password**: `admin123`

**⚠️ Important**: Change these credentials in production!

## 🛠️ **Troubleshooting**

### **Common Issues:**

#### **1. Connection Refused**
```bash
# Check if MySQL is running
netstat -ano | findstr :3306  # Windows
lsof -i :3306                 # macOS/Linux
```

#### **2. Access Denied**
```sql
-- Grant privileges to user
GRANT ALL PRIVILEGES ON mad2moi_blog_admin.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

#### **3. Port Already in Use**
```bash
# Find process using port 3306
netstat -ano | findstr :3306
taskkill /PID <process_id> /F
```

#### **4. Character Set Issues**
```sql
-- Set proper character encoding
ALTER DATABASE mad2moi_blog_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 📈 **Performance Optimization**

### **1. MySQL Configuration**
```ini
# my.cnf or my.ini
[mysqld]
innodb_buffer_pool_size = 256M
query_cache_size = 64M
max_connections = 100
```

### **2. Indexes**
```sql
-- Add indexes for better performance
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);
CREATE INDEX idx_articles_published ON articles(published_at);
```

## 🔄 **Migration from localStorage**

The system automatically migrates from localStorage to MySQL when the database is available.

## 📚 **API Endpoints**

### **Subscribers API:**
- `GET /api/subscribers` - List subscribers
- `POST /api/subscribers` - Create subscriber
- `PUT /api/subscribers/:id` - Update subscriber
- `DELETE /api/subscribers/:id` - Delete subscriber
- `GET /api/subscribers/stats` - Get statistics

## 🚀 **Production Deployment**

### **1. Environment Variables**
```env
NODE_ENV=production
DB_HOST=your_production_host
DB_USER=your_production_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_secure_jwt_secret
```

### **2. Database Backup**
```bash
# Create backup
mysqldump -u root -p mad2moi_blog_admin > backup.sql

# Restore backup
mysql -u root -p mad2moi_blog_admin < backup.sql
```

### **3. SSL Connection**
```javascript
// Enable SSL for production
const dbConfig = {
  ...baseConfig,
  ssl: {
    rejectUnauthorized: false
  }
};
```

## 📞 **Support**

If you encounter issues:
1. Check the console logs for error messages
2. Verify MySQL service is running
3. Confirm database credentials are correct
4. Ensure MySQL user has proper privileges

---

**🎉 Congratulations!** Your MySQL database is now set up and ready to power your Mad2Moi Blog Admin system!

