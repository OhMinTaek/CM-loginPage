'use client';

import { useState } from 'react';
import { updateProfile } from '../actions/profile';
import styles from '../styles/profile.module.css';
import Link from 'next/link';

interface ProfileData {
  id: number;
  email: string;
  username: string;
  bio: string | null;
}

export default function ProfileForm({ initialProfile }: { initialProfile: ProfileData }) {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(initialProfile.bio || '');  // null 처리
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // userId를 문자열로 변환
    const result = await updateProfile(initialProfile.id.toString(), bio || '');
    if (result.success) {
      setEditing(false);
    }
    setMessage(result.message);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <Link href="/" className={styles.homeButton}>
            <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"></path>
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"></path>
            </svg>
          </Link>
          <h1>프로필</h1>
        </div>
        
        <div className={styles.info}>
          <p>
            <strong>E-mail: </strong> {initialProfile.email}
          </p>
          <p>
            <strong>Name: </strong> {initialProfile.username}
          </p>
        </div>

        <div className={styles.bioSection}>
          <div className={styles.bioHeader}>
            <h3>자기소개</h3>
            <button
              onClick={() => setEditing(!editing)}
              className={styles.editButton}
            >
              {editing ? '취소' : '수정'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit}>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={styles.bioInput}
                placeholder="자기소개를 입력하세요"
              />
              <button type="submit" className={styles.saveButton}>
                저장
              </button>
            </form>
          ) : (
            <p className={styles.bio}>{bio || '자기소개가 없습니다.'}</p>
          )}
        </div>

        {message && (
          <div className={`${styles.message} ${
            message.includes('오류') ? styles.errorMessage : styles.successMessage
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}