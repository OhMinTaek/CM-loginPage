import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import TweetList from './components/TweetList';

interface Tweet {
  id: number;
  tweet: string;
  user: {
    username: string;
  };
  _count: {
    likes: number;
  };
}

export default async function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const session = await getSession();

  // 로그인 확인 및 리다이렉트
  if (!session?.user) {
    redirect('/login');
  }

  // 페이지 번호 처리
  const pageParam = searchParams?.page;
  const pageNumber = pageParam && typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1;
  const currentPage = isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;

  // 페이징 설정
  const itemsPerPage = 10;
  const totalTweets = await prisma.tweet.count();
  const totalPages = Math.ceil(totalTweets / itemsPerPage);

  // 트윗 데이터 페칭
  const tweets = await prisma.tweet.findMany({
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
    include: {
      user: true,
      _count: { select: { likes: true } },
    },
    orderBy: { created_at: 'desc' as Prisma.SortOrder },
  }) as Tweet[];

  // 컴포넌트 렌더링
  return <TweetList tweets={tweets} currentPage={currentPage} totalPages={totalPages} />;
}