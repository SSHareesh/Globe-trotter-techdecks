from rest_framework import serializers
from core.models import Post, PostLike, Comment

class PostUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    profile_image = serializers.ImageField(allow_null=True)
    city = serializers.CharField(allow_null=True)
    country = serializers.CharField(allow_null=True)


class CommentUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    profile_image = serializers.ImageField(allow_null=True)


class CommentSerializer(serializers.ModelSerializer):
    user = CommentUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PostSerializer(serializers.ModelSerializer):
    user = PostUserSerializer(read_only=True)
    likes_count = serializers.IntegerField(read_only=True, default=0)
    comments_count = serializers.IntegerField(read_only=True, default=0)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'user', 'content', 'destination', 'image',
            'likes_count', 'comments_count', 'is_liked',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return PostLike.objects.filter(user=request.user, post=obj).exists()
        return False

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # If counts not in instance (not annotated), query them
        if not hasattr(instance, 'likes_count'):
            ret['likes_count'] = instance.likes.count()
        if not hasattr(instance, 'comments_count'):
            ret['comments_count'] = instance.comments.count()
        return ret


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['content', 'destination', 'image']

    def create(self, validated_data):
        user = self.context['request'].user
        return Post.objects.create(user=user, **validated_data)


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['content']

    def create(self, validated_data):
        user = self.context['request'].user
        post_id = self.context['post_id']
        post = Post.objects.get(id=post_id)
        return Comment.objects.create(user=user, post=post, **validated_data)
