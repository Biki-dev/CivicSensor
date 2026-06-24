import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Issue, Comment } from '@appTypes/index';
import { useAppStore } from '@store/index';
import { colors, palette } from '@theme/colors';
import { spacing, radius, shadows } from '@theme/spacing';
import { typography } from '@theme/typography';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';

interface CommentsModalProps {
  issue: Issue;
  onClose: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({ issue, onClose }) => {
  const { user, comments, addComment, addReply, likeComment } = useAppStore();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const issueComments = comments.filter(c => c.issueId === issue.id && !c.issueId.startsWith('reply'));

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    setIsSubmitting(true);
    addComment(issue.id, user.id, user.displayName, user.avatarUrl, newComment.trim());
    setNewComment('');
    setIsSubmitting(false);
  };

  const handleAddReply = async () => {
    if (!replyText.trim() || !user || !replyingTo) return;
    setIsSubmitting(true);
    addReply(replyingTo, user.id, user.displayName, user.avatarUrl, replyText.trim());
    setReplyText('');
    setReplyingTo(null);
    setIsSubmitting(false);
  };

  const handleLikeComment = (commentId: string) => {
    if (user) {
      likeComment(commentId, user.id);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isLiked = user ? comment.likedByIds.includes(user.id) : false;

    return (
      <View key={comment.id} style={[styles.commentItem, isReply && styles.replyItem]}>
        {/* Comment Header */}
        <View style={styles.commentHeader}>
          {comment.authorAvatar ? (
            <Image source={{ uri: comment.authorAvatar }} style={styles.commentAvatar} />
          ) : (
            <View style={styles.commentAvatarPlaceholder} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.commentAuthor}>{comment.authorName}</Text>
            <Text style={styles.commentTime}>
              {new Date(comment.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        {/* Comment Body */}
        <Text style={styles.commentText}>{comment.text}</Text>

        {/* Comment Actions */}
        <View style={styles.commentActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleLikeComment(comment.id)}
          >
            <Svg width="14" height="14" viewBox="0 0 24 24" fill={isLiked ? colors.brandAccent : 'none'}>
              <Path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke={isLiked ? colors.brandAccent : colors.textMuted}
                strokeWidth="2"
              />
            </Svg>
            <Text style={[styles.actionText, isLiked && { color: colors.brandAccent }]}>
              {comment.likeCount > 0 ? comment.likeCount : 'Like'}
            </Text>
          </TouchableOpacity>

          {!isReply && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            >
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M23 10a1 1 0 0 0-1-1h-6V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12v5.1a1 1 0 0 0 1.75.62l5.3-6.72a1 1 0 0 0 .25-.62v-5.38z"
                  stroke={colors.textMuted}
                  strokeWidth="2"
                  fill="none"
                />
              </Svg>
              <Text style={styles.actionText}>
                {comment.replyCount > 0 ? `Reply (${comment.replyCount})` : 'Reply'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Nested Replies */}
        {!isReply && comment.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {comment.replies.map(reply => renderComment(reply, true))}
          </View>
        )}

        {/* Reply Input */}
        {!isReply && replyingTo === comment.id && (
          <View style={styles.replyInputContainer}>
            <View style={styles.replyInputField}>
              <TextInput
                style={styles.replyInput}
                placeholder="Write a reply..."
                placeholderTextColor={colors.textMuted}
                value={replyText}
                onChangeText={setReplyText}
                multiline
                maxLength={280}
              />
              <TouchableOpacity
                style={[styles.replySubmitBtn, isSubmitting && styles.disabledBtn]}
                onPress={handleAddReply}
                disabled={isSubmitting || !replyText.trim()}
              >
                <Text style={styles.replySubmitText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Modal Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Issue Comments ({issueComments.length})</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Comments List */}
      <ScrollView style={styles.commentsList} showsVerticalScrollIndicator={false}>
        {issueComments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
          </View>
        ) : (
          issueComments.map(comment => renderComment(comment))
        )}
      </ScrollView>

      {/* Add Comment Input */}
      {user && (
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.userAvatar} />
            ) : (
              <View style={styles.userAvatarPlaceholder} />
            )}

            <View style={styles.inputField}>
              <TextInput
                style={styles.input}
                placeholder="Share your thoughts..."
                placeholderTextColor={colors.textMuted}
                value={newComment}
                onChangeText={setNewComment}
                multiline
                maxLength={280}
              />

              <TouchableOpacity
                style={[styles.submitBtn, isSubmitting && styles.disabledBtn]}
                onPress={handleAddComment}
                disabled={isSubmitting || !newComment.trim()}
              >
                <LinearGradient
                  colors={[colors.brandAccent, '#00A896']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitGradient}
                >
                  <Text style={styles.submitText}>Post</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgDark,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.sm,
  },
  headerTitle: {
    ...typography.label,
    color: colors.textOnDark,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgDarkSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 18,
    color: colors.textOnDark,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
  commentItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  replyItem: {
    paddingLeft: spacing.lg,
    marginVertical: spacing.sm,
    paddingVertical: spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: colors.border,
    backgroundColor: colors.bgCard,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.xs,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing.sm,
  },
  commentAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    marginRight: spacing.sm,
  },
  commentAuthor: {
    ...typography.bodySM,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  commentTime: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  commentText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  commentActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionText: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  repliesContainer: {
    marginTop: spacing.md,
  },
  replyInputContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  replyInputField: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-end',
  },
  replyInput: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.input,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    ...typography.bodySM,
    color: colors.textPrimary,
    maxHeight: 80,
    borderWidth: 1,
    borderColor: colors.border,
  },
  replySubmitBtn: {
    backgroundColor: colors.brandAccent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.xs,
    minWidth: 48,
    alignItems: 'center',
  },
  replySubmitText: {
    ...typography.caption,
    color: palette.white,
    fontWeight: '700',
  },
  inputContainer: {
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
  },
  inputField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    borderRadius: radius.input,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
    maxHeight: 80,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitBtn: {
    borderRadius: radius.xs,
    overflow: 'hidden',
    minWidth: 48,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitGradient: {
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  submitText: {
    ...typography.labelSM,
    color: palette.white,
    fontWeight: '800',
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
