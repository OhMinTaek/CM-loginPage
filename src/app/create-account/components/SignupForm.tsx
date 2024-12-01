'use client';

import React, { useState } from 'react';
import { signupAction } from '../actions/signup';
import { useRouter } from 'next/navigation';
import styles from '../styles/signup.module.css';

interface SignupFormData {
  email: string;
  username: string;
  password: string;
}

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<{
    success?: boolean;
    message?: string;
    errors?: { field: string | number; message: string }[];
  }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormState({});

    try {
      const form = e.currentTarget;
      const result = await signupAction(new FormData(form));
      setFormState(result);
      
    } catch (error) {
        console.error('Form submission error:', error);
        setFormState({ 
          success: false, 
          message: '예기치 못한 오류가 발생했습니다.' 
        });
      } finally {
        setLoading(false);
      }
  };

  const getFieldError = (fieldName: keyof SignupFormData) => {
    return formState.errors?.find(error => error.field === fieldName)?.message;
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>회원가입</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
          <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z"></path>
              <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z"></path>
            </svg>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="example@zod.com"
              required
              className={styles.input}
            />
            {getFieldError('email') && (
              <p className={styles.errorText}>{getFieldError('email')}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
          <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clipRule="evenodd" fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"></path>
            </svg>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="5글자 이상 입력하세요"
              required
              className={styles.input}
            />
            {getFieldError('username') && (
              <p className={styles.errorText}>{getFieldError('username')}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
          <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clipRule="evenodd" fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"></path>
            </svg>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="숫자를 포함한 10글자 이상"
              required
              className={styles.input}
            />
            {getFieldError('password') && (
              <p className={styles.errorText}>{getFieldError('password')}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? '가입 중...' : '가입하기'}
          </button>

          {formState.success && (
            <button 
            onClick={() => router.push('/')} 
            className={styles.successMessage}
          >
            <svg 
              data-slot="icon" 
              fill="none" 
              strokeWidth="1.5" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg" 
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
              >
              </path>
            </svg>
            {formState.message}
          </button>
          )}
          
          {!formState.success && formState.message && (
            <div className={styles.errorMessage}>
              {formState.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}