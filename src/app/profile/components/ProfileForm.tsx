'use client';

import { useState } from 'react';
import { updateProfile } from '../actions/profile';
import styles from '../styles/profile.module.css';

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