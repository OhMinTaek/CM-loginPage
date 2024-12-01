import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import ProfileForm from './components/ProfileForm';
import { redirect } from 'next/navigation';

interface ProfileData {
  id: number;
  email: string;
  username: string;
  bio: string | null;
}

export default async function ProfilePage() {
  const session = await getSession();

  if (!session.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    redirect('/login');
  }

  const profileData: ProfileData = {
    id: user.id,
    email: user.email,
    username: user.username,
    bio: user.bio
  };

  return <ProfileForm initialProfile={profileData} />;
}