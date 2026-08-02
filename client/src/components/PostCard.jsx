export default function PostCard({ post }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={`http://localhost:5000${post.author.avatar}`}
          alt={post.author.username}
          className="w-12 h-12 rounded-full object-cover"
        />

        <div>
          <h2 className="font-bold">
            {post.author.firstName} {post.author.lastName}
          </h2>

          <p className="text-gray-500 text-sm">
            @{post.author.username}
          </p>
        </div>
      </div>

      <p className="mb-4 whitespace-pre-wrap">
        {post.content}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>❤️ {post.likesCount} Likes</span>

        <span>
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}