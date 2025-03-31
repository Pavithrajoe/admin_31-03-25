'use client';

import { handleLogin } from '@/app/APILayer/logInuser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginForm: React.FC = () => {
  const [Email, setEmail] = useState<string>('');
  const [Password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Check for a test user
    if (Email === "test@admin.com" && Password === "password123") {
      const testAccessToken = "your-static-access-token"; // Replace with a valid token if needed
      localStorage.setItem("accessToken", testAccessToken); // Store in local storage
      alert("Logged in as Test User");
      router.push("/admin/adminpanel");
      return;
    }

    try {
      await handleLogin(Email, Password); // Normal login
      alert("Login successful");
      router.push("/admin/adminpanel");
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.loginContainer}>
        <form onSubmit={handleSubmit} style={styles.loginForm}>
          <h2 style={styles.heading}>Welcome to Inklidox Labs Admin Panel your control hub!</h2>

          <div style={styles.inputContainer}>
            <span style={styles.icon}>👤</span>
            <input
              type="email"
              placeholder="username"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputContainer}>
            <span style={styles.icon}>🔒</span>
            <input
              type="password"
              placeholder="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.signInBtn}>Sign in</button>
        </form>
      </div>
    </div>
  );
};

// ✅ CSS-IN-JS Styling
const styles: Record<string, React.CSSProperties> = {
  body: {
    margin: 0,
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to bottom, #7dbbe6, #27496d)',
  },
  loginContainer: {
    width: '400px',
    height: '400px',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 0px 20px rgba(255, 255, 255, 0.1)',
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    width: '80%',
  },
  heading: {
    fontSize: '18px',
    color: 'white',
    textAlign: 'center' as 'center',
    marginBottom: '20px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '25px',
    padding: '10px',
    width: '100%',
    marginBottom: '15px',
  },
  icon: {
    marginRight: '10px',
    fontSize: '16px',
    color: 'white',
  },
  input: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    flex: 1,
    color: 'white',
    fontSize: '16px',
  },
  signInBtn: {
    background: '#4b306a',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '25px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
    transition: '0.3s',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
};

export default LoginForm;
