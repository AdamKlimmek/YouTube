json.partial! "api/videos/video", video: @video

if current_user
    current_user_like = @video.likes.select { |like| current_user.id == like.user_id }[0]
    
    json.currentUserLike current_user_like
end

json.comments do
    @video.comments.each do |comment|
        json.set! comment.id do
            json.partial! "api/comments/comment", comment: comment
        end
    end
end