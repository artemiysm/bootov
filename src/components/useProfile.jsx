import { usePostById, useUserById } from '../hooks';

export default function UserProfile({ postId }) {
  // Загружаем пост
  const { data: post, isLoading: postLoading } = usePostById(postId);
  // Загружаем автора — НО только после того, как пост загрузился (post?.userId)
  const { data: user, isLoading: userLoading } = useUserById(post?.userId);

  if (postLoading || userLoading) return <div>Загрузка профиля...</div>;
  if (!post) return <div>Пост не найден</div>;

  return (
    <div>
      <h2>Пост: {post.title}</h2>
      <p>{post.body}</p>
      <hr />
      <h3>Автор: {user?.name}</h3>
      <p>Email: {user?.email}</p>
      <p>Город: {user?.address?.city}</p>
    </div>
  );
}