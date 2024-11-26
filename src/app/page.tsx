'use client';

import React, { useState, FormEvent } from 'react';
import styles from './styles/login.module.css';

interface LoginState {
  success: boolean;
  message: string;
}

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<LoginState | null>(null);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // FormData 생성 시 e.target 사용
    const formData = new FormData(e.target as HTMLFormElement);
    const password = formData.get('password') as string;
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (password === '12345') {
        setState({
          success: true,
          message: '로그인에 성공했습니다!'
        });
      } else {
        setState({
          success: false,
          message: '비밀번호가 일치하지 않습니다.'
        });
      }
    } catch (error: unknown) {  // any 대신 unknown 사용
      setState({
        success: false,
        message: error instanceof Error ? error.message : '로그인 처리 중 오류가 발생했습니다.'
      });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.logo}>
          <svg data-slot="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path clipRule="evenodd" fillRule="evenodd" d="M13.5 4.938a7 7 0 1 1-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 0 1 .572-2.759 6.026 6.026 0 0 1 2.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0 0 13.5 4.938ZM14 12a4 4 0 0 1-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 0 0 1.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 0 1 1.315-4.192.447.447 0 0 1 .431-.16A4.001 4.001 0 0 1 14 12Z"></path>
          </svg>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.spacer}>
          <div className={styles.spacer}>
            <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z"></path>
              <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z"></path>
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.spacer}>
            <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clipRule="evenodd" fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"></path>
            </svg>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.spacer}>
            <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clipRule="evenodd" fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"></path>
            </svg>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className={styles.input}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? '로그인 중...' : 'Log in'}
          </button>
          
          {state && (
            <div className={`${styles.message} ${styles.spacer} ${
              state.success ? styles.successMessage : styles.errorMessage
            }`}>
              {state.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}